import React, { useEffect, useState, useCallback, useRef } from "react";
import { OverlayButton } from "../../src/components/OverlayButton";
import {
  detectSmallTargets,
  SmallTargetInfo,
} from "../../src/detector/targetDetector";
import { loadSettings } from "../../src/settings/storage";
import { TargetEnlargerSettings } from "../../src/settings/types";
import { IframeManager } from "../../src/iframe/iframeManager";
import { isElementVisibleAndInViewport } from "../../src/utils/viewportAdjustment";
import { browser } from "wxt/browser";

export const TargetEnlarger: React.FC = () => {
  const [smallTargets, setSmallTargets] = useState<SmallTargetInfo[]>([]);
  const [settings, setSettings] = useState<TargetEnlargerSettings>({
    enabled: false,
    minTargetSize: 24,
    overlayOpacity: 0.3,
    overlayColor: "#0066cc",
    showTooltips: false,
    enableIframes: true,
  });
  const iframeManagerRef = useRef<IframeManager | null>(null);

  const refreshTargets = useCallback(async () => {
    if (!settings.enabled) {
      setSmallTargets([]);
      return;
    }

    try {
      // メインドキュメントのターゲットを検出
      const mainTargets = detectSmallTargets(
        document,
        window,
        settings.minTargetSize,
      );

      // iframe内のターゲットを検出（設定で有効な場合のみ）
      let iframeTargets: SmallTargetInfo[] = [];
      if (settings.enableIframes && iframeManagerRef.current) {
        iframeTargets = await iframeManagerRef.current.scanForIframes(document);
      }

      // ビューポート内にあり、かつ表示されている要素のみをフィルタリング
      const allTargets = [...mainTargets, ...iframeTargets];
      const visibleTargets = allTargets.filter((targetInfo) => {
        // 表示されていて、かつ少なくとも一部がビューポートに表示されている要素のみ
        return isElementVisibleAndInViewport(targetInfo.element, 50);
      });

      setSmallTargets(visibleTargets);
    } catch (error) {
      console.error("Failed to detect small targets:", error);
      setSmallTargets([]);
    }
  }, [settings.enabled, settings.minTargetSize, settings.enableIframes]);

  const handleTargetClick = useCallback(
    (element: Element, event: React.MouseEvent) => {
      const syntheticEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        clientX: event.clientX,
        clientY: event.clientY,
        button: event.button,
        buttons: event.buttons,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
      });

      element.dispatchEvent(syntheticEvent);
    },
    [],
  );

  useEffect(() => {
    let mounted = true;

    const loadInitialSettings = async () => {
      try {
        const initialSettings = await loadSettings();
        if (mounted) {
          setSettings(initialSettings);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadInitialSettings();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    refreshTargets();
  }, [refreshTargets]);

  // IframeManagerの初期化
  useEffect(() => {
    if (settings.enabled && settings.enableIframes) {
      const onIframeTargetsFound = (targets: SmallTargetInfo[]) => {
        setSmallTargets((prev) => {
          // 既存のiframeターゲットを除外して新しいものを追加
          const mainTargets = prev.filter((t) => !t.element.closest("iframe"));
          return [...mainTargets, ...targets];
        });
      };

      iframeManagerRef.current = new IframeManager(
        onIframeTargetsFound,
        settings,
      );
    } else {
      iframeManagerRef.current?.cleanup();
      iframeManagerRef.current = null;
    }

    return () => {
      iframeManagerRef.current?.cleanup();
    };
  }, [settings.enabled, settings.enableIframes, settings]);

  // PostMessage処理（iframe内外の通信）
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === "TARGET_ENLARGER_SCAN") {
        try {
          const iframeTargets = detectSmallTargets(
            document,
            window,
            event.data.settings.minTargetSize,
          );

          // iframe内で表示されていて、かつビューポートに表示されている要素のみをフィルタリング
          const visibleIframeTargets = iframeTargets.filter((targetInfo) => {
            return isElementVisibleAndInViewport(targetInfo.element, 50);
          });

          // iframe内の座標をビューポート座標として送信（スクロールを考慮しない）
          const targetsWithViewportCoords = visibleIframeTargets.map(
            (target) => ({
              ...target,
              position: {
                ...target.position,
                // ビューポート座標として送信（iframe内でのスクロールを除いた座標）
                x: target.position.absoluteX - window.scrollX,
                y: target.position.absoluteY - window.scrollY,
                // 他の座標情報もそのまま送信（親側で再計算される）
              },
            }),
          );

          // 親windowに結果を送信
          // iframeRectは親側から受信したものをそのまま返す
          event.source?.postMessage(
            {
              type: "TARGET_ENLARGER_TARGETS",
              targets: targetsWithViewportCoords,
              iframeRect: event.data.iframeRect, // 親から送られてきた位置情報をそのまま返す
            },
            "*",
          );
        } catch (error) {
          console.debug(
            "Failed to process TARGET_ENLARGER_SCAN message:",
            error,
          );
        }
      }
    };

    if (settings.enabled) {
      window.addEventListener("message", handleMessage);
      return () => {
        window.removeEventListener("message", handleMessage);
      };
    }
  }, [settings.enabled]);

  useEffect(() => {
    if (!settings.enabled) return;

    const handleResize = () => refreshTargets();
    const handleScroll = () => refreshTargets();

    // Debounced refresh for DOM changes
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedRefresh = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(refreshTargets, 100);
    };

    const observer = new MutationObserver(debouncedRefresh);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Listen for settings changes
    const handleStorageChange = (changes: {
      [key: string]: browser.Storage.StorageChange;
    }) => {
      const updatedSettings = { ...settings };
      let hasChanges = false;

      for (const [key, change] of Object.entries(changes)) {
        if (key in updatedSettings) {
          (updatedSettings as Record<string, unknown>)[key] = change.newValue;
          hasChanges = true;
        }
      }

      if (hasChanges) {
        setSettings(updatedSettings);
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      browser.storage.onChanged.removeListener(handleStorageChange);
      clearTimeout(timeoutId);
    };
  }, [settings, refreshTargets]);

  if (!settings.enabled || smallTargets.length === 0) {
    return null;
  }

  return (
    <div data-target-enlarger-extension style={{ pointerEvents: "none" }}>
      {smallTargets.map((targetInfo, index) => (
        <OverlayButton
          key={`${targetInfo.element.tagName}-${index}`}
          targetInfo={targetInfo}
          settings={settings}
          onTargetClick={handleTargetClick}
        />
      ))}
    </div>
  );
};
