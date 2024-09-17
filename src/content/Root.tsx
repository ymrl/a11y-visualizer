import React from "react";
import { createPortal } from "react-dom";
import { ElementList } from "./components/ElementList";
import { injectRoot } from "./injectRoot";
import { Announcements } from "./components/Announcements";
import { SettingsContext } from "./components/SettingsProvider";
import { useLiveRegion } from "./hooks/useLiveRegion";
import { useDebouncedCallback } from "./hooks/useDebouncedCallback";
import { useElementMeta } from "./hooks/useElementMeta";

export type RootOptions = {
  srcdoc?: boolean;
  announceMode?: "self" | "parent";
};

const getIframeElements = (el: Element): HTMLIFrameElement[] =>
  [...el.querySelectorAll<HTMLIFrameElement>("iframe")]
    .map((iframe) => {
      const iframeWindow = iframe.contentWindow;
      if (!iframeWindow) return iframe;
      try {
        const d = iframeWindow.document;
        const { readyState } = d;
        if (readyState === "complete") {
          return [iframe, ...getIframeElements(d.body)];
        }
      } catch {
        /* noop */
      }
      return iframe;
    })
    .flat();

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
  const settings = React.useContext(SettingsContext);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const framesRef = React.useRef<Element[]>([]);
  const [iframeElements, setIframeElements] = React.useState<
    HTMLIFrameElement[]
  >([]);
  const { announcements, observeLiveRegion } = useLiveRegion({
    parentRef,
    iframeElements,
  });
  const { metaList, width, height, topLayers, iframeLayers, updateMetaList } =
    useElementMeta({
      parentRef,
      containerRef,
      srcdoc,
    });

  const [outdated, setOutDated] = React.useState(false);

  const updateInfo = useDebouncedCallback(
    () => {
      setOutDated(false);
      if (!containerRef.current) return;
      if (!parentRef.current) return;
      const iframeElements = getIframeElements(parentRef.current);
      setIframeElements(iframeElements);

      framesRef.current = injectToFrames(
        parentRef.current,
        framesRef.current,
        (el) => {
          framesRef.current = framesRef.current.filter((e) => e !== el);
          setOutDated(true);
        },
      );
      observeLiveRegion(parentRef.current);
      updateMetaList(iframeElements);
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
    return () => {
      childrenObserver.disconnect();
      observer.disconnect();
    };
  }, [parentRef, updateInfo]);

  React.useEffect(() => {
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
    const windows = [
      w,
      ...iframeElements.map((iframe) => iframe.ownerDocument?.defaultView),
    ];
    windows.forEach((w) => {
      if (!w) return;
      events.forEach((event) => {
        try {
          w.addEventListener(event, updateInfo);
        } catch {
          /* noop */
        }
      });
    });
    return () => {
      windows.forEach((w) => {
        if (!w) return;
        events.forEach((event) => {
          try {
            w.removeEventListener(event, updateInfo);
          } catch {
            /* noop */
          }
        });
      });
    };
  }, [iframeElements, parentRef, updateInfo]);

  return (
    <section
      aria-label={`Accessibility Visualizer <${parentRef.current?.tagName?.toLowerCase()}>`}
      aria-hidden="true"
      style={{
        position: "static",
        margin: 0,
        padding: 0,
      }}
      ref={containerRef}
    >
      <ElementList list={metaList} width={width} height={height} />
      {topLayers.map(({ element, metaList, width, height }, i) =>
        createPortal(
          <ElementList list={metaList} width={width} height={height} />,
          element,
          `layer-${i}-${element.tagName.toLowerCase()}`,
        ),
      )}
      {iframeLayers.map(({ element, metaList, width, height }, i) =>
        createPortal(
          <ElementList list={metaList} width={width} height={height} />,
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
