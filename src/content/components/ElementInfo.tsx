import React from "react";
import { Category, ElementTip } from "../types";
import { SettingsContext } from "./SettingsProvider";
import { Tip } from "./Tip";

const colors = (category: Category): { border: string } => {
  switch (category) {
    case "image":
      return {
        border: "2px dashed rgb(3,175,122)",
      };
    case "formControl":
      return {
        border: "2px dashed rgb(255,128,130)",
      };
    case "button":
      return {
        border: "2px dashed rgb(77,196,255)",
      };
    case "link":
      return {
        border: "2px dashed rgb(153,0,153)",
      };
    case "heading":
      return {
        border: "2px dashed rgb(0,90,255)",
      };
    case "ariaHidden":
      return {
        border: "2px dashed rgb(255,75,0)",
      };
    default:
      return {
        border: "2px dashed rgb(132,145,158)",
      };
  }
};

export const ElementInfo = ({
  x,
  y,
  absoluteX,
  absoluteY,
  width,
  height,
  tips,
  categories,
  rootWidth,
  rootHeight,
}: {
  x: number;
  y: number;
  absoluteX: number;
  absoluteY: number;
  width: number;
  height: number;
  tips: ElementTip[];
  categories: Category[];
  rootWidth: number;
  rootHeight: number;
}) => {
  const { interactiveMode, ...settings } = React.useContext(SettingsContext);
  const [hovered, setHovered] = React.useState(false);
  const selfRef = React.useRef<HTMLDivElement>(null);
  const listenerRef = React.useRef<((e: MouseEvent) => void) | null>(null);
  React.useEffect(() => {
    const w = selfRef.current?.ownerDocument?.defaultView;
    return () => {
      if (listenerRef.current && w) {
        w.removeEventListener("mousemove", listenerRef.current);
      }
    };
  }, []);

  if (!categories.some((category) => settings[category])) {
    return;
  }
  const rightAligned = width < 160 && x + width > rootWidth - 160;
  const verticalPosition = categories.includes("heading")
    ? y < 24
      ? "inner-top"
      : "outer-top"
    : categories.includes("image")
      ? "inner-top"
      : y + height > rootHeight - 24
        ? "inner-bottom"
        : "outer-bottom";

  const handleHovered = () => {
    if ((!interactiveMode && hovered) || listenerRef.current) {
      return;
    }
    setHovered(true);
    if (!selfRef.current) {
      return;
    }
    const d = selfRef.current.ownerDocument;
    const w = d.defaultView;
    const listener = (ew: MouseEvent) => {
      const mx = ew.pageX;
      const my = ew.pageY;
      if (
        mx < absoluteX ||
        mx > absoluteX + width ||
        my < absoluteY ||
        my > absoluteY + height
      ) {
        setHovered(false);
        listenerRef.current = null;
      }
    };
    if (w) {
      w.addEventListener("mousemove", listener);
      listenerRef.current = listener;
    }
  };
  return (
    <div
      className="ElementInfo"
      style={{
        top: y,
        left: x,
        width,
        height,
        opacity:
          interactiveMode && hovered ? 1 : settings.tipOpacityPercent / 100,
      }}
      ref={selfRef}
    >
      {interactiveMode && (
        <div
          className="ElementInfo__overlay"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: hovered ? "none" : "auto",
          }}
          onMouseEnter={handleHovered}
          onMouseMove={handleHovered}
        />
      )}
      {tips.length > 0 &&
        categories
          .filter((category) => settings[category])
          .map((category, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                ...colors(category),
                boxShadow: "0 0 0 1px #fff, inset 0 0 0 1px #fff",
              }}
            />
          ))}
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          left: rightAligned ? undefined : 0,
          right: rightAligned ? 0 : undefined,
          top:
            verticalPosition === "inner-top"
              ? 0
              : verticalPosition === "outer-bottom"
                ? "100%"
                : undefined,
          bottom:
            verticalPosition === "inner-bottom"
              ? 0
              : verticalPosition === "outer-top"
                ? "100%"
                : undefined,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: rightAligned ? "flex-end" : "flex-start",
          flexDirection: "row",
          maxWidth: "max(160px, 100%)",
          width: "max-content",
          flexWrap: "wrap",
        }}
      >
        {tips.map((tip, i) => (
          <Tip key={i} tip={tip} />
        ))}
      </div>
    </div>
  );
};
