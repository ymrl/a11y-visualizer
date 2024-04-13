import React from "react";
import { collectElements } from "./dom";
import { Settings, Message } from "../types";
import { ElementMeta } from "./types";
import { MetaList } from "./components/MetaList";
import { injectRoot } from "./injectRoot";
import { Announcements } from "./components/Announcements";

export const Root = ({ parent }: { parent: Element }) => {
  const [metaList, setMetaList] = React.useState<ElementMeta[]>([]);
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);
  const [settings, setSettings] = React.useState<Settings>({
    accessibilityInfo: false,
    image: true,
    formControl: true,
    link: true,
    heading: true,
    ariaHidden: true,
  });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const announcementsRef = React.useRef<HTMLDivElement>(null);
  const framesRef = React.useRef<Window[]>([]);
  const dialogsRef = React.useRef<Element[]>([]);
  const popoversRef = React.useRef<Element[]>([]);

  const injectToFrames = React.useCallback((el: Element) => {
    const frames = [...el.querySelectorAll("iframe, frame")]
      .map((f) => (f as HTMLFrameElement | HTMLIFrameElement).contentWindow)
      .filter((f: Window | null): f is Window => f !== null);
    const prevFrames = framesRef.current;
    frames.forEach((frame) => {
      if (!prevFrames.includes(frame)) {
        try {
          const d = frame.document;
          injectRoot(frame, d.body);
        } catch {
          /* noop */
        }
      }
    });
    framesRef.current = frames;
  }, []);

  const injectToDialogs = React.useCallback((el: Element) => {
    const dialogs = el.querySelectorAll("dialog");
    const popovers = el.querySelectorAll("[popover]");
    [...dialogs, ...popovers].forEach((el: Element) => {
      if (
        !dialogsRef.current.includes(el) &&
        !popoversRef.current.includes(el)
      ) {
        injectRoot(window, el);
      }
    });
    dialogsRef.current = Array.from(dialogs);
    popoversRef.current = Array.from(popovers);
  }, []);

  const liveRegionsRef = React.useRef<Element[]>([]);
  const liveRegionObserverRef = React.useRef<MutationObserver | null>(null);
  const [announcements, setAnnouncements] = React.useState<string[]>([]);

  React.useEffect(() => {
    const observer = new MutationObserver((records) => {
      const content = records
        .map((r) => (r.target.textContent || "").trim())
        .filter(Boolean);
      setAnnouncements((prev) => [...prev, ...content]);
      content.forEach((c) => {
        setTimeout(
          () => {
            setAnnouncements((prev) => {
              const idx = prev.indexOf(c);
              return idx === -1
                ? prev
                : [...prev.slice(0, idx), ...prev.slice(idx + 1)];
            });
          },
          Math.min(c.length * 500, 30000),
        );
      });
    });
    liveRegionObserverRef.current = observer;
    return () => observer.disconnect();
  }, []);

  const observeLiveRegion = React.useCallback((el: Element) => {
    if (!liveRegionObserverRef.current) {
      return;
    }
    const liveRegions = el.querySelectorAll(
      "output, [role='status'], [role='alert'], [role='log'], [aria-live]:not([aria-live='off'])",
    );
    [...liveRegions].forEach((el) => {
      if (!liveRegionsRef.current.includes(el)) {
        liveRegionObserverRef.current?.observe(el, {
          subtree: true,
          childList: true,
          characterData: true,
        });
      }
    });
    liveRegionsRef.current = Array.from(liveRegions);
  }, []);

  const updateInfo = React.useCallback(() => {
    injectToFrames(parent);
    observeLiveRegion(parent);
    if (settings.accessibilityInfo) {
      injectToDialogs(parent);
      const { elements, rootHeight, rootWidth } = collectElements(
        parent,
        [
          containerRef.current,
          announcementsRef.current,
          ...popoversRef.current,
          ...dialogsRef.current,
        ].filter((el): el is Element => !!el),
      );

      setMetaList(elements);
      setWidth(rootWidth);
      setHeight(rootHeight);
    } else {
      setWidth(0);
      setHeight(0);
      setMetaList([]);
    }
  }, [injectToFrames, parent, settings, observeLiveRegion, injectToDialogs]);

  React.useEffect(() => {
    chrome.storage.local.get("settings", (data) => {
      setSettings((prev) => ({
        ...prev,
        ...data.settings,
      }));
    });
  }, []);

  React.useEffect(() => {
    updateInfo();
    const observer = new MutationObserver(() => {
      updateInfo();
    });
    observer.observe(parent, {
      subtree: true,
      childList: true,
      attributes: true,
    });
    return () => observer.disconnect();
  }, [updateInfo, parent]);

  React.useEffect(() => {
    const listener = (message: Message) => {
      if (message.type === "updateAccessibilityInfo") {
        setSettings({
          ...settings,
          ...message.settings,
        });
        updateInfo();
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [settings, updateInfo]);

  return (
    <>
      <MetaList
        list={metaList}
        settings={settings}
        ref={containerRef}
        width={width}
        height={height}
      />
      <Announcements contents={announcements} ref={announcementsRef} />
    </>
  );
};
