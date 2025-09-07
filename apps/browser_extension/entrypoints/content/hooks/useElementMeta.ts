import React from "react";
import {
  type CategorySettings,
  defaultCustomCategorySettings,
  getCategorySettingsFromMode,
} from "../../../src/settings";
import { SettingsContext } from "../contexts/SettingsContext";
import { collectElements } from "../dom";
import type { ElementMeta } from "../types";

type Layer = {
  element: Element;
  metaList: ElementMeta[];
  width: number;
  height: number;
};

const collectTopLayers = (
  el: Element,
  container: Element | null,
  categorySettings: CategorySettings,
  srcdoc: boolean | undefined,
  hideOutOfSightElementTips: boolean | undefined,
) => {
  const elements = [...el.querySelectorAll("dialog, [popover]")];
  const layers: Layer[] = elements
    .map((element: Element): Layer | null => {
      if (container?.contains(element)) return null;
      const { elements, rootHeight, rootWidth } = collectElements(
        element,
        [],
        categorySettings,
        { srcdoc, hideOutOfSightElementTips },
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
  categorySettings: CategorySettings,
  hideOutOfSightElementTips: boolean | undefined,
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
            categorySettings,
            {
              srcdoc: iframe.hasAttribute("srcdoc"),
              hideOutOfSightElementTips,
            },
          );
          return {
            element: d.body,
            metaList: elements,
            width: rootWidth,
            height: rootHeight,
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

      const categorySettings = getCategorySettingsFromMode(
        settings.elementTypeMode,
        defaultCustomCategorySettings,
      );

      const display = containerRef.current.style.display;
      containerRef.current.style.display = "none";

      const topLayers = collectTopLayers(
        parentRef.current,
        containerRef.current,
        categorySettings,
        srcdoc,
        settings.hideOutOfSightElementTips,
      );
      setTopLayers(topLayers);
      setIframeLayers(
        collectIFrames(
          iframeElements,
          categorySettings,
          settings.hideOutOfSightElementTips,
        ),
      );

      const { elements, rootHeight, rootWidth } = collectElements(
        parentRef.current,
        [containerRef.current, ...topLayers.map((e) => e.element)].filter(
          (el): el is Element => !!el,
        ),
        categorySettings,
        {
          srcdoc,
          hideOutOfSightElementTips: settings.hideOutOfSightElementTips,
        },
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
