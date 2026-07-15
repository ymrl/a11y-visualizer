import {
  getKnownRole,
  isHidden,
  isInAriaHidden,
  isInInert,
} from "@a11y-visualizer/dom-utils";
import { computeAccessibleName } from "dom-accessibility-api";
import React from "react";
import { collectShadowRoots } from "../../../src/dom/collectShadowRoots";
import { SettingsContext } from "../../content/contexts/SettingsContext";
import { isAnnouncementSuppressedByModal } from "../../content/dom/detectModals";
import { createLiveRegionMessage } from "../../content/shared/protocol";
import type { AnnouncementItem, LiveLevel } from "../../content/types";
import {
  type AlertHandlerOptions,
  type AlertTracker,
  createAlertTracker,
} from "./createAlertTracker";

const LIVEREGION_SELECTOR =
  "output, [role~='status'], [role~='alert'], [role~='log'], [aria-live]:not([aria-live='off'])";

const ALERT_SELECTOR = "[role~='alert']";

const BUSY_SELECTOR = "[aria-busy='true']";

const getClosestElement = (node: Node): Element | null => {
  if (node.nodeType === Node.ELEMENT_NODE) {
    return node as Element;
  }
  if (node.parentNode) {
    return getClosestElement(node.parentNode);
  }
  return null;
};

const closestNodeOfSelector = (
  node: Node,
  selector: string,
): Element | null => {
  const element = getClosestElement(node);
  if (!element) {
    return null;
  }
  if (element.matches(selector)) {
    return element;
  }
  const found = element.closest(selector);
  if (found) {
    return found;
  }
  // Shadow DOM境界を越えて探索
  const rootNode = element.getRootNode();
  if (rootNode instanceof ShadowRoot) {
    return closestNodeOfSelector(rootNode.host, selector);
  }
  return null;
};

const isBusy = (el: Element): boolean => {
  return el.matches(BUSY_SELECTOR) || el.closest(BUSY_SELECTOR) !== null;
};

type ForwardMode = "postMessage" | "self";

export const useLiveRegionLocal = ({
  parentRef,
  renderType,
  forwardMode,
}: {
  parentRef: React.RefObject<Element>;
  renderType?: "initial" | "enabled" | "visibilitychange";
  forwardMode: ForwardMode;
}) => {
  const {
    showLiveRegions,
    announceOutOfModal,
    announcementMaxSeconds,
    announcementSecondsPerCharacter,
  } = React.useContext(SettingsContext);
  const liveRegionsRef = React.useRef<Element[]>([]);
  const liveRegionObserverRef = React.useRef<MutationObserver | null>(null);
  // Tracks which alerts have already been announced and which ones were
  // skipped because they were not renderable yet (hidden, aria-hidden, inert,
  // busy, or suppressed by a modal). The latter are re-checked on every scan
  // so they can be announced once they become visible.
  const alertTrackerRef = React.useRef<AlertTracker | null>(null);
  if (!alertTrackerRef.current) {
    alertTrackerRef.current = createAlertTracker();
  }

  // Self-mode state (for legacy frames)
  const [announcements, setAnnouncements] = React.useState<AnnouncementItem[]>(
    [],
  );
  const [pausedAnnouncements, setPausedAnnouncements] = React.useState<
    AnnouncementItem[]
  >([]);
  const currentTimeoutRef = React.useRef<number | null>(null);

  const removeFirstAnnouncement = React.useCallback(() => {
    setAnnouncements((prev) => prev.slice(1));
    currentTimeoutRef.current = null;
  }, []);

  const computeDuration = React.useCallback(
    (content: string) =>
      Math.min(
        Math.max(1, content.length) * announcementSecondsPerCharacter * 1000,
        announcementMaxSeconds * 1000,
      ),
    [announcementMaxSeconds, announcementSecondsPerCharacter],
  );

  const addAnnouncement = React.useCallback(
    (content: string, level: LiveLevel) => {
      const duration = computeDuration(content);
      const timestamp = Date.now();

      if (forwardMode === "postMessage") {
        const msg = createLiveRegionMessage(
          content,
          level,
          duration,
          timestamp,
        );
        window.parent.postMessage(msg, "*");
      } else {
        const announcement: AnnouncementItem = {
          content,
          level,
          duration,
          timestamp,
        };
        setAnnouncements((prev) => [...prev, announcement]);
      }
    },
    [computeDuration, forwardMode],
  );

  const clearAnnouncements = React.useCallback(() => {
    if (currentTimeoutRef.current) {
      window.clearTimeout(currentTimeoutRef.current);
      currentTimeoutRef.current = null;
    }
    setAnnouncements((prev) => (prev.length > 0 ? [] : prev));
    setPausedAnnouncements((prev) => (prev.length > 0 ? [] : prev));
  }, []);

  const alertHandlerOptions = React.useMemo<AlertHandlerOptions>(
    () => ({
      isRenderable: (alertElement) =>
        !(
          isHidden(alertElement) ||
          isInAriaHidden(alertElement) ||
          isInInert(alertElement) ||
          isBusy(alertElement)
        ) &&
        !(
          parentRef.current &&
          isAnnouncementSuppressedByModal(
            alertElement,
            parentRef.current,
            announceOutOfModal,
          )
        ),
      announce: (alertElement) => {
        const isAtomic = alertElement.getAttribute("aria-atomic") !== "false";

        let content: string;
        if (isAtomic) {
          const name = computeAccessibleName(alertElement);
          content = [name, alertElement.textContent].filter(Boolean).join(" ");
        } else {
          content = alertElement.textContent || "";
        }

        if (content.trim() === "") {
          content = computeAccessibleName(alertElement) || "";
        }

        addAnnouncement(content, "assertive");
      },
    }),
    [addAnnouncement, parentRef, announceOutOfModal],
  );

  const handleAlertAppearance = React.useCallback(
    (alertElement: Element) => {
      alertTrackerRef.current?.handle(alertElement, alertHandlerOptions);
    },
    [alertHandlerOptions],
  );

  // Timer management for self-mode announcements
  React.useEffect(() => {
    if (forwardMode !== "self") return;
    if (announcements.length === 0) {
      if (currentTimeoutRef.current) {
        window.clearTimeout(currentTimeoutRef.current);
        currentTimeoutRef.current = null;
      }
      return;
    }
    if (currentTimeoutRef.current) {
      return;
    }
    const firstAnnouncement = announcements[0];
    currentTimeoutRef.current = window.setTimeout(() => {
      removeFirstAnnouncement();
    }, firstAnnouncement.duration);
  }, [forwardMode, announcements, removeFirstAnnouncement]);

  const connectLiveRegion = React.useCallback(
    (
      observer: MutationObserver,
      el: Element,
      { firstTime }: { firstTime?: boolean },
    ) => {
      if (!(firstTime && renderType === "enabled")) {
        if (
          el.matches(ALERT_SELECTOR) &&
          !(firstTime && renderType === "enabled")
        ) {
          handleAlertAppearance(el);
        }
        const alertChildren = el.querySelectorAll(ALERT_SELECTOR);
        alertChildren.forEach((alertChild) => {
          handleAlertAppearance(alertChild);
        });
      }

      observer.observe(el, {
        subtree: true,
        childList: true,
        characterData: true,
      });
    },
    [handleAlertAppearance, renderType],
  );

  // Re-evaluate alerts that were previously skipped while not renderable.
  // Attribute/style changes (e.g. toggling display:none) do not reach the
  // childList/characterData observer, so visibility is re-checked on each scan.
  const recheckPendingAlerts = React.useCallback(() => {
    alertTrackerRef.current?.recheckPending(alertHandlerOptions);
  }, [alertHandlerOptions]);

  const observeLiveRegion = React.useCallback(
    (el: Element, { firstTime }: { firstTime?: boolean }) => {
      if (!liveRegionObserverRef.current) {
        return;
      }
      recheckPendingAlerts();
      // Only scan this frame's own live regions (no iframe scanning)
      const shadowRoots = collectShadowRoots(el);
      const liveRegions = [
        ...el.querySelectorAll<Element>(LIVEREGION_SELECTOR),
        ...shadowRoots.flatMap((sr) => [
          ...sr.querySelectorAll<Element>(LIVEREGION_SELECTOR),
        ]),
      ];
      [...liveRegions].forEach((el) => {
        if (
          liveRegionObserverRef.current &&
          !liveRegionsRef.current.includes(el)
        ) {
          connectLiveRegion(liveRegionObserverRef.current, el, { firstTime });
        }
      });
      liveRegionsRef.current = Array.from(liveRegions);
    },
    [connectLiveRegion, recheckPendingAlerts],
  );

  React.useEffect(() => {
    if (!showLiveRegions) {
      if (liveRegionObserverRef.current) {
        liveRegionObserverRef.current.disconnect();
      }
      return;
    }
    const observer = new MutationObserver((records) => {
      const atomicNodes: Element[] = [];
      const updates: { content: string; level: LiveLevel }[] = records
        .map((r) => {
          const targetNode = r.target;
          const targetElement = getClosestElement(targetNode);
          if (
            !targetElement ||
            isHidden(targetElement) ||
            isInAriaHidden(targetElement) ||
            isInInert(targetElement) ||
            isBusy(targetElement)
          ) {
            return null;
          }

          if (
            parentRef.current &&
            isAnnouncementSuppressedByModal(
              targetElement,
              parentRef.current,
              announceOutOfModal,
            )
          ) {
            return null;
          }

          const liveRegionNode = closestNodeOfSelector(
            r.target,
            LIVEREGION_SELECTOR,
          );
          if (!liveRegionNode) {
            return null;
          }
          const ariaLiveAttribute = liveRegionNode?.getAttribute("aria-live");
          if (ariaLiveAttribute === "off") {
            return null;
          }
          const role = liveRegionNode && getKnownRole(liveRegionNode);
          const isAssertive =
            liveRegionNode &&
            (ariaLiveAttribute === "assertive" || role === "alert");
          const level = isAssertive ? "assertive" : "polite";
          const atomicNode =
            role === "alert" || role === "status"
              ? liveRegionNode
              : closestNodeOfSelector(targetNode, "[aria-atomic]");
          const atomicAttribute = atomicNode?.getAttribute?.("aria-atomic");
          // alert / status の aria-atomic の暗黙値は true だが、
          // 明示的な aria-atomic="false" があれば上書きできる
          const isAtomic =
            ((role === "alert" || role === "status") &&
              atomicAttribute !== "false") ||
            atomicAttribute === "true";
          if (isAtomic && atomicNode) {
            if (atomicNodes.includes(atomicNode)) {
              return null;
            }
            atomicNodes.push(atomicNode);
            const name =
              liveRegionNode && computeAccessibleName(liveRegionNode);
            const content = atomicNode.textContent;
            if (!content) {
              return null;
            }
            return {
              content: [name, atomicNode.textContent].filter(Boolean).join(" "),
              level,
            };
          }
          const relevant = (
            liveRegionNode?.getAttribute?.("aria-relevant") || "additions text"
          ).split(/\s/);
          const removals =
            relevant.includes("removals") || relevant.includes("all");
          const additions =
            relevant.includes("additions") || relevant.includes("all");
          const text = relevant.includes("text") || relevant.includes("all");

          const contents = [
            (text &&
              r.removedNodes.length === 0 &&
              r.addedNodes.length === 0 &&
              targetNode?.textContent) ||
              "",
            ...[...(removals ? r.removedNodes : [])].map(
              (n) => n.textContent || "",
            ),
            // 要素ノードの追加は additions、テキストノードの追加は text で判定する。
            // 空の aria-relevant="additions" リージョンへのテキスト挿入は
            // テキストノードの追加であり、NVDA では通知されないため通知しない。
            ...[...r.addedNodes]
              .filter((n) => (n.nodeType === Node.TEXT_NODE ? text : additions))
              .map((n) => n.textContent || ""),
          ].filter(Boolean);
          return contents.length > 0
            ? { content: contents.join(" "), level }
            : null;
        })
        .filter((e): e is { content: string; level: LiveLevel } => e !== null);

      if (forwardMode === "self") {
        if (updates.length > 0 && pausedAnnouncements.length > 0) {
          setPausedAnnouncements([]);
        }
        const hasAssertive = updates.some((u) => u.level === "assertive");
        if (hasAssertive) {
          clearAnnouncements();
        }
        updates.forEach((c) => {
          if (hasAssertive && c.level === "polite") {
            return;
          }
          addAnnouncement(c.content, c.level);
        });
      } else {
        // postMessage mode: forward all updates
        updates.forEach((c) => {
          addAnnouncement(c.content, c.level);
        });
      }
    });
    liveRegionsRef.current.forEach((el) => {
      connectLiveRegion(observer, el, {});
    });
    liveRegionObserverRef.current = observer;

    return () => {
      observer.disconnect();
      liveRegionObserverRef.current = null;
    };
  }, [
    showLiveRegions,
    announceOutOfModal,
    connectLiveRegion,
    addAnnouncement,
    clearAnnouncements,
    pausedAnnouncements,
    parentRef,
    forwardMode,
  ]);

  // Keyboard/touch/focus listeners for self-mode
  React.useEffect(() => {
    if (forwardMode !== "self") return;
    if (announcements.length === 0 && pausedAnnouncements.length === 0) {
      return;
    }
    const pauseOrResumeAnnouncements = () => {
      if (announcements.length > 0) {
        if (currentTimeoutRef.current) {
          window.clearTimeout(currentTimeoutRef.current);
          currentTimeoutRef.current = null;
        }
        setPausedAnnouncements(announcements);
        setAnnouncements([]);
      } else {
        setAnnouncements((prev) => [...prev, ...pausedAnnouncements]);
        setPausedAnnouncements([]);
      }
    };

    const keyListener = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        pauseOrResumeAnnouncements();
      } else if (e.key === "Control") {
        clearAnnouncements();
      }
    };
    const touchStartListener = () => {
      clearAnnouncements();
    };

    window.addEventListener("keydown", keyListener);
    window.addEventListener("focusin", clearAnnouncements);
    window.addEventListener("touchstart", touchStartListener, {
      passive: true,
    });

    return () => {
      window.removeEventListener("keydown", keyListener);
      window.removeEventListener("focusin", clearAnnouncements);
      window.removeEventListener("touchstart", touchStartListener);
    };
  }, [forwardMode, announcements, clearAnnouncements, pausedAnnouncements]);

  return {
    observeLiveRegion,
    announcements,
    addAnnouncement,
  };
};
