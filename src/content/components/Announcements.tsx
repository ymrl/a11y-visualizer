import React from "react";
import { SettingsContext } from "./SettingsProvider";

export const Announcements = ({ contents }: { contents: string[] }) => {
  const { liveRegionOpacityPercent, liveRegionFontSize } =
    React.useContext(SettingsContext);
  const ref = React.useRef<HTMLDivElement>(null);
  const shown = React.useRef(false);
  React.useEffect(() => {
    if (contents.length > 0 && !shown.current) {
      ref.current?.showPopover();
      shown.current = true;
    } else if (contents.length === 0 && shown.current) {
      ref.current?.hidePopover();
      shown.current = false;
    }
  }, [contents.length]);
  return (
    <>
      {
        <div
          popover="manual"
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
      }
    </>
  );
};
