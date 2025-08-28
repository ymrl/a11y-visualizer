import React, { useState, useEffect } from "react";
import {
  loadSettings,
  saveSettings,
  resetSettings,
} from "../../src/settings/storage";
import { TargetEnlargerSettings } from "../../src/settings/types";

export const OptionsPage: React.FC = () => {
  const [settings, setSettings] = useState<TargetEnlargerSettings>({
    enabled: true,
    minTargetSize: 24,
    overlayOpacity: 0.3,
    overlayColor: "#0066cc",
    showTooltips: false,
    enableIframes: true,
  });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>("");

  useEffect(() => {
    const loadInitialSettings = async () => {
      try {
        const loadedSettings = await loadSettings();
        setSettings(loadedSettings);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadInitialSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("");

    try {
      await saveSettings(settings);
      setSaveStatus("Settings saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveStatus("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      const defaultSettings = await resetSettings();
      setSettings(defaultSettings);
      setSaveStatus("Settings reset to defaults");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Failed to reset settings:", error);
      setSaveStatus("Failed to reset settings");
    }
  };

  const updateSetting = <K extends keyof TargetEnlargerSettings>(
    key: K,
    value: TargetEnlargerSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Target Enlarger Settings
          </h1>

          <div className="space-y-6">
            {/* Enable/Disable */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enabled"
                checked={settings.enabled}
                onChange={(e) => updateSetting("enabled", e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="enabled"
                className="text-lg font-medium text-gray-900"
              >
                Enable Target Enlarger
              </label>
            </div>

            {/* Minimum Target Size */}
            <div className="space-y-2">
              <label
                htmlFor="minTargetSize"
                className="block text-sm font-medium text-gray-700"
              >
                Minimum Target Size: {settings.minTargetSize}px
              </label>
              <input
                type="range"
                id="minTargetSize"
                min="16"
                max="48"
                step="2"
                value={settings.minTargetSize}
                onChange={(e) =>
                  updateSetting("minTargetSize", Number(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={!settings.enabled}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>16px</span>
                <span>24px (WCAG)</span>
                <span>48px</span>
              </div>
              <p className="text-sm text-gray-600">
                Elements smaller than this size will be enlarged
              </p>
            </div>

            {/* Overlay Opacity */}
            <div className="space-y-2">
              <label
                htmlFor="overlayOpacity"
                className="block text-sm font-medium text-gray-700"
              >
                Overlay Opacity: {Math.round(settings.overlayOpacity * 100)}%
              </label>
              <input
                type="range"
                id="overlayOpacity"
                min="0.1"
                max="0.8"
                step="0.1"
                value={settings.overlayOpacity}
                onChange={(e) =>
                  updateSetting("overlayOpacity", Number(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={!settings.enabled}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>10%</span>
                <span>30% (Default)</span>
                <span>80%</span>
              </div>
            </div>

            {/* Overlay Color */}
            <div className="space-y-2">
              <label
                htmlFor="overlayColor"
                className="block text-sm font-medium text-gray-700"
              >
                Overlay Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  id="overlayColor"
                  value={settings.overlayColor}
                  onChange={(e) =>
                    updateSetting("overlayColor", e.target.value)
                  }
                  className="w-12 h-12 rounded border border-gray-300"
                  disabled={!settings.enabled}
                />
                <span className="text-sm text-gray-600">
                  {settings.overlayColor}
                </span>
              </div>
            </div>

            {/* Show Tooltips */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="showTooltips"
                checked={settings.showTooltips}
                onChange={(e) =>
                  updateSetting("showTooltips", e.target.checked)
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                disabled={!settings.enabled}
              />
              <label
                htmlFor="showTooltips"
                className="text-sm font-medium text-gray-700"
              >
                Show size information on overlays
              </label>
            </div>

            {/* Enable Iframes */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableIframes"
                checked={settings.enableIframes}
                onChange={(e) =>
                  updateSetting("enableIframes", e.target.checked)
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                disabled={!settings.enabled}
              />
              <label
                htmlFor="enableIframes"
                className="text-sm font-medium text-gray-700"
              >
                Process iframe content (includes ads)
              </label>
            </div>
            <p className="text-sm text-gray-600 ml-8">
              When enabled, Target Enlarger will also process small clickable
              elements inside iframes, including advertisements. This may
              improve accessibility for iframe-based content but could impact
              performance.
            </p>

            {/* Preview */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Preview
              </h3>
              <div className="relative inline-block">
                <div className="w-16 h-8 bg-gray-300 rounded border text-xs flex items-center justify-center">
                  Small Button
                </div>
                {settings.enabled && (
                  <div
                    className="absolute top-0 left-0 flex items-center justify-center text-white text-xs"
                    style={{
                      width: `${settings.minTargetSize}px`,
                      height: `${settings.minTargetSize}px`,
                      backgroundColor: settings.overlayColor,
                      opacity: settings.overlayOpacity,
                      transform: `translate(${(64 - settings.minTargetSize) / 2}px, ${(32 - settings.minTargetSize) / 2}px)`,
                      borderRadius: "2px",
                    }}
                  >
                    {settings.showTooltips &&
                      `${settings.minTargetSize}×${settings.minTargetSize}`}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset to Defaults
            </button>

            <div className="flex items-center space-x-4">
              {saveStatus && (
                <span
                  className={`text-sm ${
                    saveStatus.includes("success")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {saveStatus}
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>

          {/* Information */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              About Target Enlarger
            </h3>
            <p className="text-sm text-blue-700">
              This extension helps users with motor disabilities by enlarging
              small interactive elements that don't meet WCAG 2.2 Target Size
              (Minimum) guidelines. It automatically detects elements smaller
              than the configured size and overlays larger clickable areas that
              forward interactions to the original elements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
