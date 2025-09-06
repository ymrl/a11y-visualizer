import React from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { SettingsContext } from "../contexts/SettingsContext";
import type { AnnouncementItem } from "../hooks/useLiveRegion";

export const Announcements = ({
  announcements,
}: {
  announcements: AnnouncementItem[];
}) => {
  const { liveRegionOpacityPercent, liveRegionFontSize } =
    React.useContext(SettingsContext);
  const ref = React.useRef<HTMLUListElement>(null);
  const shown = React.useRef(false);
  React.useEffect(() => {
    if (announcements.length > 0 && !shown.current) {
      ref.current?.showPopover();
      shown.current = true;
    } else if (announcements.length === 0 && shown.current) {
      ref.current?.hidePopover();
      shown.current = false;
    }
  }, [announcements.length]);
  return (
    <>
      {
        <ul
          {...{ popover: "manual" }}
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
            opacity:
              announcements.length > 0 ? liveRegionOpacityPercent / 100 : 0,
            width: "fit-content",
            maxWidth: "90vw",
            height: "fit-content",
            maxHeight: "90vh",
            overflow: "auto",
            listStyle: "none",
          }}
          ref={ref}
        >
          {announcements.map((announcement) => (
            <li
              style={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "0.25em",
              }}
              key={`${announcement.timestamp}-${announcement.content}`}
            >
              {announcement.level === "assertive" && (
                <IoAlertCircleOutline
                  style={{
                    color: "rgb(255, 75, 0)",
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
              )}
              {announcement.content && <p>{announcement.content}</p>}
            </li>
          ))}
        </ul>
      }
    </>
  );
};
