import React from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import root from "react-shadow";
import { SettingsContext } from "../contexts/SettingsContext";
import type { AnnouncementItem } from "../types";
import Styles from "./Announcements.css?raw";

export const Announcements = ({
  announcements,
}: {
  announcements: AnnouncementItem[];
}) => {
  const { liveRegionOpacityPercent, liveRegionFontSize } =
    React.useContext(SettingsContext);
  const listRef = React.useRef<HTMLUListElement>(null);
  React.useEffect(() => {
    if (listRef.current) {
      announcements.length > 0
        ? listRef.current.showPopover()
        : listRef.current.hidePopover();
    }
  }, [announcements.length]);

  return (
    <root.div mode="closed">
      <style>{Styles}</style>
      <ul
        className="AnouncementsList"
        style={{
          fontSize: `${liveRegionFontSize}px`,
          opacity:
            announcements.length > 0 ? liveRegionOpacityPercent / 100 : 0,
        }}
        {...{ popover: "manual" }}
        ref={listRef}
      >
        {announcements.map((announcement) => (
          <li
            className="Announcement"
            key={`${announcement.timestamp}-${announcement.content}`}
          >
            {announcement.level === "assertive" && (
              <IoAlertCircleOutline className="AssertIcon" aria-hidden="true" />
            )}
            {announcement.content && (
              <p className="Content">{announcement.content}</p>
            )}
          </li>
        ))}
      </ul>
    </root.div>
  );
};
