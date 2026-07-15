import React, { useState } from "react";
import { createPortal } from "react-dom";
import { collectShadowRoots } from "../../src/dom/collectShadowRoots";
import { detectFrameType } from "../../src/dom/detectFrameType";
import { Announcements } from "../content/components/Announcements";
import { ElementList } from "../content/components/ElementList";
import { Keystrokes } from "../content/components/Keystrokes";
import { SettingsContext } from "../content/contexts/SettingsContext";
import { getRootSize } from "../content/dom/getRootSize";
import { useDebouncedCallback } from "../content/hooks/useDebouncedCallback";
import { useAriaNotifyLocal } from "./hooks/useAriaNotifyLocal";
import { useElementMetaLocal } from "./hooks/useElementMetaLocal";
import { useKeystrokesLocal } from "./hooks/useKeystrokesLocal";
import { useLiveRegionLocal } from "./hooks/useLiveRegionLocal";
import { useMessageRelay } from "./hooks/useMessageRelay";

export type AllFramesRootOptions = {
  srcdoc?: boolean;
  renderType?: "initial" | "enabled" | "visibilitychange";
};

export const AllFramesRoot = ({
  parentRef,
  options,
}: {
  parentRef: React.RefObject<Element>;
  options?: AllFramesRootOptions;
}) => {
  const { srcdoc } = options || {};
  const settings = React.useContext(SettingsContext);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const viewportWidthRef = React.useRef(0);
  const viewportHeightRef = React.useRef(0);
  const viewportScrollXRef = React.useRef(0);
  const viewportScrollYRef = React.useRef(0);

  const frameType = React.useMemo(detectFrameType, []);

  // Legacy frames are self-contained; others forward via postMessage
  const forwardMode = frameType === "legacy-frame" ? "self" : "postMessage";

  const { announcements, observeLiveRegion, addAnnouncement } =
    useLiveRegionLocal({
      parentRef,
      renderType: options?.renderType,
      forwardMode,
    });
  const { keystrokes } = useKeystrokesLocal({ forwardMode });
  useAriaNotifyLocal({ addAnnouncement });
  useMessageRelay({ forwardMode });
  const { metaList, topLayers, updateMetaList } = useElementMetaLocal({
    parentRef,
    containerRef,
    srcdoc,
    viewportScrollXRef,
    viewportScrollYRef,
    viewportWidthRef,
    viewportHeightRef,
  });

  const firstTimeUpdateRef = React.useRef(true);
  const updateInfo = useDebouncedCallback(
    () => {
      if (!containerRef.current) return;
      if (!parentRef.current) return;
      observeLiveRegion(parentRef.current, {
        firstTime: firstTimeUpdateRef.current,
      });
      updateMetaList();
      firstTimeUpdateRef.current = false;
    },
    200,
    [settings, observeLiveRegion],
  );

  const updateSize = useDebouncedCallback(
    () => {
      if (!containerRef.current) return;
      const display = containerRef.current.style.display;
      containerRef.current.style.display = "none";

      const { width, height } = getRootSize(parentRef.current);
      setWidth(width);
      setHeight(height);

      containerRef.current.style.display = display;

      const w = parentRef.current?.ownerDocument.defaultView;
      viewportWidthRef.current = w?.innerWidth ?? viewportWidthRef.current;
      viewportHeightRef.current = w?.innerHeight ?? viewportHeightRef.current;
    },
    200,
    [parentRef, updateInfo, containerRef],
  );

  const updateScroll = useDebouncedCallback(
    () => {
      const w = parentRef.current?.ownerDocument.defaultView;
      viewportScrollXRef.current = w?.scrollX ?? viewportScrollXRef.current;
      viewportScrollYRef.current = w?.scrollY ?? viewportScrollYRef.current;
    },
    200,
    [parentRef, updateInfo],
  );

  const updateAll = useDebouncedCallback(
    () => {
      updateSize();
      updateScroll();
      updateInfo();
    },
    200,
    [parentRef, updateInfo, updateSize, updateScroll],
  );

  React.useEffect(() => {
    updateAll();
    const observer = new MutationObserver(updateAll);
    const childrenObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          observer.observe(node, {
            childList: true,
            subtree: true,
            attributes: true,
          });
        });
      });
    });

    if (parentRef.current) {
      childrenObserver.observe(parentRef.current, {
        childList: true,
        subtree: false,
        attributes: false,
        characterData: false,
      });
      [...parentRef.current.children].forEach((el) => {
        if (el.contains(containerRef.current)) return;
        observer.observe(el, {
          childList: true,
          subtree: true,
          attributes: true,
        });
      });
      // Shadow DOM 内に後から追加されるライブリージョンを検出できるよう、
      // 通常のDOMツリーを越えないMutationObserverの代わりにShadow Rootも監視する
      const extensionRoot = containerRef.current;
      collectShadowRoots(parentRef.current).forEach((shadowRoot) => {
        // 拡張機能自身が描画したShadow DOMは監視しない（無限ループ防止）
        if (
          extensionRoot &&
          (shadowRoot.contains(extensionRoot) ||
            extensionRoot.contains(shadowRoot.host))
        ) {
          return;
        }
        observer.observe(shadowRoot, {
          childList: true,
          subtree: true,
          attributes: true,
        });
      });
    }
    return () => {
      childrenObserver.disconnect();
      observer.disconnect();
    };
  }, [parentRef, updateAll]);

  React.useEffect(() => {
    const onScroll = () => {
      updateScroll();
      updateInfo();
    };
    const onResize = () => {
      updateSize();
      updateInfo();
    };

    const w = parentRef.current?.ownerDocument?.defaultView;
    if (!w) return;

    const resizeEvents = ["resize"];
    const scrollEvents = ["scroll"];
    // mousemoveは含めない。ポインタが同じ要素の上で動くだけでもページ全体の
    // 再収集が走ってしまうため。:hoverで表示されるメニューなどDOMの変化を
    // 伴わないCSSだけの変化はMutationObserverでは検知できないので、要素の
    // 境界をまたいだときだけ発火するmouseover/mouseoutで再収集する
    const events = [
      "scroll",
      "keydown",
      "mousedown",
      "mouseover",
      "mouseout",
      "mousewheel",
      "change",
    ];

    resizeEvents.forEach((event) => {
      w.addEventListener(event, onResize);
    });
    scrollEvents.forEach((event) => {
      w.addEventListener(event, onScroll);
    });
    events.forEach((event) => {
      w.addEventListener(event, updateInfo);
    });

    return () => {
      resizeEvents.forEach((event) => {
        w.removeEventListener(event, onResize);
      });
      scrollEvents.forEach((event) => {
        w.removeEventListener(event, onScroll);
      });
      events.forEach((event) => {
        w.removeEventListener(event, updateInfo);
      });
    };
  }, [parentRef, updateInfo, updateSize, updateScroll]);

  // Determine what to show based on frame type
  const showSelfAnnouncements =
    frameType === "legacy-frame" && settings.showLiveRegions;
  const showSelfKeystrokes =
    frameType === "legacy-frame" && settings.showKeystrokes;

  return (
    <section
      aria-label={`Accessibility Visualizer <${parentRef.current?.tagName?.toLowerCase()}>`}
      data-frame-type={frameType}
      aria-hidden="true"
      style={{
        position: "static",
        margin: 0,
        padding: 0,
      }}
      ref={containerRef}
    >
      {metaList.length > 0 && (
        <ElementList list={metaList} width={width} height={height} />
      )}
      {topLayers.map(
        ({ element, metaList, width, height }, i) =>
          metaList.length > 0 &&
          createPortal(
            <ElementList list={metaList} width={width} height={height} />,
            element,
            `layer-${i}-${element.tagName.toLowerCase()}`,
          ),
      )}
      {showSelfAnnouncements && <Announcements announcements={announcements} />}
      {showSelfKeystrokes && (
        <Keystrokes
          keystrokes={keystrokes}
          opacityPercent={settings.keystrokeOpacityPercent}
          fontSize={settings.keystrokeFontSize}
        />
      )}
    </section>
  );
};
