import React from "react";
import "./index.css";
import { Settings } from "../types";
import { useLang } from "../useLang";

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
  const [settings, setSettings] = React.useState<Settings>({
    accessibilityInfo: false,
    image: true,
    formControl: true,
    link: true,
    heading: true,
    ariaHidden: true,
  });
  const t = useLang();
  React.useEffect(() => {
    chrome.storage.local.get("settings", (data) => {
      if (data.settings) {
        setSettings(data.settings);
      }
    });
  }, []);

  const handleChange = (
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

  return (
    <div className="w-64 font-sans p-2 flex flex-col gap-2 items-start">
      <Checkbox
        onChange={(e) => {
          handleChange("accessibilityInfo", e);
        }}
        checked={settings.accessibilityInfo}
      >
        {t("popup.accessibilityInfo")}
      </Checkbox>
      <div className="flex flex-col gap-2 pl-3">
        <Checkbox
          onChange={(e) => {
            handleChange("image", e);
          }}
          checked={settings.image}
          disabled={!settings.accessibilityInfo}
        >
          {t("popup.showImage")}
        </Checkbox>
        <Checkbox
          onChange={(e) => {
            handleChange("formControl", e);
          }}
          checked={settings.formControl}
          disabled={!settings.accessibilityInfo}
        >
          {t("popup.showFormControls")}
        </Checkbox>
        <Checkbox
          onChange={(e) => {
            handleChange("link", e);
          }}
          checked={settings.link}
          disabled={!settings.accessibilityInfo}
        >
          {t("popup.showLinks")}
        </Checkbox>
        <Checkbox
          onChange={(e) => {
            handleChange("heading", e);
          }}
          checked={settings.heading}
          disabled={!settings.accessibilityInfo}
        >
          {t("popup.showHeadings")}
        </Checkbox>
        <Checkbox
          onChange={(e) => {
            handleChange("ariaHidden", e);
          }}
          checked={settings.ariaHidden}
          disabled={!settings.accessibilityInfo}
        >
          {t("popup.showAriaHidden")}
        </Checkbox>
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
