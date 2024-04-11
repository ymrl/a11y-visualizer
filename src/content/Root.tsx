import React from "react";
import { collectElements } from "./dom";
import { Settings, Message } from "../types";
import { ElementMeta } from "./types";
import { MetaList } from "./components/MetaList";
import { injectRoot } from "./injectRoot";

export const Root = () => {
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
  const framesRef = React.useRef<Window[]>([]);
  const dialogsRef = React.useRef<Element[]>([]);
  const popoversRef = React.useRef<Element[]>([]);

  const injectToFrames = React.useCallback((el: HTMLElement) => {
    const w = el.ownerDocument.defaultView;
    if (w) {
      const frames = Array.from(w.frames);
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
    }
  }, []);
  const injectToDialogs = React.useCallback((body: HTMLElement) => {
    const dialogs = body.querySelectorAll("dialog");
    const popovers = body.querySelectorAll("[popover]");
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

  const updateInfo = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    injectToFrames(el);

    const body = el.parentElement?.parentElement;
    if (body && settings.accessibilityInfo) {
      injectToDialogs(body);
      const { elements, rootHeight, rootWidth } = collectElements(
        body,
        containerRef.current
          ? [
              containerRef.current,
              ...popoversRef.current,
              ...dialogsRef.current,
            ]
          : [],
      );

      setMetaList(elements);
      setWidth(rootWidth);
      setHeight(rootHeight);
    } else {
      setWidth(0);
      setHeight(0);
      setMetaList([]);
    }
  }, [settings, injectToFrames, injectToDialogs]);

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
    const el = containerRef.current;
    if (!el) return;
    const body = el.parentElement?.parentElement;
    if (!body) return;
    const observer = new MutationObserver(() => {
      updateInfo();
    });
    observer.observe(body, {
      subtree: true,
      childList: true,
      attributes: true,
    });
    return () => observer.disconnect();
  }, [updateInfo]);

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
    <MetaList
      list={metaList}
      settings={settings}
      ref={containerRef}
      width={width}
      height={height}
    />
  );
};
