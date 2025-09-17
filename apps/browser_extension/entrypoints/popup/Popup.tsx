import React from "react";
import { browser } from "#imports";
import "./index.css";
import { IoBackspaceOutline, IoReloadOutline } from "react-icons/io5";
import icon from "../../src/assets/icon.svg";
import iconDisabled from "../../src/assets/icon-disabled.svg";
import {
  sendMessageToActiveTab,
  sendMessageToActiveTabs,
} from "../../src/browser/tabs";
import { Checkbox } from "../../src/components/Checkbox";
import { SettingsEditor } from "../../src/components/SettingsEditor";
import { loadEnabled, saveEnabled } from "../../src/enabled";
import {
  initialSettings,
  loadUrlSettings,
  resetUrlSettings,
  type Settings,
  type SettingsMessage,
  saveUrlSettings,
} from "../../src/settings";
import { useLang } from "../../src/useLang";

const getUrl = async () => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0]?.url;
};

export const Popup = () => {
  const [settings, setSettings] = React.useState<Settings>(initialSettings);
  const [enabled, setEnabled] = React.useState<boolean>(false);
  const [url, setUrl] = React.useState<string | undefined>(undefined);
  const [host, setHost] = React.useState<string | undefined>(undefined);
  const [isFile, setIsFile] = React.useState<boolean>(false);
  const [hostSetting, setHostSetting] = React.useState<boolean>(false);
  const { t, lang } = useLang();

  const loadSettings = React.useCallback(async () => {
    const loadedEnabled = await loadEnabled();
    setEnabled(loadedEnabled);
    const url = await getUrl();
    setUrl(url);
    const [newSettings, found] = await loadUrlSettings(url);
    if (url) {
      const parsedURL = new URL(url);
      if (["http:", "https:"].includes(parsedURL.protocol) && parsedURL.host) {
        setHost(parsedURL.host);
      }
      if (parsedURL.protocol === "file:") {
        setIsFile(true);
      }
    }
    setHostSetting(found);
    setSettings(newSettings);
    return newSettings;
  }, []);

  React.useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    if (url) {
      setHostSetting(true);
      saveUrlSettings(url, newSettings);
      sendMessageToActiveTabs<SettingsMessage>({
        type: "updateUrlSettings",
        settings: newSettings,
        enabled: enabled,
        url: url,
      });
    }
  };

  return (
    <div
      className="w-full min-w-80 max-w-sm mx-auto font-sans text-zinc-800 bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 min-h-screen sm:min-h-0"
      lang={lang}
    >
      <div
        className="p-0 relative flex flex-row items-center justify-between gap-3
      bg-zinc-100 dark:bg-zinc-800"
      >
        <div className="flex flex-row gap-1 items-center justify-start">
          <img
            src={enabled ? icon : iconDisabled}
            alt={enabled ? t("popup.iconEyesOpen") : t("popup.iconEyesClosed")}
            className="size-8 sm:size-8 mt-1 mb-1 ml-1"
            width="24"
            height="24"
          />
          <h1 className="text-xs font-bold text-teal-800 dark:text-teal-200">
            {t("popup.title")}
          </h1>
          <button
            type="button"
            className="text-teal-700 bg-none shrink-0 p-3 -mt-2 -mb-2
                relative transition-colors cursor-pointer z-10
                before:content-[''] before:absolute before:inset-2 before:rounded-full
                before:transition-colors
                dark:text-teal-200
                hover:enabled:before:bg-zinc-200
                dark:hover:enabled:before:bg-teal-900
                disabled:text-zinc-400 disabled:cursor-not-allowed
                touch-manipulation"
            onClick={() => {
              sendMessageToActiveTab({
                type: "applySettings",
                settings: settings,
                enabled: enabled,
              });
            }}
            disabled={!enabled || !host}
            title={t("popup.rerun")}
          >
            <IoReloadOutline
              role="img"
              aria-label={t("popup.rerun")}
              className="size-4 relative z-20"
            />
          </button>
        </div>
        <div className="mr-2">
          <Checkbox
            onChange={async (e) => {
              setEnabled(e.target.checked);
              saveEnabled(e.target.checked);
              browser.runtime.sendMessage({
                type: "updateEnabled",
                enabled: e.target.checked,
              });
              sendMessageToActiveTabs<SettingsMessage>({
                type: "updateEnabled",
                enabled: e.target.checked,
              });
            }}
            checked={enabled}
          >
            <span
              className="text-xs font-bold text-teal-800
          dark:text-teal-200 shrink-0"
            >
              {t("popup.enabled")}
            </span>
            <span className="absolute inset-0" />
          </Checkbox>
        </div>
      </div>
      {(host || isFile) && (
        <div className="p-2 flex flex-col gap-0 items-stretch">
          <div className="flex flex-row gap-2 items-center mb-2 px-2 sm:px-2">
            <h2 className="text-sm font-bold text-teal-800 dark:text-teal-200 shrink">
              {host && t("popup.settingsForHost", { host })}
              {isFile && t("popup.settingsForFile")}
            </h2>
            <button
              type="button"
              className="text-teal-700 bg-none shrink-0 p-3 -mt-2 -mb-2
                  relative transition-colors cursor-pointer z-10
                  before:content-[''] before:absolute before:inset-2 before:rounded-full
                  before:transition-colors
                  dark:text-teal-200
                  hover:enabled:before:bg-zinc-200
                  dark:hover:enabled:before:bg-teal-900
                  disabled:text-zinc-400 disabled:cursor-not-allowed
                  touch-manipulation"
              onClick={async () => {
                await resetUrlSettings(url);
                const defaultSettings = await loadSettings();
                if (url) {
                  sendMessageToActiveTabs<SettingsMessage>({
                    type: "updateUrlSettings",
                    settings: defaultSettings,
                    enabled: enabled,
                    url: url,
                  });
                }
              }}
              disabled={!enabled || !hostSetting}
              title={t("popup.reset")}
            >
              <IoBackspaceOutline
                role="img"
                aria-label={t("popup.reset")}
                className="size-4 relative z-20"
              />
            </button>
          </div>
          <SettingsEditor
            settings={settings}
            onChange={updateSettings}
            disabled={!enabled}
            showDisplaySettingsCollapsed={true}
            url={url}
          />
          <p className="text-sm sm:text-xs text-zinc-500 dark:text-zinc-400 px-2 sm:px-2">
            {t("popup.hostDesc")}
            <button
              type="button"
              className="link text-teal-700 underline hover:enabled:text-teal-900 transition-colors dark:text-teal-400 hover:enabled:dark:text-teal-200"
              onClick={() => browser.runtime.openOptionsPage()}
            >
              {t("popup.openExtensionOptions")}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};
