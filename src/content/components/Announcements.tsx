import React from "react";
import { SettingsContext } from "./SettingsProvider";
const AnnouncementsRenderer = (
  { contents }: { contents: string[] },
  ref: React.Ref<HTMLDivElement>,
) => {
  const { showLiveRegions } = React.useContext(SettingsContext);
  return (
    showLiveRegions && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          margin: "auto",
          zIndex: 2147483647,
          pointerEvents: "none",
          background: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          fontSize: "48px",
          padding: "24px",
          opacity: contents.length > 0 ? 1 : 0,
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
