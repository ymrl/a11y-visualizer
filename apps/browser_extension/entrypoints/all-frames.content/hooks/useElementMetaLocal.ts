import React from "react";
import {
  type CategorySettings,
  defaultCustomCategorySettings,
  getCategorySettingsFromMode,
} from "../../../src/settings";
import { SettingsContext } from "../../content/contexts/SettingsContext";
import { collectElements } from "../../content/dom";
import { getRootSize } from "../../content/dom/getRootSize";
import type { ElementMeta } from "../../content/types";

type Layer = {
  element: Element;
  metaList: ElementMeta[];
  width: number;
  height: number;
};

type ViewportOptions = {
  viewportScrollX?: number;
  viewportScrollY?: number;
  viewportWidth?: number;
  viewportHeight?: number;
};

const collectTopLayers = (
  el: Element,
  container: Element | null,
  categorySettings: CategorySettings,
  srcdoc: boolean | undefined,
  hideOutOfSightElementTips: boolean | undefined,
  viewportOptions?: ViewportOptions,
) => {
  const elements = [...el.querySelectorAll("dialog, [popover]")];
  const layers: Layer[] = elements
    .map((element: Element): Layer | null => {
      if (container?.contains(element)) return null;
      const metaList = collectElements(element, [], categorySettings, {
        srcdoc,
        hideOutOfSightElementTips,
        ...viewportOptions,
      });
      const { width, height } = getRootSize(element);
      return {
        element,
        metaList,
        width,
        height,
      };
    })
    .filter((el): el is Layer => !!el);
  return layers;
};

export const useElementMetaLocal = ({
  parentRef,
  containerRef,
  srcdoc,
  viewportScrollXRef,
  viewportScrollYRef,
  viewportWidthRef,
  viewportHeightRef,
}: {
  parentRef: React.RefObject<Element>;
  containerRef: React.RefObject<HTMLElement>;
  srcdoc?: boolean;
  viewportScrollXRef: React.RefObject<number>;
  viewportScrollYRef: React.RefObject<number>;
  viewportWidthRef: React.RefObject<number>;
  viewportHeightRef: React.RefObject<number>;
}) => {
  const [metaList, setMetaList] = React.useState<ElementMeta[]>([]);
  const [topLayers, setTopLayers] = React.useState<Layer[]>([]);
  const settings = React.useContext(SettingsContext);

  const updateMetaList = React.useCallback(() => {
    if (!containerRef.current) return;
    if (!parentRef.current) return;
    if (!settings.accessibilityInfo) {
      setMetaList([]);
      setTopLayers([]);
      return;
    }

    const categorySettings = getCategorySettingsFromMode(
      settings.elementTypeMode,
      defaultCustomCategorySettings,
    );

    const viewportOptions: ViewportOptions = {
      viewportScrollX: viewportScrollXRef?.current ?? undefined,
      viewportScrollY: viewportScrollYRef?.current ?? undefined,
      viewportWidth: viewportWidthRef?.current ?? undefined,
      viewportHeight: viewportHeightRef?.current ?? undefined,
    };

    const display = containerRef.current.style.display;
    containerRef.current.style.display = "none";

    const topLayers = collectTopLayers(
      parentRef.current,
      containerRef.current,
      categorySettings,
      srcdoc,
      settings.hideOutOfSightElementTips,
      viewportOptions,
    );
    setTopLayers(topLayers);

    const elements = collectElements(
      parentRef.current,
      [containerRef.current, ...topLayers.map((e) => e.element)].filter(
        (el): el is Element => !!el,
      ),
      categorySettings,
      {
        srcdoc,
        hideOutOfSightElementTips: settings.hideOutOfSightElementTips,
        ...viewportOptions,
      },
    );
    setMetaList(elements);

    containerRef.current.style.display = display;
  }, [
    containerRef,
    parentRef,
    settings,
    srcdoc,
    viewportScrollXRef,
    viewportScrollYRef,
    viewportWidthRef,
    viewportHeightRef,
  ]);

  return {
    metaList,
    topLayers,
    updateMetaList,
  };
};
