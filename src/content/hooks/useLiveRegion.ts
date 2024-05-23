import React from "react";
import { SettingsContext } from "../components/SettingsProvider";
import { isHidden, isInAriaHidden } from "../dom";

const LIVEREGION_SELECTOR =
  "output, [role='status'], [role='alert'], [role='log'], [aria-live]:not([aria-live='off'])";

type LiveLevel = "polite" | "assertive";

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
    { content: string; level: LiveLevel; until: number }[]
  >([]);
  const [stoppedAnnouncements, setStoppedAnnouncements] = React.useState<
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

  const addAnnouncement = React.useCallback(
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
          const node =
            closestNodeOfSelector(r.target, LIVEREGION_SELECTOR) || r.target;

          if (isHidden(node as Element) || isInAriaHidden(node as Element)) {
            return null;
          }
          const isAssertive =
            (node as Element).getAttribute?.("aria-live") === "assertive" ||
            (node as Element).getAttribute?.("role") === "alert";
          const level = isAssertive ? "assertive" : "polite";
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
            return { content: node.textContent || "", level };
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
          return { content, level };
        })
        .filter((e): e is { content: string; level: LiveLevel } => e !== null);

      if (updates.length > 0 && stoppedAnnouncements.length > 0) {
        setStoppedAnnouncements([]);
      }
      if (updates.some((u) => u.level === "assertive")) {
        setAnnouncements([]);
      }
      updates.forEach((c) => {
        const msec = Math.min(
          c.content.length * announcementSecondsPerCharacter * 1000,
          announcementMaxSeconds * 1000,
        );
        addAnnouncement(c.content, c.level, msec);
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
      if (e.key === "Control") {
        setAnnouncements([]);
        setStoppedAnnouncements([]);
      }
      if (e.key === "Shift" && announcements.length > 0) {
        const stoppedAt = new Date().getTime();
        timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
        timeoutIdsRef.current = [];
        setStoppedAnnouncements(
          announcements
            .map((a) => ({
              content: a.content,
              level: a.level,
              rest: a.until - stoppedAt,
            }))
            .filter((a) => a.rest > 0),
        );
        setAnnouncements([]);
      } else if (stoppedAnnouncements.length > 0) {
        stoppedAnnouncements.forEach((a) =>
          addAnnouncement(a.content, a.level, a.rest),
        );
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
