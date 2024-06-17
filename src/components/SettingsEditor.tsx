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
        <span className="text-sm">{t("settings.showTips")}</span>
      </Checkbox>
      <div className="flex flex-col gap-2 pl-4">
        <div className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md">
          <fieldset className="border-0 flex flex-col">
            <legend
              className={`text-xs ${disabled || !settings.accessibilityInfo ? "text-zinc-700 dark:text-zinc-300" : "text-teal-800 dark:text-teal-200"} font-bold mb-1`}
            >
              {t("settings.elementTypes")}
            </legend>
            <div className="flex flex-row flex-wrap gap-x-3 gap-y-1 items-center">
              <Checkbox
                onChange={(e) => {
                  handleChangeCheckbox("heading", e);
                }}
                checked={settings.heading}
                disabled={disabled || !settings.accessibilityInfo}
              >
                <span className="text-sm">{t("settings.headings")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) => {
                  handleChangeCheckbox("image", e);
                }}
                checked={settings.image}
                disabled={disabled || !settings.accessibilityInfo}
              >
                <span className="text-sm">{t("settings.images")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) => {
                  handleChangeCheckbox("ariaHidden", e);
                }}
                checked={settings.ariaHidden}
                disabled={disabled || !settings.accessibilityInfo}
              >
                <span className="text-sm">{t("settings.ariaHidden")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) => {
                  handleChangeCheckbox("formControl", e);
                }}
                checked={settings.formControl}
                disabled={disabled || !settings.accessibilityInfo}
              >
                <span className="text-sm">{t("settings.formControls")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) => {
                  handleChangeCheckbox("button", e);
                }}
                checked={settings.button}
                disabled={disabled || !settings.accessibilityInfo}
              >
                <span className="text-sm">{t("settings.buttons")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) => {
                  handleChangeCheckbox("link", e);
                }}
                checked={settings.link}
                disabled={disabled || !settings.accessibilityInfo}
              >
                <span className="text-sm">{t("settings.links")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) => {
                  handleChangeCheckbox("section", e);
                }}
                checked={settings.section}
                disabled={disabled || !settings.accessibilityInfo}
              >
                <span className="text-sm">{t("settings.sections")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) => {
                  handleChangeCheckbox("page", e);
                }}
                checked={settings.page}
                disabled={disabled || !settings.accessibilityInfo}
              >
                <span className="text-sm">{t("settings.page")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) => {
                  handleChangeCheckbox("lang", e);
                }}
                checked={settings.lang}
                disabled={disabled || !settings.accessibilityInfo}
              >
                <span className="text-sm">{t("settings.lang")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) => {
                  handleChangeCheckbox("table", e);
                }}
                checked={settings.table}
                disabled={disabled || !settings.accessibilityInfo}
              >
                <span className="text-sm">{t("settings.tables")}</span>
              </Checkbox>
            </div>
          </fieldset>
        </div>
        <div className="flex flex-col gap-1 items-stretch">
          <div className="flex flex-row gap-2 items-center justify-between">
            <label className="text-sm shrink-0" htmlFor="tipOpacityPercent">
              {t("settings.tipOpacityPercent")}
            </label>
            <span>
              <span className="text-sm font-bold shrink">
                {settings.tipOpacityPercent}
              </span>
              <span className="text-xs">%</span>
            </span>
          </div>
          <input
            id="tipOpacityPercent"
            className="accent-teal-600 dark:accent-teal-400"
            type="range"
            min={0}
            max={100}
            step={1}
            value={settings.tipOpacityPercent}
            onChange={(e) => handleChangeNumber("tipOpacityPercent", e)}
            disabled={disabled || !settings.accessibilityInfo}
          />
        </div>
        <label className="flex flex-row gap-2 items-center justify-between">
          <span className="shrink text-sm">{t("settings.tipFontSize")}</span>
          <input
            className="border-zinc-400 border-solid border rounded-md
                  py-0.5 px-1 text-sm text-right w-14 h-6
                  bg-white dark:bg-zinc-800
                  text-zinc-800 dark:text-zinc-300
                  disabled:opacity-60
                  "
            type="number"
            value={settings.tipFontSize}
            onChange={(e) => {
              handleChangeNumber("tipFontSize", e);
            }}
            min={8}
            step={1}
            disabled={disabled || !settings.accessibilityInfo}
          />
        </label>

        <div className="flex flex-col gap-1">
          <Checkbox
            onChange={(e) => {
              handleChangeCheckbox("interactiveMode", e);
            }}
            checked={settings.interactiveMode}
            disabled={disabled || !settings.accessibilityInfo}
          >
            <span className="text-sm">{t("settings.interactiveMode")}</span>
          </Checkbox>
          <div className="flex flex-col gap-2 pl-4">
            <Checkbox
              onChange={(e) => {
                handleChangeCheckbox("hideTips", e);
              }}
              checked={settings.hideTips}
              disabled={
                disabled ||
                !settings.accessibilityInfo ||
                !settings.interactiveMode
              }
            >
              <span className="text-sm">{t("settings.hideLabels")}</span>
            </Checkbox>
          </div>
        </div>
      </div>
      <Checkbox
        onChange={(e) => {
          handleChangeCheckbox("showLiveRegions", e);
        }}
        checked={settings.showLiveRegions}
        disabled={disabled}
      >
        <span className="text-sm">{t("settings.announceLiveRegions")}</span>
      </Checkbox>
      <div className="flex flex-col gap-2 pl-3 w-full">
        <div className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md">
          <fieldset className="border-0 flex flex-col gap-2">
            <legend
              className={`text-xs ${disabled ? "text-zinc-700 dark:text-zinc-300" : "text-teal-800 dark:text-teal-200"} font-bold mb-1`}
            >
              {t("settings.announcement")}
            </legend>

            <label className="flex flex-row gap-1 items-center justify-between">
              <span className="srhink text-xs">
                {t("settings.announcementMaxSeconds")}
              </span>
              <input
                className="border-zinc-400 border-solid border rounded-md
                  py-0.5 px-1 text-sm text-right w-14 h-6
                  bg-white dark:bg-zinc-800
                  text-zinc-800 dark:text-zinc-300
                  disabled:opacity-60
                  "
                type="number"
                value={settings.announcementMaxSeconds}
                onChange={(e) =>
                  handleChangeNumber("announcementMaxSeconds", e)
                }
                min={1}
                step={1}
                disabled={disabled || !settings.showLiveRegions}
              />
            </label>
            <label className="flex flex-row gap-1 items-center justify-between">
              <span className="shrink text-xs">
                {t("settings.announcementSecondsPerCharacter")}
              </span>
              <input
                className="border-zinc-400 border-solid border rounded-md
                  py-0.5 px-1 text-sm text-right w-14 h-6
                  bg-white dark:bg-zinc-800
                  text-zinc-800 dark:text-zinc-300
                  disabled:opacity-60
                  "
                type="number"
                value={settings.announcementSecondsPerCharacter}
                onChange={(e) =>
                  handleChangeNumber("announcementSecondsPerCharacter", e)
                }
                min={0.1}
                step={0.1}
                disabled={disabled || !settings.showLiveRegions}
              />
            </label>
          </fieldset>
        </div>
        <div className="flex flex-col gap-1 items-stretch">
          <div className="flex flex-row gap-2 items-center justify-between">
            <label
              className="text-sm shrink-0"
              htmlFor="liveRegionOpacityPercent"
            >
              {t("settings.liveRegionOpacityPercent")}
            </label>
            <span>
              <span className="text-sm font-bold shrink">
                {settings.liveRegionOpacityPercent}
              </span>
              <span className="text-xs">%</span>
            </span>
          </div>
          <input
            id="liveRegionOpacityPercent"
            className="accent-teal-600 dark:accent-teal-400"
            type="range"
            min={0}
            max={100}
            step={1}
            value={settings.liveRegionOpacityPercent}
            onChange={(e) => handleChangeNumber("liveRegionOpacityPercent", e)}
            disabled={disabled || !settings.showLiveRegions}
          />
        </div>
        <label className="flex flex-row gap-2 items-center justify-between">
          <span className="shrink text-sm">
            {t("settings.liveRegionFontSize")}
          </span>
          <input
            className="border-zinc-400 border-solid border rounded-md
                  py-0.5 px-1 text-sm text-right w-14 h-6
                  bg-white dark:bg-zinc-800
                  text-zinc-800 dark:text-zinc-300
                  disabled:opacity-60
                  "
            type="number"
            value={settings.liveRegionFontSize}
            onChange={(e) => {
              handleChangeNumber("liveRegionFontSize", e);
            }}
            min={8}
            step={1}
            disabled={disabled || !settings.showLiveRegions}
          />
        </label>
      </div>
    </form>
  );
};
