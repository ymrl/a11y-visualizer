import React from "react";
import "./index.css";
import {
  SettingsMessage,
  Settings,
  initialSettings,
  loadHostSettings,
  saveHostSettings,
} from "../settings";
import { useLang } from "../useLang";
import {
  sendMessageToActiveTab,
  sendMessageToActiveTabs,
} from "../chrome/tabs";
import { SettingsEditor } from "../components/SettingsEditor";
import { loadEnabled, saveEnabled } from "../enabled";
import { Checkbox } from "../components/Checkbox";

export const Popup = () => {
  const [settings, setSettings] = React.useState<Settings>(initialSettings);
  const [enabled, setEnabled] = React.useState<boolean>(false);
  const [hostSetting, setHostSetting] = React.useState<boolean>(false);
  const { t, lang } = useLang();

  const loadSettings = async () => {
    const loadedEnabled = await loadEnabled();
    setEnabled(loadedEnabled);
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tabs[0]?.url;
    const host = url ? new URL(url).host : undefined;
    const [newSettings, found] = await loadHostSettings(host);
    setHostSetting(found);
    setSettings(newSettings);
    return newSettings;
  };

  React.useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tabs[0]?.url;
    const host = url ? new URL(url).host : undefined;
    if (host) {
      setHostSetting(true);
      saveHostSettings(host, newSettings);
      sendMessageToActiveTabs<SettingsMessage>({
        type: "updateHostSettings",
        settings: newSettings,
        enabled: enabled,
        host: host,
      });
    }
  };

  return (
    <div className="w-64 p-2 flex flex-col gap-2 items-start" lang={lang}>
      <Checkbox
        onChange={async (e) => {
          setEnabled(e.target.checked);
          saveEnabled(e.target.checked);
          chrome.runtime.sendMessage({
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
        {t("popup.enabled")}
      </Checkbox>

      <SettingsEditor
        settings={settings}
        onChange={updateSettings}
        disabled={!enabled}
      />
      <div className="w-full flex flex-row gap-2 items-center">
        <button
          type="button"
          className="
            border-slate-400 border-solid border
            px-4 py-1 rounded-full
            bg-slate-100 hover:enabled:bg-slate-200 transition-colors
            disabled:border-slate-200 disabled:text-slate-600 disabled:cursor-not-allowed"
          onClick={() => {
            sendMessageToActiveTab({
              type: "applySettings",
              settings: settings,
              enabled: enabled,
            });
          }}
          disabled={!enabled}
        >
          {t("popup.rerun")}
        </button>

        <button
          type="button"
          className="
            border-slate-400 border-solid border
            px-4 py-1 rounded-full
            bg-slate-100 hover:enabled:bg-slate-200 transition-colors
            disabled:border-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed"
          onClick={async () => {
            const tabs = await chrome.tabs.query({
              active: true,
              currentWindow: true,
            });
            if (tabs[0] && tabs[0].url && tabs[0].url.startsWith("http")) {
              const url = new URL(tabs[0].url);
              const host = url.host;
              await chrome.storage.local.remove(host);
              const defaultSettings = await loadSettings();
              sendMessageToActiveTabs<SettingsMessage>({
                type: "updateHostSettings",
                settings: defaultSettings,
                enabled: enabled,
                host: host,
              });
            }
          }}
          disabled={!enabled || !hostSetting}
        >
          {t("popup.reset")}
        </button>
      </div>
      <p className="text-xs text-slate-500">{t("popup.hostDesc")}</p>
    </div>
  );
};
