import React from "react";
import { ElementMeta } from "../types";
import { SettingsContext } from "./SettingsProvider";
import { Tip } from "./Tip";

type VerticalPosition =
  | "inner-top"
  | "inner-bottom"
  | "outer-top"
  | "outer-bottom";
export const ElementInfo = ({
  meta: { x, y, absoluteX, absoluteY, width, height, tips, category },
  rootWidth,
  rootHeight,
}: {
  meta: ElementMeta;
  rootWidth: number;
  rootHeight: number;
}) => {
  const { interactiveMode, hideTips, tipFontSize, ...settings } =
    React.useContext(SettingsContext);
  const [hovered, setHovered] = React.useState(false);
  const selfRef = React.useRef<HTMLDivElement>(null);
  const listenerRef = React.useRef<((e: MouseEvent) => void) | null>(null);

  React.useEffect(() => {
    const w = selfRef.current?.ownerDocument?.defaultView;
    return () => {
      if (listenerRef.current && w) {
        setHovered(false);
        w.removeEventListener("mousemove", listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, []);

  const rightAligned: boolean =
    ((category === "section" || category === "fieldset") &&
      width > tipFontSize * 16) ||
    (width < tipFontSize * 16 && x + width > rootWidth - tipFontSize * 16);
  const verticalPosition: VerticalPosition =
    category === "section" || category === "heading"
      ? y < tipFontSize * 2.4
        ? "inner-top"
        : "outer-top"
      : category === "image" || category === "fieldset"
        ? y > tipFontSize * 2.4 && height < tipFontSize * 3.2
          ? "outer-top"
          : "inner-top"
        : y + height > rootHeight - tipFontSize * 2.4
          ? "inner-bottom"
          : "outer-bottom";

  const disappear = () => {
    setHovered(false);
    if (!selfRef.current) return;
    const d = selfRef.current.ownerDocument;
    const w = d.defaultView;
    if (listenerRef.current)
      w?.removeEventListener("mousemove", listenerRef.current);
    listenerRef.current = null;
  };
  const appear = () => {
    if (!selfRef.current || listenerRef.current) return;
    const d = selfRef.current.ownerDocument;
    const w = d.defaultView;
    setHovered(true);
    const listener = (ew: MouseEvent) => {
      const mx = ew.pageX;
      const my = ew.pageY;
      if (
        mx < absoluteX - 4 ||
        mx > absoluteX + width + 4 ||
        my < absoluteY - 4 ||
        my > absoluteY + height + 4
      ) {
        disappear();
      }
    };
    w?.addEventListener("mousemove", listener);
    listenerRef.current = listener;
  };

  const handleHovered = () => {
    if (!interactiveMode || hovered) {
      return;
    }
    appear();
  };
  return (
    <div
      className={`ElementInfo${hovered ? " ElementInfo--hovered" : ""}`}
      style={{
        top: y,
        left: x,
        width,
        height,
      }}
      ref={selfRef}
    >
      {interactiveMode && (
        <div
          className="ElementInfo__overlay"
          style={{
            pointerEvents: hovered ? "none" : "auto",
          }}
          onMouseEnter={handleHovered}
          onMouseMove={handleHovered}
        />
      )}
      <div
        className="ElementInfo__content"
        style={{
          opacity:
            interactiveMode && hovered ? 1 : settings.tipOpacityPercent / 100,
        }}
      >
        {tips.length > 0 && (
          <div
            className={`ElementInfo__border ElementInfo__border--${category}`}
          />
        )}
        <div
          className={[
            "ElementInfo__tips",
            `ElementInfo__tips--${verticalPosition}`,
            rightAligned
              ? "ElementInfo__tips--right-aligned"
              : "ElementInfo__tips--left-aligned",
          ].join(" ")}
          style={{ fontSize: tipFontSize }}
        >
          {tips.map((tip, i) => (
            <Tip
              hideLabel={interactiveMode && hideTips ? !hovered : false}
              key={i}
              tip={tip}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
