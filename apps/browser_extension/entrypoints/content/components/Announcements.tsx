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
  const {
    liveRegionOpacityPercent,
    liveRegionTextOpacityPercent,
    liveRegionFontSize,
  } = React.useContext(SettingsContext);
  const listRef = React.useRef<HTMLUListElement>(null);
  React.useEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }
    if (announcements.length > 0) {
      if (!list.matches(":popover-open")) {
        list.showPopover();
      }
    } else if (list.matches(":popover-open")) {
      list.hidePopover();
    }
  }, [announcements.length]);

  return (
    <root.div mode="closed">
      <style>{Styles}</style>
      <ul
        className="AnouncementsList"
        style={{
          fontSize: `${liveRegionFontSize}px`,
          backgroundColor: `rgba(0, 0, 0, ${liveRegionOpacityPercent / 100})`,
          color: `rgba(255, 255, 255, ${liveRegionTextOpacityPercent / 100})`,
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
