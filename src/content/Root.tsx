import React from "react";
import { createPortal } from "react-dom";
import { collectElements } from "./dom";
import { ElementMeta } from "./types";
import { ElementList } from "./components/ElementList";
import { injectRoot } from "./injectRoot";
import { Announcements } from "./components/Announcements";
import { SettingsContext } from "./components/SettingsProvider";
import { useLiveRegion } from "./hooks/useLiveRegion";
import { useDebouncedCallback } from "./hooks/useDebouncedCallback";
import { Settings } from "../settings";

export type RootOptions = {
  srcdoc?: boolean;
  announceMode?: "self" | "parent";
};

type Layer = {
  element: Element;
  meta: ElementMeta[];
  width: number;
  height: number;
};

const collectTopLayers = (
  el: Element,
  container: Element | null,
  settings: Settings,
  srcdoc: boolean | undefined,
) => {
  const elements = [...el.querySelectorAll("dialog, [popover]")];
  const layers: Layer[] = elements
    .map((element: Element): Layer | null => {
      if (container?.contains(element)) return null;
      const { elements, rootHeight, rootWidth } = collectElements(
        element,
        [],
        settings,
        { srcdoc },
      );
      return {
        element,
        meta: elements,
        width: rootWidth,
        height: rootHeight,
      };
    })
    .filter((el): el is Layer => !!el);
  return layers;
};

const collectIFrames = (root: Element, settings: Settings): Layer[] => {
  const iframes = [...root.querySelectorAll("iframe")];
  return iframes
    .map((iframe): Layer[] | null => {
      const iframeWindow = (iframe as HTMLIFrameElement).contentWindow;
      if (!iframeWindow) return null;
      try {
        const d = iframeWindow.document;
        const { readyState } = d;
        if (readyState === "complete") {
          const { elements, rootHeight, rootWidth } = collectElements(
            d.body,
            [],
            settings,
            { srcdoc: iframe.hasAttribute("srcdoc") },
          );
          return [
            {
              element: d.body,
              meta: elements,
              width: rootHeight,
              height: rootWidth,
            },
            ...[...d.body.querySelectorAll("iframe")]
              .map((el) => collectIFrames(el, settings))
              .flat(),
          ];
        }
      } catch {
        /* noop */
      }
      return null;
    })
    .filter((el): el is Layer[] => !!el)
    .flat();
};

const injectToFrames = (
  el: Element,
  prevFrames: Element[],
  onUnload: (element: Element, ev: Event) => void,
): Element[] => {
  const frames = [...el.querySelectorAll<Element>("frame")];
  frames.forEach((frameEl) => {
    const frameWindow = (frameEl as HTMLFrameElement).contentWindow;
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
      frameWindow.addEventListener("unload", (ev) => {
        onUnload(frameEl, ev);
      });
    } catch {
      /* noop */
    }
  });
  return frames;
};

export const Root = ({
  parentRef,
  options,
}: {
  parentRef: React.RefObject<Element>;
  options?: RootOptions;
}) => {
  const { srcdoc, announceMode = "self" } = options || {};
  const [metaList, setMetaList] = React.useState<ElementMeta[]>([]);
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);
  const settings = React.useContext(SettingsContext);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const framesRef = React.useRef<Element[]>([]);
  const { announcements, observeLiveRegion } = useLiveRegion({
    parentRef,
    announceMode,
  });
  const [topLayers, setTopLayers] = React.useState<Layer[]>([]);
  const [iframes, setIframes] = React.useState<Layer[]>([]);
  const [outdated, setOutDated] = React.useState(false);

  const updateInfo = useDebouncedCallback(
    () => {
      setOutDated(false);
      if (!containerRef.current) return;
      if (!parentRef.current) return;
      containerRef.current.style.display = "none";
      framesRef.current = injectToFrames(
        parentRef.current,
        framesRef.current,
        (el) => {
          framesRef.current = framesRef.current.filter((e) => e !== el);
          setOutDated(true);
        },
      );
      observeLiveRegion(parentRef.current);

      if (settings.accessibilityInfo) {
        const topLayers = collectTopLayers(
          parentRef.current,
          containerRef.current,
          settings,
          srcdoc,
        );
        setTopLayers(topLayers);
        const iframes = collectIFrames(parentRef.current, settings);
        setIframes(iframes);

        const { elements, rootHeight, rootWidth } = collectElements(
          parentRef.current,
          [containerRef.current, ...topLayers.map((e) => e.element)].filter(
            (el): el is Element => !!el,
          ),
          settings,
          { srcdoc },
        );

        setMetaList(elements);
        setWidth(rootWidth);
        setHeight(rootHeight);
      } else {
        setWidth(0);
        setHeight(0);
        setMetaList([]);
      }
      containerRef.current.style.display = "block";
    },
    200,
    [injectToFrames, settings, observeLiveRegion],
  );
  React.useEffect(() => {
    if (outdated) updateInfo();
  }, [updateInfo, outdated]);

  React.useEffect(() => {
    updateInfo();
    const observer = new MutationObserver(updateInfo);
    const childrenObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          observer.observe(node, {
            childList: true,
            subtree: true,
            attributes: true,
          });
        });
      });
    });

    if (parentRef.current) {
      childrenObserver.observe(parentRef.current, {
        childList: true,
        subtree: false,
        attributes: false,
        characterData: false,
      });
      [...parentRef.current.children].forEach((el) => {
        if (el.contains(containerRef.current)) return;
        observer.observe(el, {
          childList: true,
          subtree: true,
          attributes: true,
        });
      });
    }

    const events = [
      "resize",
      "scroll",
      "keydown",
      "mousedown",
      "mousemove",
      "mousewheel",
      "change",
    ];

    const w = parentRef.current?.ownerDocument?.defaultView;
    const iframes = parentRef.current?.querySelectorAll("iframe");
    const windows = [
      w,
      ...(iframes ? [...iframes] : []).map(
        (iframe) => (iframe as HTMLIFrameElement).contentWindow,
      ),
    ];
    windows.forEach((w) => {
      if (!w) return;
      events.forEach((event) => {
        w.addEventListener(event, updateInfo);
      });
    });
    return () => {
      childrenObserver.disconnect();
      observer.disconnect();
      windows.forEach((w) => {
        if (!w) return;
        events.forEach((event) => {
          w.removeEventListener(event, updateInfo);
        });
      });
    };
  }, [parentRef, updateInfo]);
  return (
    <section
      aria-label={`Accessibility Visualizer <${parentRef.current?.tagName?.toLowerCase()}>`}
      aria-hidden="true"
      ref={containerRef}
    >
      <ElementList list={metaList} width={width} height={height} />
      {topLayers.map(({ element, meta, width, height }, i) =>
        createPortal(
          <ElementList list={meta} width={width} height={height} />,
          element,
          `layer-${i}-${element.tagName.toLowerCase()}`,
        ),
      )}
      {iframes.map(({ element, meta, width, height }, i) =>
        createPortal(
          <ElementList list={meta} width={width} height={height} />,
          element,
          `iframe-${i}`,
        ),
      )}
      {settings.showLiveRegions && announceMode === "self" && (
        <Announcements contents={announcements.map((a) => a.content)} />
      )}
    </section>
  );
};
