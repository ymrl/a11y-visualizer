import { Settings } from "../settings/types";
import { useLang } from "../useLang";
import { Checkbox } from "./Checkbox";

export const SettingsEditor = ({
  settings,
  onChange,
  disabled,
}: {
  settings: Settings;
  onChange: (settings: Settings) => void;
  disabled?: boolean;
}) => {
  const { t, lang } = useLang();
  const handleChangeCheckbox = (
    key: keyof Settings,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newSettings = {
      ...settings,
      [key]: e.target.checked,
    };
    onChange(newSettings);
  };
  const handleChangeNumber = (
    key: keyof Settings,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newSettings = {
      ...settings,
      [key]: parseFloat(e.target.value),
    };
    onChange(newSettings);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="font-sans flex flex-col gap-2 items-stretch w-full"
      lang={lang}
    >
      <Checkbox
        onChange={(e) => {
          handleChangeCheckbox("accessibilityInfo", e);
        }}
        checked={settings.accessibilityInfo}
        disabled={disabled}
      >
        {t("popup.accessibilityInfo")}
      </Checkbox>

      <div className="flex flex-col gap-2 pl-3">
        <Checkbox
          onChange={(e) => {
            handleChangeCheckbox("image", e);
          }}
          checked={settings.image}
          disabled={disabled || !settings.accessibilityInfo}
        >
          {t("popup.showImage")}
        </Checkbox>
        <Checkbox
          onChange={(e) => {
            handleChangeCheckbox("button", e);
          }}
          checked={settings.button}
          disabled={disabled || !settings.accessibilityInfo}
        >
          {t("popup.showButtons")}
        </Checkbox>
        <Checkbox
          onChange={(e) => {
            handleChangeCheckbox("link", e);
          }}
          checked={settings.link}
          disabled={disabled || !settings.accessibilityInfo}
        >
          {t("popup.showLinks")}
        </Checkbox>
        <Checkbox
          onChange={(e) => {
            handleChangeCheckbox("formControl", e);
          }}
          checked={settings.formControl}
          disabled={disabled || !settings.accessibilityInfo}
        >
          {t("popup.showFormControls")}
        </Checkbox>
        <Checkbox
          onChange={(e) => {
            handleChangeCheckbox("heading", e);
          }}
          checked={settings.heading}
          disabled={disabled || !settings.accessibilityInfo}
        >
          {t("popup.showHeadings")}
        </Checkbox>
        <Checkbox
          onChange={(e) => {
            handleChangeCheckbox("ariaHidden", e);
          }}
          checked={settings.ariaHidden}
          disabled={disabled || !settings.accessibilityInfo}
        >
          {t("popup.showAriaHidden")}
        </Checkbox>
        <label className="flex flex-col gap-1 items-stretch">
          <span className="shrink-0">{t("popup.tipOpacityPercent")}</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={settings.tipOpacityPercent}
            onChange={(e) => handleChangeNumber("tipOpacityPercent", e)}
            disabled={disabled}
          />
        </label>
        <Checkbox
          onChange={(e) => {
            handleChangeCheckbox("interactiveMode", e);
          }}
          checked={settings.interactiveMode}
          disabled={disabled}
        >
          {t("popup.interactiveMode")}
        </Checkbox>
        <div className="flex flex-col gap-2 pl-3">
          <Checkbox
            onChange={(e) => {
              handleChangeCheckbox("hideTips", e);
            }}
            checked={settings.hideTips}
            disabled={disabled || !settings.interactiveMode}
          >
            {t("popup.hideTipLabels")}
          </Checkbox>
        </div>
      </div>
      <Checkbox
        onChange={(e) => {
          handleChangeCheckbox("showLiveRegions", e);
        }}
        checked={settings.showLiveRegions}
        disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
          />
        </label>
        <label className="flex flex-col gap-1 items-stretch">
          <span className="shrink-0">
            {t("popup.liveRegionOpacityPercent")}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={settings.liveRegionOpacityPercent}
            onChange={(e) => handleChangeNumber("liveRegionOpacityPercent", e)}
            disabled={disabled}
          />
        </label>
      </div>
    </form>
  );
};
