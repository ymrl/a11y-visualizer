import React from "react";
import { getRuleResultIdentifier } from "../../../src/rules";
import { getTipPosition } from "../../../src/utils/getTipPosition";
import { SettingsContext } from "../contexts/SettingsContext";
import type { ElementMeta } from "../types";
import { RuleTip } from "./RuleTip";

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
  isHovered,
}: {
  meta: ElementMeta;
  rootWidth: number;
  rootHeight: number;
  isHovered: boolean;
}) => {
  const { interactiveMode, hideTips, tipFontSize, ...settings } =
    React.useContext(SettingsContext);
  const selfRef = React.useRef<HTMLDivElement>(null);

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
      className={`ElementInfo${isHovered ? " ElementInfo--hovered" : ""}`}
      style={{
        top: y,
        left: x,
        width: x + width > rootWidth ? rootWidth - x : width,
        height: y + height > rootHeight ? rootHeight - y : height,
      }}
      ref={selfRef}
    >
      <div
        className="ElementInfo__content"
        style={{
          opacity: interactiveMode
            ? isHovered
              ? settings.activeTipOpacityPercent / 100
              : settings.tipOpacityPercent / 100
            : settings.activeTipOpacityPercent / 100,
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
            interactiveMode && hideTips && !isHovered
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
                hideLabel={interactiveMode && hideTips ? !isHovered : false}
                key={getRuleResultIdentifier(result)}
                result={result}
              />
            ))}
          </div>
          {ruleResultAttribute && (
            <RuleTip
              maxWidth={tipMaxWidth}
              hideLabel={interactiveMode && hideTips ? !isHovered : false}
              result={ruleResultAttribute}
            />
          )}
        </div>
      </div>
    </div>
  );
};
