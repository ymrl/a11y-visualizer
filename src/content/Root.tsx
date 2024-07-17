import React from "react";
import { collectElements } from "./dom";
import { ElementMeta } from "./types";
import { ElementList } from "./components/ElementList";
import { injectRoot } from "./injectRoot";
import { Announcements } from "./components/Announcements";
import { SettingsContext } from "./components/SettingsProvider";
import { useLiveRegion } from "./hooks/useLiveRegion";
import { useDebouncedCallback } from "./hooks/useDebouncedCallback";

export type RootOptions = {
  srcdoc?: boolean;
};

export const Root = ({
  parentRef,
  options = {},
}: {
  parentRef: React.RefObject<Element>;
  options?: RootOptions;
}) => {
  const [metaList, setMetaList] = React.useState<ElementMeta[]>([]);
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);
  const settings = React.useContext(SettingsContext);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const announcementsRef = React.useRef<HTMLDivElement>(null);
  const framesRef = React.useRef<Element[]>([]);
  const excludedRef = React.useRef<Element[]>([]);
  const { announcements, observeLiveRegion } = useLiveRegion();

  const [outdated, setOutDated] = React.useState(false);

  const injectToFrames = React.useCallback((el: Element) => {
    const frames = [...el.querySelectorAll("iframe, frame")];
    const prevFrames = framesRef.current;
    frames.forEach((frameEl) => {
      const frameWindow = (frameEl as HTMLFrameElement | HTMLIFrameElement)
        .contentWindow;
      if (!frameWindow || prevFrames.includes(frameEl)) return;
      try {
        const d = frameWindow.document;
        const { readyState } = d;
        if (readyState === "complete") {
          injectRoot(frameWindow, d.body, {
            mountOnce: false,
            srcdoc: frameEl.hasAttribute("srcdoc"),
          });
        } else {
          frameWindow.addEventListener("load", () => {
            injectRoot(frameWindow, d.body, {
              srcdoc: frameEl.hasAttribute("srcdoc"),
              mountOnce: false,
            });
          });
        }
        frameWindow.addEventListener("unload", () => {
          setOutDated(true);
          framesRef.current = framesRef.current.filter((f) => f !== frameEl);
        });
      } catch {
        /* noop */
      }
    });
    framesRef.current = frames;
  }, []);

  const injectToDialogs = React.useCallback((el: Element) => {
    const elements = [...el.querySelectorAll("dialog, [popover]")];
    elements.forEach((el: Element) => {
      if (!excludedRef.current.includes(el)) {
        injectRoot(window, el, { mountOnce: true });
      }
    });
    excludedRef.current = elements;
  }, []);

  const updateInfo = useDebouncedCallback(
    () => {
      setOutDated(false);
      if (!containerRef.current) return;
      if (!parentRef.current) return;
      containerRef.current.style.display = "none";
      injectToFrames(parentRef.current);
      observeLiveRegion(parentRef.current);
      if (settings.accessibilityInfo) {
        injectToDialogs(parentRef.current);
        const { elements, rootHeight, rootWidth } = collectElements(
          parentRef.current,
          [
            containerRef.current,
            announcementsRef.current,
            ...excludedRef.current,
          ].filter((el): el is Element => !!el),
          settings,
          { srcdoc: options.srcdoc },
        );

        setMetaList(elements);
        setWidth(rootWidth);
        setHeight(rootHeight);
        containerRef.current.style.display = "block";
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
    if (outdated) updateInfo();
  }, [updateInfo, outdated]);

  React.useEffect(() => {
    updateInfo();
    const observer = new MutationObserver(() => {
      updateInfo();
    });
    const w = parentRef.current?.ownerDocument?.defaultView;
    if (w) {
      w.addEventListener("resize", updateInfo);
      w.addEventListener("scroll", updateInfo);
    }
    if (parentRef.current) {
      observer.observe(parentRef.current, {
        subtree: true,
        childList: true,
        attributes: true,
      });
    }
    return () => {
      observer.disconnect();
      if (w) {
        w.removeEventListener("resize", updateInfo);
        w.removeEventListener("scroll", updateInfo);
      }
    };
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
