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
    return (
      <root.div mode="closed">
        <style>{Styles}</style>
        <ul
          className="KeystrokesList"
          style={{
            opacity: opacityPercent / 100,
            fontSize: `${fontSize}px`,
          }}
        >
          {keystrokes.map((item) => (
            <li className="Keystroke" key={item.id}>
              <kbd>{item.keys}</kbd>
            </li>
          ))}
        </ul>
      </root.div>
    );
  },
);
