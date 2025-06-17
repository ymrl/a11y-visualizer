import { browser } from "#imports";
import React from "react";
import "./index.css";
import {
  SettingsMessage,
  Settings,
  initialSettings,
  loadUrlSettings,
  resetUrlSettings,
  saveUrlSettings,
} from "../../src/settings";
import { useLang } from "../../src/useLang";
import {
  sendMessageToActiveTab,
  sendMessageToActiveTabs,
} from "../../src/browser/tabs";
import { SettingsEditor } from "../../src/components/SettingsEditor";
import { loadEnabled, saveEnabled } from "../../src/enabled";
import { Checkbox } from "../../src/components/Checkbox";
import icon from "../../src/assets/icon.svg";
import iconDisabled from "../../src/assets/icon-disabled.svg";
import { IoBackspaceOutline, IoReloadOutline } from "react-icons/io5";

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

  const loadSettings = async () => {
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
  };

  React.useEffect(() => {
    loadSettings();
  }, []);

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
      className="w-80 font-sans text-zinc-800 bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300"
      lang={lang}
      data-testid="popup-container"
    >
      <div
        className="p-2 relative flex flex-row items-center justify-between gap-3
      bg-zinc-100 dark:bg-zinc-800"
      >
        <div className="flex flex-row gap-1 items-center justify-start">
          <img
            src={enabled ? icon : iconDisabled}
            alt={enabled ? t("popup.iconEyesOpen") : t("popup.iconEyesClosed")}
            className="size-8 -mt-1 -mb-1 -ml-1"
            width="24"
            height="24"
          />
          <h1 className="text-xs font-bold text-teal-800 dark:text-teal-200">
            {t("popup.title")}
          </h1>
          <button
            type="button"
            className="text-teal-700 bg-opacity-0 rounded-full shrink-0 p-1
                dark:text-teal-200
                hover:enabled:bg-zinc-200 transition-colors cursor-pointer
                dark:hover:enabled:bg-teal-800
                disabled:text-zinc-400 disabled:cursor-not-allowed z-10"
            onClick={() => {
              sendMessageToActiveTab({
                type: "applySettings",
                settings: settings,
                enabled: enabled,
              });
            }}
            disabled={!enabled || !host}
            title={t("popup.rerun")}
            data-testid="apply-button"
          >
            <IoReloadOutline
              role="img"
              aria-label={t("popup.rerun")}
              className="size-4"
            />
          </button>
        </div>
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
          data-testid="enabled-checkbox"
        >
          <span
            className="text-xs font-bold text-teal-800
          dark:text-teal-200 shrink-0"
          >
            {t("popup.enabled")}
          </span>
        </Checkbox>
      </div>
      {(host || isFile) && (
        <div className="p-2 flex flex-col gap-0 items-stretch">
          <div className="flex flex-row gap-2 items-center mb-2 px-2">
            <h2 className="text-sm font-bold text-teal-800 dark:text-teal-200 shrink" data-testid="host-title">
              {host && t("popup.settingsForHost", { host })}
              {isFile && t("popup.settingsForFile")}
            </h2>
            <button
              type="button"
              className="text-teal-700 bg-opacity-0 rounded-full shrink-0 p-1
                dark:text-teal-200
                hover:enabled:bg-zinc-100 transition-colors cursor-pointer
                dark:hover:enabled:bg-teal-800
                disabled:text-zinc-400 disabled:cursor-not-allowed"
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
              data-testid="reset-button"
            >
              <IoBackspaceOutline
                role="img"
                aria-label={t("popup.reset")}
                className="size-4"
              />
            </button>
          </div>
          <SettingsEditor
            settings={settings}
            onChange={updateSettings}
            disabled={!enabled}
            showDisplaySettingsCollapsed={true}
            url={url}
            data-testid="settings-editor"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 px-2">
            {t("popup.hostDesc")}
            <button
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
