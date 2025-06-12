import React, { useRef, useId, useCallback, KeyboardEvent } from "react";
import { CategorySettings, ElementTypeMode, PresetId } from "../settings/types";
import { presets, getCategorySettingsFromMode } from "../settings/presets";
import { defaultCustomCategorySettings } from "../settings/constatns";
import { useLang } from "../useLang";
import { Checkbox } from "./Checkbox";

const getEnabledSettingsLabels = (
  settings: CategorySettings,
  t: (key: string) => string,
): string[] => {
  const labels: string[] = [];
  if (settings.heading) labels.push(t("settings.headings"));
  if (settings.image) labels.push(t("settings.images"));
  if (settings.ariaHidden) labels.push(t("settings.ariaHidden"));
  if (settings.formControl) labels.push(t("settings.formControls"));
  if (settings.button) labels.push(t("settings.buttons"));
  if (settings.link) labels.push(t("settings.links"));
  if (settings.section) labels.push(t("settings.sections"));
  if (settings.page) labels.push(t("settings.page"));
  if (settings.lang) labels.push(t("settings.lang"));
  if (settings.table) labels.push(t("settings.tables"));
  if (settings.list) labels.push(t("settings.lists"));
  return labels;
};

interface ElementTypeTabsProps {
  elementTypeMode: ElementTypeMode;
  onChange: (elementTypeMode: ElementTypeMode) => void;
  disabled?: boolean;
}

export const ElementTypeTabs: React.FC<ElementTypeTabsProps> = ({
  elementTypeMode,
  onChange,
  disabled = false,
}) => {
  const { t } = useLang();
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabPanelId = useId();
  const tabListId = useId();

  const currentCategorySettings = getCategorySettingsFromMode(
    elementTypeMode,
    defaultCustomCategorySettings,
  );
  const activeTab: PresetId =
    elementTypeMode.mode === "preset" ? elementTypeMode.presetId : "custom";

  const handlePresetChange = useCallback(
    (presetId: PresetId) => {
      if (presetId === "custom") {
        // カスタムモードに切り替え（現在の設定を保持）
        onChange({
          mode: "custom",
          settings: currentCategorySettings,
        });
      } else {
        // プリセットモードに切り替え
        onChange({
          mode: "preset",
          presetId: presetId,
        });
      }
    },
    [currentCategorySettings, onChange],
  );

  const handleCheckboxChange = useCallback(
    (key: keyof CategorySettings, checked: boolean) => {
      const newCustomSettings = {
        ...currentCategorySettings,
        [key]: checked,
      };

      // チェックボックス変更は常にカスタムモード
      onChange({
        mode: "custom",
        settings: newCustomSettings,
      });
    },
    [currentCategorySettings, onChange],
  );

  const handleTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      const currentTarget = event.currentTarget;
      const tabList = tabListRef.current;
      if (!tabList) return;

      const tabs = Array.from(
        tabList.querySelectorAll('[role="tab"]'),
      ) as HTMLButtonElement[];
      const currentIndex = tabs.indexOf(currentTarget);

      // すべてのタブ（プリセット + カスタム）のIDリスト
      const allTabIds: PresetId[] = [...presets.map((p) => p.id), "custom"];

      switch (event.key) {
        case "ArrowLeft":
        case "ArrowUp": {
          event.preventDefault();
          const prevIndex =
            currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
          tabs[prevIndex]?.focus();
          const prevTabId = allTabIds[prevIndex];
          if (prevTabId) {
            handlePresetChange(prevTabId);
          }
          break;
        }
        case "ArrowRight":
        case "ArrowDown": {
          event.preventDefault();
          const nextIndex =
            currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
          tabs[nextIndex]?.focus();
          const nextTabId = allTabIds[nextIndex];
          if (nextTabId) {
            handlePresetChange(nextTabId);
          }
          break;
        }
        case "Home":
          event.preventDefault();
          tabs[0]?.focus();
          handlePresetChange(allTabIds[0]);
          break;
        case "End":
          event.preventDefault();
          tabs[tabs.length - 1]?.focus();
          handlePresetChange(allTabIds[allTabIds.length - 1]);
          break;
      }
    },
    [disabled, handlePresetChange],
  );

  return (
    <div className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md">
      <fieldset className="border-0 flex flex-col">
        <legend
          className={`text-xs ${disabled ? "text-zinc-700 dark:text-zinc-300" : "text-teal-800 dark:text-teal-200"} font-bold mb-1`}
          id={tabListId}
        >
          {t("settings.elementTypes")}
        </legend>

        {/* タブリスト */}
        <div
          ref={tabListRef}
          role="tablist"
          aria-labelledby={tabListId}
          aria-orientation="horizontal"
          className="flex flex-row mb-2 overflow-x-auto border-b border-zinc-300 dark:border-zinc-600 px-1 -mx-1"
        >
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              role="tab"
              id={`tab-${preset.id}`}
              aria-selected={activeTab === preset.id}
              aria-controls={`${tabPanelId}-panel`}
              tabIndex={activeTab === preset.id ? 0 : -1}
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset border-b-2 ${
                activeTab === preset.id
                  ? "border-teal-500 text-teal-700 bg-white dark:text-teal-400 dark:bg-zinc-800"
                  : "border-transparent text-zinc-600 hover:enabled:text-zinc-800 hover:enabled:border-zinc-300 dark:text-zinc-400 dark:hover:enabled:text-zinc-200 dark:hover:enabled:border-zinc-500"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handlePresetChange(preset.id)}
              onKeyDown={handleTabKeyDown}
              disabled={disabled}
            >
              {t(preset.labelKey)}
            </button>
          ))}
          <button
            key="custom"
            type="button"
            role="tab"
            id="tab-custom"
            aria-selected={activeTab === "custom"}
            aria-controls={`${tabPanelId}-panel`}
            tabIndex={activeTab === "custom" ? 0 : -1}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset border-b-2 ${
              activeTab === "custom"
                ? "border-teal-500 text-teal-700 bg-white dark:text-teal-400 dark:bg-zinc-800"
                : "border-transparent text-zinc-600 hover:enabled:text-zinc-800 hover:enabled:border-zinc-300 dark:text-zinc-400 dark:hover:enabled:text-zinc-200 dark:hover:enabled:border-zinc-500"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => handlePresetChange("custom")}
            onKeyDown={handleTabKeyDown}
            disabled={disabled}
          >
            {t("presets.custom")}
          </button>
        </div>

        {/* タブパネル */}
        <div
          role="tabpanel"
          id={`${tabPanelId}-panel`}
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
        >
          {/* カスタムタブの場合のみチェックボックスを表示 */}
          {activeTab === "custom" ? (
            <div className="flex flex-row flex-wrap gap-x-3 gap-y-1 items-center">
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange("heading", e.target.checked)
                }
                checked={currentCategorySettings.heading}
                disabled={disabled}
              >
                <span className="text-sm">{t("settings.headings")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange("image", e.target.checked)
                }
                checked={currentCategorySettings.image}
                disabled={disabled}
              >
                <span className="text-sm">{t("settings.images")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange("ariaHidden", e.target.checked)
                }
                checked={currentCategorySettings.ariaHidden}
                disabled={disabled}
              >
                <span className="text-sm">{t("settings.ariaHidden")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange("formControl", e.target.checked)
                }
                checked={currentCategorySettings.formControl}
                disabled={disabled}
              >
                <span className="text-sm">{t("settings.formControls")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange("button", e.target.checked)
                }
                checked={currentCategorySettings.button}
                disabled={disabled}
              >
                <span className="text-sm">{t("settings.buttons")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) => handleCheckboxChange("link", e.target.checked)}
                checked={currentCategorySettings.link}
                disabled={disabled}
              >
                <span className="text-sm">{t("settings.links")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange("section", e.target.checked)
                }
                checked={currentCategorySettings.section}
                disabled={disabled}
              >
                <span className="text-sm">{t("settings.sections")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) => handleCheckboxChange("page", e.target.checked)}
                checked={currentCategorySettings.page}
                disabled={disabled}
              >
                <span className="text-sm">{t("settings.page")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) => handleCheckboxChange("lang", e.target.checked)}
                checked={currentCategorySettings.lang}
                disabled={disabled}
              >
                <span className="text-sm">{t("settings.lang")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange("table", e.target.checked)
                }
                checked={currentCategorySettings.table}
                disabled={disabled}
              >
                <span className="text-sm">{t("settings.tables")}</span>
              </Checkbox>
              <Checkbox
                onChange={(e) => handleCheckboxChange("list", e.target.checked)}
                checked={currentCategorySettings.list}
                disabled={disabled}
              >
                <span className="text-sm">{t("settings.lists")}</span>
              </Checkbox>
            </div>
          ) : (
            <div className="px-2 py-1">
              <div className="flex flex-row flex-wrap gap-x-2 gap-y-1 items-center">
                {getEnabledSettingsLabels(currentCategorySettings, t).map(
                  (label) => (
                    <span
                      key={label}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </fieldset>
    </div>
  );
};
