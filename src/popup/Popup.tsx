import React from "react";
import "./index.css";
import { Settings } from "../types";
import { useLang } from "../useLang";
import { initialSettings } from "../initialSettings";

const Checkbox = ({
  children,
  onChange,
  checked,
  disabled,
}: {
  children: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  checked?: boolean;
  disabled?: boolean;
}) => {
  return (
    <label className="flex flex-row gap-1 items-center">
      <input
        type="checkbox"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
      {children}
    </label>
  );
};

export const Popup = () => {
  const [settings, setSettings] = React.useState<Settings>(initialSettings);
  const { t, lang } = useLang();
  React.useEffect(() => {
    chrome.storage.local.get("settings", (data) => {
      if (data.settings) {
        setSettings((prev) => ({
          ...prev,
          ...data.settings,
        }));
      }
    });
  }, []);

  const handleChangeCheckbox = (
    key: keyof Settings,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newSettings = {
      ...settings,
      [key]: e.target.checked,
    };
    setSettings(newSettings);
    chrome.storage.local.set({ settings: newSettings });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "updateAccessibilityInfo",
          settings: newSettings,
        });
      }
    });
  };
  const handleChangeNumber = (
    key: keyof Settings,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newSettings = {
      ...settings,
      [key]: parseFloat(e.target.value),
    };
    setSettings(newSettings);
    chrome.storage.local.set({ settings: newSettings });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "updateAccessibilityInfo",
          settings: newSettings,
        });
      }
    });
  };

  return (
    <div
      className="w-64 font-sans p-2 flex flex-col gap-2 items-start"
      lang={lang}
    >
      <Checkbox
        onChange={(e) => {
          handleChangeCheckbox("accessibilityInfo", e);
        }}
        checked={settings.accessibilityInfo}
      >
        {t("popup.accessibilityInfo")}
      </Checkbox>

      <div className="flex flex-col gap-2 pl-3">
        <Checkbox
          onChange={(e) => {
            handleChangeCheckbox("image", e);
          }}
          checked={settings.image}
          disabled={!settings.accessibilityInfo}
        >
          {t("popup.showImage")}
        </Checkbox>
        <Checkbox
          onChange={(e) => {
            handleChangeCheckbox("formControl", e);
          }}
          checked={settings.formControl}
          disabled={!settings.accessibilityInfo}
        >
          {t("popup.showFormControls")}
        </Checkbox>
        <Checkbox
          onChange={(e) => {
            handleChangeCheckbox("link", e);
          }}
          checked={settings.link}
          disabled={!settings.accessibilityInfo}
        >
          {t("popup.showLinks")}
        </Checkbox>
        <Checkbox
          onChange={(e) => {
            handleChangeCheckbox("heading", e);
          }}
          checked={settings.heading}
          disabled={!settings.accessibilityInfo}
        >
          {t("popup.showHeadings")}
        </Checkbox>
        <Checkbox
          onChange={(e) => {
            handleChangeCheckbox("ariaHidden", e);
          }}
          checked={settings.ariaHidden}
          disabled={!settings.accessibilityInfo}
        >
          {t("popup.showAriaHidden")}
        </Checkbox>
      </div>
      <Checkbox
        onChange={(e) => {
          handleChangeCheckbox("showLiveRegions", e);
        }}
        checked={settings.showLiveRegions}
      >
        {t("popup.showLiveRegions")}
      </Checkbox>
      <div className="flex flex-col gap-2 pl-3 w-full">
        <label className="flex flex-col gap-1 items-stretch">
          <span className="srhink-0">{t("popup.announcementMaxSeconds")}</span>
          <input
            className="border-slate-400 border-solid border rounded-md p-1 text-right"
            type="number"
            value={settings.announcementMaxSeconds}
            onChange={(e) => handleChangeNumber("announcementMaxSeconds", e)}
            min={1}
            step={1}
          />
        </label>
        <label className="flex flex-col gap-1 items-stretch">
          <span className="shrink-0">
            {t("popup.announcementSecondsPerCharacter")}
          </span>
          <input
            className="border-slate-400 border-solid border rounded-md p-1 text-right"
            type="number"
            value={settings.announcementSecondsPerCharacter}
            onChange={(e) =>
              handleChangeNumber("announcementSecondsPerCharacter", e)
            }
            min={0.1}
            step={0.1}
          />
        </label>
      </div>
      <button
        type="button"
        className="
          border-slate-400 border-solid border
          px-4 py-1 rounded-full
          bg-slate-100 hover:bg-slate-200 transition-colors"
        onClick={() => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0].id) {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: "updateAccessibilityInfo",
                settings,
              });
            }
          });
        }}
      >
        {t("popup.rerun")}
      </button>
    </div>
  );
};
