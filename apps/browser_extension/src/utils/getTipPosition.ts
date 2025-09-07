import type { Category } from "../../entrypoints/content/types";
import type { RuleResult } from "../rules";

export type HorizontalPosition = "left" | "right" | "center";
export type VerticalPosition =
  | "inner-top"
  | "inner-bottom"
  | "outer-top"
  | "outer-bottom";

type PositionArgs = {
  category: Category;
  x: number;
  y: number;
  width: number;
  height: number;
  scrollOffsetX: number;
  scrollOffsetY: number;
  rootWidth: number;
  rootHeight: number;
  tipFontSize: number;
  ruleResults: RuleResult[];
};

function estimateTipHeight(tipFontSize: number, ruleResults: RuleResult[]) {
  const normalTipCount = ruleResults.filter(
    (r) => r.type !== "ariaAttributes",
  ).length;
  const hasAriaAttributes = ruleResults.some(
    (r) => r.type === "ariaAttributes",
  );
  const estimatedTipLines = normalTipCount + (hasAriaAttributes ? 3 : 0);
  return Math.max(tipFontSize * 1.6, tipFontSize * 1.2 * estimatedTipLines);
}

function getHorizontalPosition({
  category,
  scrollOffsetX,
  width,
  rootWidth,
}: PositionArgs): HorizontalPosition {
  if (category === "page") return "center" as const;
  const left = scrollOffsetX;
  const right = rootWidth - (scrollOffsetX + width);
  // Prefer the side that gives more room for a left-aligned tips block (grows right)
  if (right >= left) return "left" as const;
  return "right" as const;
}

function getVerticalPosition(args: PositionArgs): VerticalPosition {
  const {
    category,
    height,
    scrollOffsetY,
    rootHeight,
    tipFontSize,
    ruleResults,
  } = args;

  if (category === "page") return "inner-top";

  const availTop = scrollOffsetY;
  const availBottom = rootHeight - (scrollOffsetY + height);

  const prefersTop = ["section", "heading", "table", "list"].includes(category);
  const prefersInner = ["image", "group", "tableCell"].includes(category);

  const estimatedHeight = estimateTipHeight(tipFontSize, ruleResults);
  const margin = tipFontSize * 0.8;
  const canOuterTop = availTop >= estimatedHeight + margin;
  const canOuterBottom = availBottom >= estimatedHeight + margin;

  if (prefersTop) {
    if (canOuterTop) return "outer-top";
    if (canOuterBottom) return "outer-bottom";
    return availTop >= availBottom ? "inner-top" : "inner-bottom";
  }

  if (prefersInner) {
    if (availTop >= availBottom) {
      return availTop > tipFontSize * 1.6
        ? "inner-top"
        : canOuterBottom
          ? "outer-bottom"
          : "inner-bottom";
    }
    return availBottom > tipFontSize * 1.6
      ? "inner-bottom"
      : canOuterTop
        ? "outer-top"
        : "inner-top";
  }

  if (canOuterBottom) return "outer-bottom";
  if (canOuterTop) return "outer-top";
  return availBottom >= availTop ? "inner-bottom" : "inner-top";
}

export function getTipPosition(args: PositionArgs): {
  horizontalPosition: HorizontalPosition;
  verticalPosition: VerticalPosition;
} {
  return {
    horizontalPosition: getHorizontalPosition(args),
    verticalPosition: getVerticalPosition(args),
  };
}
