import React from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import root from "react-shadow";
import { SettingsContext } from "../contexts/SettingsContext";
import type { AnnouncementItem } from "../hooks/useLiveRegion";
import Styles from "./Announcements.css?raw";

export const Announcements = ({
  announcements,
}: {
  announcements: AnnouncementItem[];
}) => {
  const { liveRegionOpacityPercent, liveRegionFontSize } =
    React.useContext(SettingsContext);
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
