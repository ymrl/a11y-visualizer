import React from "react";
import { SettingsContext } from "../contexts/SettingsContext";
import { isInAriaHidden } from "../dom";
import { isHidden } from "../../../src/dom/isHidden";
import { getKnownRole } from "../../../src/dom/getKnownRole";
import { detectModals } from "../dom/detectModals";
import { computeAccessibleName } from "dom-accessibility-api";

const LIVEREGION_SELECTOR =
  "output, [role~='status'], [role~='alert'], [role~='log'], [aria-live]:not([aria-live='off'])";

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

const closestNodeOfSelector = (node: Node, selector: string): Element | null => {
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
  const [announcements, setAnnouncements] = React.useState<
    { content: string; level: LiveLevel; until: number }[]
  >([]);
  const [pausedAnnouncements, setPausedAnnouncements] = React.useState<
    { content: string; level: LiveLevel; rest: number }[]
  >([]);
  const timeoutIdsRef = React.useRef<number[]>([]);

  const connectLiveRegion = React.useCallback(
    (observer: MutationObserver, el: Element) => {
      observer.observe(el, {
        subtree: true,
        childList: true,
        characterData: true,
      });
    },
    [],
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

  const showAnnouncement = React.useCallback(
    (content: string, level: LiveLevel, msec: number) => {
      const until = new Date().getTime() + msec;
      const announcement = { content, level, until };
      const timeoutId = window.setTimeout(() => {
        setAnnouncements((prev) => {
          const idx = prev.indexOf(announcement);
          return idx === -1
            ? prev
            : [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        });
        timeoutIdsRef.current = timeoutIdsRef.current.filter(
          (id) => id !== timeoutId,
        );
      }, msec);
      timeoutIdsRef.current.push(timeoutId);
      setAnnouncements((prev) => [...prev, announcement]);
    },
    [],
  );

  const addAnnouncement = React.useCallback(
    (content: string, level: LiveLevel) => {
      const msec = Math.min(
        content.length * announcementSecondsPerCharacter * 1000,
        announcementMaxSeconds * 1000,
      );
      showAnnouncement(content, level, msec);
    },
    [announcementMaxSeconds, announcementSecondsPerCharacter, showAnnouncement],
  );

  const pauseAnnouncements = React.useCallback(() => {
    const stoppedAt = new Date().getTime();
    timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutIdsRef.current = [];
    setPausedAnnouncements(
      announcements
        .map((a) => ({
          content: a.content,
          level: a.level,
          rest: a.until - stoppedAt,
        }))
        .filter((a) => a.rest > 0),
    );
    setAnnouncements([]);
  }, [announcements]);

  const resumeAnnouncements = React.useCallback(() => {
    pausedAnnouncements.forEach((a) =>
      showAnnouncement(a.content, a.level, a.rest),
    );
    setPausedAnnouncements([]);
  }, [showAnnouncement, pausedAnnouncements]);

  const pauseOrResumeAnnouncements = React.useCallback(() => {
    if (announcements.length > 0) {
      pauseAnnouncements();
    } else {
      resumeAnnouncements();
    }
  }, [announcements, pauseAnnouncements, resumeAnnouncements]);

  const clearAnnouncements = React.useCallback(() => {
    if (timeoutIdsRef.current.length > 0) {
      timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutIdsRef.current = [];
    }
    setAnnouncements((prev) => (prev.length > 0 ? [] : prev));
    setPausedAnnouncements((prev) => (prev.length > 0 ? [] : prev));
  }, []);

  React.useEffect(() => {
    if (!showLiveRegions) {
      if (liveRegionObserverRef.current) {
        liveRegionObserverRef.current.disconnect();
      }
      return;
    }
    const observer = new MutationObserver((records) => {
      const updates: { content: string; level: LiveLevel }[] = records
        .map((r) => {
          const targetNode = r.target;
          const targetElement = getClosestElement(targetNode);

          if (
            !targetElement ||
            isHidden(targetElement) || isInAriaHidden(targetElement)) {
            return null;
          }

          // モーダルが表示されている場合、モーダル外の要素は通知しない
          if (parentRef.current) {
            const modals = detectModals(parentRef.current);
            if (modals.length > 0) {
              const isInsideModal = modals.some(
                (modal) => modal.contains(targetElement) || modal === targetElement,
              );
              if (!isInsideModal) {
                return null;
              }
            }
          }

          const liveRegionNode =
            closestNodeOfSelector(r.target, LIVEREGION_SELECTOR);
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
          const isAtomic =
            atomicNode?.getAttribute?.("aria-atomic") === "true";
          const relevant = (
            liveRegionNode?.getAttribute?.("aria-relevant") ||
            "additions text"
          ).split(/\s/);
          const removals =
            relevant.includes("removals") || relevant.includes("all");
          const additions =
            relevant.includes("additions") || relevant.includes("all");
          if (isAtomic) {
            const name = liveRegionNode && computeAccessibleName(liveRegionNode);
            return { content: [ name, atomicNode.textContent ].filter(Boolean) .join(" ") , level };
          }

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
