import React from "react";
import { ElementMeta } from "../types";
import { SettingsContext } from "../contexts/SettingsContext";
import { RuleTip } from "./RuleTip";

const ELEMENT_SIZE_ENHANCEMENT = 4;
const TIP_SIDE_MARGIN = 8;

type VerticalPosition =
  | "inner-top"
  | "inner-bottom"
  | "outer-top"
  | "outer-bottom";
export const ElementInfo = ({
  meta: {
    x,
    y,
    absoluteX,
    absoluteY,
    width,
    height,
    ruleResults,
    category,
    rects,
  },
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

  const scrollX = selfRef.current?.ownerDocument?.defaultView?.scrollX || 0;
  const scrollY = selfRef.current?.ownerDocument?.defaultView?.scrollY || 0;
  const scrollOffsetX = absoluteX - scrollX;
  const scrollOffsetY = absoluteY - scrollY;

  const horizontalPosition =
    category === "page"
      ? "center"
      : ((category === "section" || category === "group") &&
            width > tipFontSize * 16) ||
          (width < tipFontSize * 16 &&
            scrollOffsetX + width > rootWidth - tipFontSize * 16)
        ? "right"
        : "left";
  const verticalPosition: VerticalPosition =
    category === "page"
      ? "inner-top"
      : ["section", "heading", "table", "list"].includes(category)
        ? scrollOffsetY < tipFontSize * 2.4
          ? "inner-top"
          : "outer-top"
        : category === "image" ||
            category === "group" ||
            category === "tableCell"
          ? scrollOffsetY > tipFontSize * 2.4 && height < tipFontSize * 3.2
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
  const ruleResultsWithoutAttributes = ruleResults.filter(
    (r) => r.type !== "ariaAttributes",
  );
  const ruleResultAttribute = ruleResults.find(
    (r) => r.type === "ariaAttributes",
  );
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
        {ruleResults.length > 0 &&
          (rects.length > 0 ? (
            rects.map((rect, i) => (
              <div
                key={i}
                className={`ElementInfo__border ElementInfo__border--${category}`}
                style={{
                  top: rect.relativeY,
                  left: rect.relativeX,
                  bottom: "auto",
                  right: "auto",
                  width: rect.width,
                  height: rect.height,
                }}
              />
            ))
          ) : (
            <div
              className={`ElementInfo__border ElementInfo__border--${category}`}
            />
          ))}
        <div
          className={[
            "ElementInfo__tips",
            `ElementInfo__tips--${verticalPosition}`,
            `ElementInfo__tips--${horizontalPosition}`,
            interactiveMode && hideTips && !hovered
              ? "ElementInfo__tips--hideLabel"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            fontSize: tipFontSize,
            maxWidth: `max(160px, ${tipMaxWidth}px)`,
          }}
        >
          <div className="ElementInfo__normalTips">
            {ruleResultsWithoutAttributes.map((result, i) => (
              <RuleTip
                maxWidth={tipMaxWidth}
                hideLabel={interactiveMode && hideTips ? !hovered : false}
                key={i}
                result={result}
              />
            ))}
          </div>
          {ruleResultAttribute && (
            <div className="ElementInfo__attributeTip">
              <RuleTip
                maxWidth={tipMaxWidth}
                hideLabel={interactiveMode && hideTips ? !hovered : false}
                result={ruleResultAttribute}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
