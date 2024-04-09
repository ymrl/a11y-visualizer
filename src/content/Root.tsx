import React from "react";
import { collectMeta } from "./dom";
import { Settings, Message } from "../types";
import { Category, ElementMeta } from "./types";
import { MetaList } from "./components/MetaList";
import { injectRoot } from "./injectRoot";

const getBody = (el: HTMLElement): HTMLElement | null => {
  const d = el.ownerDocument;
  const root = d.getRootNode();
  if (!root) return null;
  return (root as Document).body;
};
export const Root = () => {
  const [metaList, setMetaList] = React.useState<
    Map<Category, (ElementMeta | null)[]>
  >(new Map());

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

  const injectToFrames = React.useCallback((el: HTMLElement) => {
    const w = el.ownerDocument.defaultView;
    if (w) {
      const frames = Array.from(w.frames);
      const prevFrames = framesRef.current;
      frames.forEach((frame) => {
        prevFrames.includes(frame) || injectRoot(frame);
      });
      framesRef.current = frames;
    }
  }, []);

  const updateInfo = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    injectToFrames(el);
    const body = getBody(el);
    if (body && settings.accessibilityInfo) {
      setMetaList(
        collectMeta(
          body,
          settings,
          containerRef.current ? [containerRef.current] : [],
        ),
      );
    } else {
      setMetaList(new Map());
    }
  }, [settings, injectToFrames]);

  React.useEffect(() => {
    chrome.storage.local.get("settings", (data) => {
      setSettings((prev) => ({
        ...prev,
        ...data.settings,
      }));
    });
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const body = getBody(el);
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
    updateInfo();
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
      image={metaList.get("image") || []}
      formControl={metaList.get("formControl") || []}
      link={metaList.get("link") || []}
      heading={metaList.get("heading") || []}
      ariaHidden={metaList.get("ariaHidden") || []}
      ref={containerRef}
    />
  );
};
