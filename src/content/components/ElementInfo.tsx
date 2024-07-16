import React from "react";
import { ElementMeta } from "../types";
import { SettingsContext } from "./SettingsProvider";
import { RuleTip } from "./RuleTip";

const ELEMENT_SIZE_ENHANCEMENT = 4;
const TIP_SIDE_MARGIN = 8;

type VerticalPosition =
  | "inner-top"
  | "inner-bottom"
  | "outer-top"
  | "outer-bottom";
export const ElementInfo = ({
  meta: { x, y, absoluteX, absoluteY, width, height, ruleResults, category },
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

  const horizontalPosition =
    category === "page"
      ? "center"
      : ((category === "section" || category === "fieldset") &&
            width > tipFontSize * 16) ||
          (width < tipFontSize * 16 && x + width > rootWidth - tipFontSize * 16)
        ? "right"
        : "left";
  const verticalPosition: VerticalPosition =
    category === "page"
      ? "inner-top"
      : category === "section" || category === "heading" || category === "table"
        ? y < tipFontSize * 2.4
          ? "inner-top"
          : "outer-top"
        : category === "image" ||
            category === "fieldset" ||
            category === "tableCell"
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
        mx < absoluteX - ELEMENT_SIZE_ENHANCEMENT ||
        mx > absoluteX + width + ELEMENT_SIZE_ENHANCEMENT ||
        my < absoluteY - ELEMENT_SIZE_ENHANCEMENT ||
        my > absoluteY + height + ELEMENT_SIZE_ENHANCEMENT
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
  const tipMaxWidth =
    horizontalPosition === "center"
      ? width - 2 * TIP_SIDE_MARGIN
      : (horizontalPosition === "right" ? x + width : rootWidth - x) -
        TIP_SIDE_MARGIN;
  return (
    <div
      className={`ElementInfo${hovered ? " ElementInfo--hovered" : ""}`}
      style={{
        top: y,
        left: x,
        width: x + width > rootWidth ? rootWidth - x : width,
        height: y + height > rootHeight ? rootHeight - y : height,
      }}
      ref={selfRef}
    >
      {interactiveMode && (
        <div
          className="ElementInfo__overlay"
          style={{
            top: y > ELEMENT_SIZE_ENHANCEMENT ? -ELEMENT_SIZE_ENHANCEMENT : -y,
            left: x > ELEMENT_SIZE_ENHANCEMENT ? -ELEMENT_SIZE_ENHANCEMENT : -x,
            bottom:
              y + height + ELEMENT_SIZE_ENHANCEMENT < rootHeight
                ? -ELEMENT_SIZE_ENHANCEMENT
                : rootHeight - y - height,
            right:
              x + width + ELEMENT_SIZE_ENHANCEMENT < rootWidth
                ? -ELEMENT_SIZE_ENHANCEMENT
                : rootWidth - x - width,
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
        {ruleResults.length > 0 && (
          <div
            className={`ElementInfo__border ElementInfo__border--${category}`}
          />
        )}
        <div
          className={[
            "ElementInfo__tips",
            `ElementInfo__tips--${verticalPosition}`,
            `ElementInfo__tips--${horizontalPosition}`,
          ].join(" ")}
          style={{
            fontSize: tipFontSize,
            maxWidth: `max(160px, ${tipMaxWidth}px)`,
          }}
        >
          {ruleResults.map((result, i) => (
            <RuleTip
              maxWidth={tipMaxWidth}
              hideLabel={interactiveMode && hideTips ? !hovered : false}
              key={i}
              result={result}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
