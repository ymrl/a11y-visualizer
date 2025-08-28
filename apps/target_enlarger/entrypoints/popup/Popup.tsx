import React, { useState, useEffect } from "react";
import { loadSettings, saveSettings } from "../../src/settings/storage";
import { TargetEnlargerSettings } from "../../src/settings/types";
import { browser } from "wxt/browser";

export const Popup: React.FC = () => {
  const [settings, setSettings] = useState<TargetEnlargerSettings>({
    enabled: true,
    minTargetSize: 24,
    overlayOpacity: 0.3,
    overlayColor: "#0066cc",
    showTooltips: false,
    enableIframes: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialSettings = async () => {
      try {
        const loadedSettings = await loadSettings();
        setSettings(loadedSettings);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialSettings();
  }, []);

  const toggleEnabled = async () => {
    const newEnabled = !settings.enabled;
    const newSettings = { ...settings, enabled: newEnabled };

    try {
      await saveSettings({ enabled: newEnabled });
      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const openOptions = () => {
    browser.runtime.openOptionsPage();
  };

  if (loading) {
    return (
      <div className="w-80 p-4 bg-white">
        <div className="text-center text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-lg font-semibold">Target Enlarger</h1>
        <p className="text-sm opacity-90">Accessibility enhancement tool</p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Main Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">Enable Extension</div>
            <div className="text-sm text-gray-600">
              Enlarge small clickable targets
            </div>
          </div>
          <button
            onClick={toggleEnabled}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
              settings.enabled ? "bg-blue-600" : "bg-gray-200"
            }`}
            role="switch"
            aria-checked={settings.enabled}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                settings.enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Status */}
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  settings.enabled ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span className="font-medium">
                Status: {settings.enabled ? "Active" : "Disabled"}
              </span>
            </div>
            <div className="text-gray-600 mt-1">
              Min size: {settings.minTargetSize}px | Opacity:{" "}
              {Math.round(settings.overlayOpacity * 100)}%
            </div>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">
            Quick Settings
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-600">
              Target Size: {settings.minTargetSize}px
            </label>
            <input
              type="range"
              min="16"
              max="48"
              step="2"
              value={settings.minTargetSize}
              onChange={async (e) => {
                const newSize = Number(e.target.value);
                const newSettings = { ...settings, minTargetSize: newSize };
                try {
                  await saveSettings({ minTargetSize: newSize });
                  setSettings(newSettings);
                } catch (error) {
                  console.error("Failed to save setting:", error);
                }
              }}
              disabled={!settings.enabled}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-600">
              Opacity: {Math.round(settings.overlayOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.1"
              value={settings.overlayOpacity}
              onChange={async (e) => {
                const newOpacity = Number(e.target.value);
                const newSettings = { ...settings, overlayOpacity: newOpacity };
                try {
                  await saveSettings({ overlayOpacity: newOpacity });
                  setSettings(newSettings);
                } catch (error) {
                  console.error("Failed to save setting:", error);
                }
              }}
              disabled={!settings.enabled}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="border-t pt-4">
          <button
            onClick={openOptions}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md text-sm transition-colors"
          >
            Open Full Settings
          </button>
        </div>

        {/* Info */}
        <div className="text-xs text-gray-500 text-center">
          Helps users interact with small clickable elements
        </div>
      </div>
    </div>
  );
};
