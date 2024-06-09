import React from "react";
import { collectElements } from "./dom";
import { ElementMeta } from "./types";
import { ElementList } from "./components/ElementList";
import { injectRoot } from "./injectRoot";
import { Announcements } from "./components/Announcements";
import { SettingsContext } from "./components/SettingsProvider";
import { useLiveRegion } from "./hooks/useLiveRegion";
import { useDebouncedCallback } from "./hooks/useDebouncedCallback";

export const Root = ({
  parentRef,
}: {
  parentRef: React.RefObject<Element>;
}) => {
  const [metaList, setMetaList] = React.useState<ElementMeta[]>([]);
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);
  const settings = React.useContext(SettingsContext);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const announcementsRef = React.useRef<HTMLDivElement>(null);
  const framesRef = React.useRef<Window[]>([]);
  const dialogsRef = React.useRef<Element[]>([]);
  const popoversRef = React.useRef<Element[]>([]);
  const { announcements, observeLiveRegion } = useLiveRegion();

  const injectToFrames = React.useCallback((el: Element) => {
    const frames = [...el.querySelectorAll("iframe, frame")]
      .map((f) => (f as HTMLFrameElement | HTMLIFrameElement).contentWindow)
      .filter((f: Window | null): f is Window => f !== null);
    const prevFrames = framesRef.current;
    frames.forEach((frame) => {
      if (!prevFrames.includes(frame)) {
        try {
          const d = frame.document;
          const { readyState } = d;
          if (readyState === "complete") {
            injectRoot(frame, d.body);
          } else {
            frame.addEventListener("load", () => {
              injectRoot(frame, d.body);
            });
          }
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

  const updateInfo = useDebouncedCallback(
    () => {
      if (!parentRef.current) return;
      injectToFrames(parentRef.current);
      observeLiveRegion(parentRef.current);
      if (settings.accessibilityInfo) {
        injectToDialogs(parentRef.current);
        const { elements, rootHeight, rootWidth } = collectElements(
          parentRef.current,
          [
            containerRef.current,
            announcementsRef.current,
            ...popoversRef.current,
            ...dialogsRef.current,
          ].filter((el): el is Element => !!el),
          settings,
        );

        setMetaList(elements);
        setWidth(rootWidth);
        setHeight(rootHeight);
      } else {
        setWidth(0);
        setHeight(0);
        setMetaList([]);
      }
    },
    200,
    [injectToFrames, settings, observeLiveRegion, injectToDialogs],
  );

  React.useEffect(() => {
    updateInfo();
    const observer = new MutationObserver(() => {
      updateInfo();
    });
    if (parentRef.current) {
      observer.observe(parentRef.current, {
        subtree: true,
        childList: true,
        attributes: true,
      });
    }
    return () => observer.disconnect();
  }, [parentRef, updateInfo]);
  return (
    <section
      aria-label={`Accessibility Visualizer <${parentRef.current?.tagName?.toLowerCase()}>`}
      aria-hidden="true"
      ref={containerRef}
    >
      <ElementList list={metaList} width={width} height={height} />
      <Announcements
        contents={announcements.map((a) => a.content)}
        ref={announcementsRef}
      />
    </section>
  );
};
