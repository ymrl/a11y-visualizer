import React from "react";
import { SettingsContext } from "./SettingsProvider";
const AnnouncementsRenderer = (
  { contents }: { contents: string[] },
  ref: React.Ref<HTMLDivElement>,
) => {
  const { showLiveRegions, liveRegionOpacityPercent, liveRegionFontSize } =
    React.useContext(SettingsContext);
  return (
    showLiveRegions && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          margin: "auto",
          zIndex: 2147483647,
          pointerEvents: "none",
          background: "#000",
          color: "#fff",
          fontSize: `${liveRegionFontSize}px`,
          lineHeight: "1.5",
          fontFamily: "sans-serif",
          fontWeight: "normal",
          padding: "0.5em",
          opacity: contents.length > 0 ? liveRegionOpacityPercent / 100 : 0,
          width: "fit-content",
          maxWidth: "90vw",
          height: "fit-content",
          maxHeight: "90vh",
          overflow: "auto",
        }}
        ref={ref}
      >
        {contents.map((content, i) => (
          <p style={{ margin: 0 }} key={i}>
            {content}
          </p>
        ))}
      </div>
    )
  );
};
export const Announcements = React.forwardRef(AnnouncementsRenderer);
