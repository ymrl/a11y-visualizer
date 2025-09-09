import React from "react";
import { getRuleResultIdentifier } from "../../../src/rules";
import { getTipPosition } from "../../../src/utils/getTipPosition";
import { SettingsContext } from "../contexts/SettingsContext";
import type { ElementMeta } from "../types";
import { RuleTip } from "./RuleTip";

const ELEMENT_SIZE_ENHANCEMENT = 4;
const TIP_SIDE_MARGIN = 8;
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

  // Positions are decided by reusable utilities for readability and testability

  const { horizontalPosition, verticalPosition } = getTipPosition({
    category,
    x,
    y,
    width,
    height,
    scrollOffsetX,
    scrollOffsetY,
    rootWidth,
    rootHeight,
    tipFontSize,
    ruleResults,
  });

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
      ? Math.max(160, width - 2 * TIP_SIDE_MARGIN)
      : Math.max(
          160,
          (horizontalPosition === "right" ? x + width : rootWidth - x) -
            TIP_SIDE_MARGIN,
        );
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
        // biome-ignore lint/a11y/noStaticElementInteractions: for observing hover
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
            rects.map((rect) => (
              <div
                key={`${category}-${rect.relativeX},${rect.relativeY},${rect.width},${rect.height}`}
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
            {ruleResultsWithoutAttributes.map((result) => (
              <RuleTip
                maxWidth={tipMaxWidth}
                hideLabel={interactiveMode && hideTips ? !hovered : false}
                key={getRuleResultIdentifier(result)}
                result={result}
              />
            ))}
          </div>
          {ruleResultAttribute && (
            <RuleTip
              maxWidth={tipMaxWidth}
              hideLabel={interactiveMode && hideTips ? !hovered : false}
              result={ruleResultAttribute}
            />
          )}
        </div>
      </div>
    </div>
  );
};
