import React from "react";
import { SettingsContext } from "../contexts/SettingsContext";
import { isInAriaHidden } from "../dom";
import { isHidden } from "../../../src/dom/isHidden";
import { getKnownRole } from "../../../src/dom/getKnownRole";
import { detectModals } from "../dom/detectModals";
import { computeAccessibleName } from "dom-accessibility-api";

const LIVEREGION_SELECTOR =
  "output, [role~='status'], [role~='alert'], [role~='log'], [aria-live]:not([aria-live='off'])";

const ALERT_SELECTOR = "[role~='alert']";

export type LiveLevel = "polite" | "assertive";

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
  return element.closest(selector) || null;
};

const getLiveRegions = (
  el: Element,
  iframeElements: HTMLIFrameElement[],
): Element[] => [
  ...el.querySelectorAll<Element>(LIVEREGION_SELECTOR),
  ...iframeElements
    .map((iframe): Element[] => {
      try {
        if (iframe.contentWindow?.document?.readyState === "complete") {
          return [
            ...iframe.contentWindow.document.querySelectorAll<Element>(
              LIVEREGION_SELECTOR,
            ),
          ];
        }
      } catch {
        /* noop */
      }
      return [];
    })
    .flat(),
];

export const useLiveRegion = ({
  parentRef,
  iframeElements,
}: {
  parentRef: React.RefObject<Element>;
  iframeElements: HTMLIFrameElement[];
}) => {
  const {
    showLiveRegions,
    announcementMaxSeconds,
    announcementSecondsPerCharacter,
  } = React.useContext(SettingsContext);
  const liveRegionsRef = React.useRef<Element[]>([]);
  const liveRegionObserverRef = React.useRef<MutationObserver | null>(null);
  const processedAlertsRef = React.useRef<WeakSet<Element>>(new WeakSet());
  const [announcements, setAnnouncements] = React.useState<
    { content: string; level: LiveLevel; duration: number }[]
  >([]);
  const [pausedAnnouncements, setPausedAnnouncements] = React.useState<
    { content: string; level: LiveLevel; duration: number }[]
  >([]);
  const currentTimeoutRef = React.useRef<number | null>(null);

  const removeFirstAnnouncement = React.useCallback(() => {
    setAnnouncements((prev) => prev.slice(1));
    currentTimeoutRef.current = null;
  }, []);

  const addAnnouncement = React.useCallback(
    (content: string, level: LiveLevel) => {
      const duration = Math.min(
        Math.max(1, content.length) * announcementSecondsPerCharacter * 1000,
        announcementMaxSeconds * 1000,
      );
      const announcement = { content, level, duration };

      setAnnouncements((prev) => [...prev, announcement]);
    },
    [announcementMaxSeconds, announcementSecondsPerCharacter],
  );

  const handleAlertAppearance = React.useCallback(
    (alertElement: Element) => {
      if (processedAlertsRef.current.has(alertElement)) {
        return; // 既に処理済み
      }

      if (isHidden(alertElement) || isInAriaHidden(alertElement)) {
        return; // 隠されている要素は処理しない
      }

      // モーダルチェック
      if (parentRef.current) {
        const modals = detectModals(parentRef.current);
        if (modals.length > 0) {
          const isInsideModal = modals.some(
            (modal) => modal.contains(alertElement) || modal === alertElement,
          );
          if (!isInsideModal) {
            return;
          }
        }
      }

      processedAlertsRef.current.add(alertElement);

      // alert要素の内容を取得
      const atomicNode = closestNodeOfSelector(alertElement, "[aria-atomic]");
      const isAtomic = atomicNode?.getAttribute?.("aria-atomic") === "true";

      let content: string;
      if (isAtomic) {
        const name = computeAccessibleName(alertElement);
        content = [name, atomicNode.textContent].filter(Boolean).join(" ");
      } else {
        content = alertElement.textContent || "";
      }

      // 内容が空でも通知する（スクリーンリーダーの一部実装に合わせる）
      if (content.trim() === "") {
        content = computeAccessibleName(alertElement) || "";
      }

      addAnnouncement(content, "assertive");
    },
    [addAnnouncement, parentRef],
  );

  const pauseAnnouncements = React.useCallback(() => {
    if (currentTimeoutRef.current) {
      window.clearTimeout(currentTimeoutRef.current);
      currentTimeoutRef.current = null;
    }

    setPausedAnnouncements(announcements);
    setAnnouncements([]);
  }, [announcements]);

  const resumeAnnouncements = React.useCallback(() => {
    setAnnouncements((prev) => [...prev, ...pausedAnnouncements]);
    setPausedAnnouncements([]);
  }, [pausedAnnouncements]);

  const pauseOrResumeAnnouncements = React.useCallback(() => {
    if (announcements.length > 0) {
      pauseAnnouncements();
    } else {
      resumeAnnouncements();
    }
  }, [announcements, pauseAnnouncements, resumeAnnouncements]);

  const clearAnnouncements = React.useCallback(() => {
    if (currentTimeoutRef.current) {
      window.clearTimeout(currentTimeoutRef.current);
      currentTimeoutRef.current = null;
    }
    setAnnouncements((prev) => (prev.length > 0 ? [] : prev));
    setPausedAnnouncements((prev) => (prev.length > 0 ? [] : prev));
  }, []);

  // announcements の変化に応じてタイマーを管理
  React.useEffect(() => {
    if (announcements.length === 0) {
      // アナウンスがない場合はタイマーをクリア
      if (currentTimeoutRef.current) {
        window.clearTimeout(currentTimeoutRef.current);
        currentTimeoutRef.current = null;
      }
      return;
    }

    // 既にタイマーが動いている場合は何もしない
    if (currentTimeoutRef.current) {
      return;
    }

    // 最初のアナウンスのタイマーを開始
    const firstAnnouncement = announcements[0];
    currentTimeoutRef.current = window.setTimeout(() => {
      removeFirstAnnouncement();
    }, firstAnnouncement.duration);
  }, [announcements, removeFirstAnnouncement]);

  const connectLiveRegion = React.useCallback(
    (observer: MutationObserver, el: Element) => {
      if (el.matches(ALERT_SELECTOR)) {
        handleAlertAppearance(el);
      }
      // 子要素にalert要素があるかチェック
      const alertChildren = el.querySelectorAll(ALERT_SELECTOR);
      alertChildren.forEach((alertChild) => {
        handleAlertAppearance(alertChild);
      });

      observer.observe(el, {
        subtree: true,
        childList: true,
        characterData: true,
      });
    },
    [handleAlertAppearance],
  );

  const observeLiveRegion = React.useCallback(
    (el: Element) => {
      if (!liveRegionObserverRef.current) {
        return;
      }
      const liveRegions = getLiveRegions(el, iframeElements);
      [...liveRegions].forEach((el) => {
        if (
          liveRegionObserverRef.current &&
          !liveRegionsRef.current.includes(el)
        ) {
          connectLiveRegion(liveRegionObserverRef.current, el);
        }
      });
      liveRegionsRef.current = Array.from(liveRegions);
    },
    [connectLiveRegion, iframeElements],
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
            isInAriaHidden(targetElement)
          ) {
            return null;
          }

          // モーダルが表示されている場合、モーダル外の要素は通知しない
          if (parentRef.current) {
            const modals = detectModals(parentRef.current);
            if (modals.length > 0) {
              const isInsideModal = modals.some(
                (modal) =>
                  modal.contains(targetElement) || modal === targetElement,
              );
              if (!isInsideModal) {
                return null;
              }
            }
          }

          const liveRegionNode = closestNodeOfSelector(
            r.target,
            LIVEREGION_SELECTOR,
          );
          const ariaLiveAttribute = liveRegionNode?.getAttribute("aria-live");
          if (ariaLiveAttribute === "off") {
            return null;
          }
          const isAssertive =
            liveRegionNode &&
            (ariaLiveAttribute === "assertive" ||
              getKnownRole(liveRegionNode) === "alert");
          const level = isAssertive ? "assertive" : "polite";
          const atomicNode = closestNodeOfSelector(targetNode, "[aria-atomic]");
          const isAtomic = atomicNode?.getAttribute?.("aria-atomic") === "true";
          if (isAtomic) {
            if (atomicNodes.includes(atomicNode)) {
              return null; // 重複したアナウンスは無視
            }
            atomicNodes.push(atomicNode);
            const name =
              liveRegionNode && computeAccessibleName(liveRegionNode);
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

          const content = [
            (r.removedNodes.length === 0 &&
              r.addedNodes.length === 0 &&
              targetNode?.textContent) ||
              "",
            ...[...(removals ? r.removedNodes : [])].map(
              (n) => n.textContent || "",
            ),
            ...[...(additions ? r.addedNodes : [])].map(
              (n) => n.textContent || "",
            ),
          ]
            .filter(Boolean)
            .join(" ");
          return { content, level };
        })
        .filter((e): e is { content: string; level: LiveLevel } => e !== null);

      if (updates.length > 0 && pausedAnnouncements.length > 0) {
        setPausedAnnouncements([]);
      }
      if (updates.some((u) => u.level === "assertive")) {
        clearAnnouncements();
      }
      updates.forEach((c) => {
        addAnnouncement(c.content, c.level);
      });
    });
    liveRegionsRef.current.forEach((el) => connectLiveRegion(observer, el));
    liveRegionObserverRef.current = observer;

    // 既存のalert要素も処理
    if (parentRef.current) {
      const existingAlerts = parentRef.current.querySelectorAll(ALERT_SELECTOR);
      existingAlerts.forEach((alert) => {
        if (!processedAlertsRef.current.has(alert)) {
          handleAlertAppearance(alert);
        }
      });
    }

    return () => {
      observer.disconnect();
      liveRegionObserverRef.current = null;
    };
  }, [
    showLiveRegions,
    announcementMaxSeconds,
    announcementSecondsPerCharacter,
    connectLiveRegion,
    addAnnouncement,
    clearAnnouncements,
    pausedAnnouncements,
    parentRef,
    handleAlertAppearance,
  ]);

  React.useEffect(() => {
    if (announcements.length === 0 && pausedAnnouncements.length === 0) {
      return;
    }
    const w = parentRef.current?.ownerDocument?.defaultView;
    const windows = [
      w,
      ...iframeElements.map((iframe) => iframe.contentWindow),
    ];
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        pauseOrResumeAnnouncements();
      } else if (e.key === "Control") {
        clearAnnouncements();
      }
    };

    windows.forEach((w) => {
      if (!w) return;
      try {
        w.addEventListener("keydown", listener);
        w.addEventListener("focusin", clearAnnouncements);
      } catch {
        /* noop */
      }
    });

    return () => {
      windows.forEach((w) => {
        if (!w) return;
        try {
          w.removeEventListener("keydown", listener);
          w.removeEventListener("focusin", clearAnnouncements);
        } catch {
          /* noop */
        }
      });
    };
  }, [
    announcements,
    clearAnnouncements,
    iframeElements,
    parentRef,
    pauseOrResumeAnnouncements,
    pausedAnnouncements,
  ]);

  return {
    observeLiveRegion,
    announcements,
  };
};
