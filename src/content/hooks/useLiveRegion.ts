import React from "react";
import { SettingsContext } from "../components/SettingsProvider";
import { isHidden, isInAriaHidden } from "../dom";

const LIVEREGION_SELECTOR =
  "output, [role='status'], [role='alert'], [role='log'], [aria-live]:not([aria-live='off'])";

const closestNodeOfSelector = (node: Node, selector: string): Node | null => {
  const parent = node.parentNode;
  if (!parent) {
    return null;
  }
  if (parent.nodeType === 1 && (parent as Element).matches(selector)) {
    return parent;
  }
  return closestNodeOfSelector(node.parentNode, selector);
};

export const useLiveRegion = () => {
  const {
    showLiveRegions,
    announcementMaxSeconds,
    announcementSecondsPerCharacter,
  } = React.useContext(SettingsContext);
  const liveRegionsRef = React.useRef<Element[]>([]);
  const liveRegionObserverRef = React.useRef<MutationObserver | null>(null);
  const [announcements, setAnnouncements] = React.useState<
    { content: string; until: number }[]
  >([]);
  const [stoppedAnnouncements, setStoppedAnnouncements] = React.useState<
    { content: string; rest: number }[]
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
      const liveRegions = el.querySelectorAll(LIVEREGION_SELECTOR);
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
    [connectLiveRegion],
  );

  const addAnnouncement = React.useCallback((content: string, msec: number) => {
    const until = new Date().getTime() + msec;
    const announcement = { content, until };
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
  }, []);

  React.useEffect(() => {
    if (!showLiveRegions) {
      if (liveRegionObserverRef.current) {
        liveRegionObserverRef.current.disconnect();
      }
      return;
    }
    const observer = new MutationObserver((records) => {
      const content: string[] = records
        .map((r) => {
          const node =
            closestNodeOfSelector(r.target, LIVEREGION_SELECTOR) || r.target;

          if (isHidden(node as Element) || isInAriaHidden(node as Element)) {
            return "";
          }
          const isAtomic =
            (node as Element).getAttribute?.("aria-atomic") === "true";
          const relevant = (
            (node as Element).getAttribute?.("aria-relevant") ||
            "additions text"
          ).split(/\s/);
          const removals =
            relevant.includes("removals") || relevant.includes("all");
          const additions =
            relevant.includes("additions") || relevant.includes("all");
          if (isAtomic) {
            return node.textContent || "";
          }
          const content = [
            (r.removedNodes.length === 0 &&
              r.addedNodes.length === 0 &&
              node.textContent) ||
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
          return content;
        })
        .filter(Boolean);
      if (content.length > 0 && stoppedAnnouncements.length > 0) {
        setStoppedAnnouncements([]);
      }
      content.forEach((c) => {
        const msec = Math.min(
          c.length * announcementSecondsPerCharacter * 1000,
          announcementMaxSeconds * 1000,
        );
        addAnnouncement(c, msec);
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
    stoppedAnnouncements,
  ]);

  React.useEffect(() => {
    if (announcements.length === 0 && stoppedAnnouncements.length === 0) {
      return;
    }
    const eventType = "keydown";
    const listener = (e: KeyboardEvent) => {
      if (e.key !== "Control") {
        return;
      }
      if (announcements.length > 0) {
        const stoppedAt = new Date().getTime();
        timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
        timeoutIdsRef.current = [];
        setStoppedAnnouncements(
          announcements
            .map((a) => ({
              content: a.content,
              rest: a.until - stoppedAt,
            }))
            .filter((a) => a.rest > 0),
        );
        setAnnouncements([]);
      } else if (stoppedAnnouncements.length > 0) {
        stoppedAnnouncements.forEach((a) => addAnnouncement(a.content, a.rest));
        setStoppedAnnouncements([]);
      }
    };
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [addAnnouncement, announcements, stoppedAnnouncements]);

  return {
    observeLiveRegion,
    announcements,
  };
};
