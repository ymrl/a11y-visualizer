import React from "react";
import { collectMeta } from "./dom";
import { Settings, Message } from "../types";
import { Category, ElementMeta } from "./types";
import { MetaList } from "./components/MetaList";

export const App = () => {
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

  const updateInfo = React.useCallback(() => {
    if (settings.accessibilityInfo) {
      setMetaList(
        collectMeta(
          document.body,
          settings,
          containerRef.current ? [containerRef.current] : [],
        ),
      );
    } else {
      setMetaList(new Map());
    }
  }, [settings]);

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
