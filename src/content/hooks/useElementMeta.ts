import React from "react";
import { collectElements } from "../dom";
import { ElementMeta } from "../types";
import { SettingsContext } from "../components/SettingsProvider";
import { Settings } from "../../settings";

type Layer = {
  element: Element;
  metaList: ElementMeta[];
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
        metaList: elements,
        width: rootWidth,
        height: rootHeight,
      };
    })
    .filter((el): el is Layer => !!el);
  return layers;
};

const collectIFrames = (
  iframeElements: HTMLIFrameElement[],
  settings: Settings,
): Layer[] =>
  iframeElements
    .map((iframe): Layer | null => {
      const iframeWindow = iframe.contentWindow;
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
          return {
            element: d.body,
            metaList: elements,
            width: rootHeight,
            height: rootWidth,
          };
        }
      } catch {
        /* noop */
      }
      return null;
    })
    .filter((el): el is Layer => !!el);

export const useElementMeta = ({
  parentRef,
  containerRef,
  srcdoc,
}: {
  parentRef: React.RefObject<Element>;
  containerRef: React.RefObject<HTMLElement>;
  srcdoc?: boolean;
}) => {
  const [metaList, setMetaList] = React.useState<ElementMeta[]>([]);
  const [topLayers, setTopLayers] = React.useState<Layer[]>([]);
  const [iframeLayers, setIframeLayers] = React.useState<Layer[]>([]);
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);
  const settings = React.useContext(SettingsContext);

  const updateMetaList = React.useCallback(
    (iframeElements: HTMLIFrameElement[]) => {
      if (!containerRef.current) return;
      if (!parentRef.current) return;
      if (!settings.accessibilityInfo) {
        setWidth(0);
        setHeight(0);
        setMetaList([]);
        setIframeLayers([]);
        setTopLayers([]);
        return;
      }
      const display = containerRef.current.style.display;
      containerRef.current.style.display = "none";

      const topLayers = collectTopLayers(
        parentRef.current,
        containerRef.current,
        settings,
        srcdoc,
      );
      setTopLayers(topLayers);
      setIframeLayers(collectIFrames(iframeElements, settings));

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

      containerRef.current.style.display = display;
    },
    [containerRef, parentRef, settings, srcdoc],
  );

  return {
    metaList,
    width,
    height,
    topLayers,
    iframeLayers,
    updateMetaList,
  };
};
