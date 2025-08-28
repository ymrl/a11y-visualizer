import React, { useCallback, useMemo } from "react";
import { SmallTargetInfo } from "../detector/targetDetector";
import { TargetEnlargerSettings } from "../settings/types";
import { constrainToViewport } from "../utils/viewportAdjustment";

interface OverlayButtonProps {
  targetInfo: SmallTargetInfo;
  settings: TargetEnlargerSettings;
  onTargetClick: (element: Element, event: React.MouseEvent) => void;
}

export const OverlayButton: React.FC<OverlayButtonProps> = ({
  targetInfo,
  settings,
  onTargetClick,
}) => {
  const { element, position } = targetInfo;

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      onTargetClick(element, event);
    },
    [element, onTargetClick],
  );

  // ビューポート内に収まるように位置とサイズを調整
  const constrainedPosition = useMemo(() => {
    return constrainToViewport(targetInfo);
  }, [targetInfo]);

  const style: React.CSSProperties = {
    position: "absolute",
    left: constrainedPosition.left,
    top: constrainedPosition.top,
    width: constrainedPosition.width,
    height: constrainedPosition.height,
    backgroundColor: settings.overlayColor,
    opacity: settings.overlayOpacity,
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    zIndex: 999999,
    pointerEvents: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    color: "white",
    textShadow: "0 0 2px rgba(0,0,0,0.8)",
    transition: "opacity 0.2s ease",
  };

  const hoverStyle: React.CSSProperties = {
    ...style,
    opacity: Math.min(settings.overlayOpacity + 0.2, 1),
  };

  return (
    <button
      style={style}
      onClick={handleClick}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hoverStyle);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, style);
      }}
      title={
        settings.showTooltips
          ? `Enlarged target (${position.width}×${position.height} → ${constrainedPosition.width}×${constrainedPosition.height})${constrainedPosition.isAdjusted ? " [Viewport adjusted]" : ""}`
          : undefined
      }
      data-target-enlarger-extension
      data-original-target={element.tagName.toLowerCase()}
      aria-label="Enlarged clickable area"
    >
      {settings.showTooltips && (
        <span style={{ fontSize: "8px", fontWeight: "bold" }}>
          {constrainedPosition.width}×{constrainedPosition.height}
          {constrainedPosition.isAdjusted && (
            <span style={{ fontSize: "6px", opacity: 0.8 }}>📍</span>
          )}
        </span>
      )}
    </button>
  );
};
