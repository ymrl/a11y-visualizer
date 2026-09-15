import React from "react";
import root from "react-shadow";
import type { KeystrokeItem } from "../types";
import Styles from "./Keystrokes.css?raw";

export const Keystrokes = React.memo(
  ({
    keystrokes,
    opacityPercent,
    fontSize,
  }: {
    keystrokes: KeystrokeItem[];
    opacityPercent: number;
    fontSize: number;
  }) => {
    const listRef = React.useRef<HTMLUListElement>(null);
    React.useEffect(() => {
      const list = listRef.current;
      if (!list) {
        return;
      }
      if (keystrokes.length > 0) {
        if (!list.matches(":popover-open")) {
          list.showPopover();
        }
      } else if (list.matches(":popover-open")) {
        list.hidePopover();
      }
    }, [keystrokes.length]);

    return (
      <root.div mode="closed">
        <style>{Styles}</style>
        <ul
          className="KeystrokesList"
          style={{
            opacity: opacityPercent / 100,
            fontSize: `${fontSize}px`,
          }}
          {...{ popover: "manual" }}
          ref={listRef}
        >
          {keystrokes.map((item) => (
            <li className="Keystroke" key={`${item.timestamp}-${item.keys}`}>
              <kbd>{item.keys}</kbd>
            </li>
          ))}
        </ul>
      </root.div>
    );
  },
);
