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

function pickFirstFeasible(
  candidates: VerticalPosition[],
  args: {
    innerOk: boolean;
    canOuterTop: boolean;
    canOuterBottom: boolean;
    availTop: number;
    availBottom: number;
  },
): VerticalPosition {
  const { innerOk, canOuterTop, canOuterBottom, availTop, availBottom } = args;
  for (const c of candidates) {
    if ((c === "inner-top" || c === "inner-bottom") && innerOk) return c;
    if (c === "outer-top" && canOuterTop) return c;
    if (c === "outer-bottom" && canOuterBottom) return c;
  }
  return availTop >= availBottom ? "inner-top" : "inner-bottom";
}

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
  if (category === "heading") return "left" as const;
  if (category === "section") return "right" as const;
  if (category === "group") return "right" as const;
  if (category === "image") return "left" as const;
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

  const availTop = scrollOffsetY;
  const availBottom = rootHeight - (scrollOffsetY + height);

  const topPreferred = new Set<Category>([
    "image",
    "section",
    "heading",
    "table",
    "list",
    "group",
  ]);
  const bottomPreferred = new Set<Category>(["control"]);
  const outerPreferred = new Set<Category>(["heading", "control"]);

  const estimatedHeight = estimateTipHeight(tipFontSize, ruleResults);
  const margin = tipFontSize * 0.8;
  const minInnerHeight = estimatedHeight + margin;
  const canOuterTop = availTop >= estimatedHeight + margin;
  const canOuterBottom = availBottom >= estimatedHeight + margin;

  // Page: always inner-top (outer is not applicable)
  if (category === "page") {
    return "inner-top";
  }

  // Build candidate order based on category preferences
  const innerOk = height >= minInnerHeight;

  const preferOuter = outerPreferred.has(category);
  const preferTop = topPreferred.has(category);
  const preferBottom = bottomPreferred.has(category);

  if (preferTop) {
    let candidates: VerticalPosition[] = preferOuter
      ? ["outer-top", "outer-bottom", "inner-top", "inner-bottom"]
      : ["inner-top", "outer-top", "inner-bottom", "outer-bottom"];
    const edge = tipFontSize * 1.6;
    if (!preferOuter && availTop < edge) {
      // if near the top edge, prefer bottom-side first for inner-first categories
      candidates = ["inner-bottom", "outer-bottom", "inner-top", "outer-top"];
    }
    return pickFirstFeasible(candidates, {
      innerOk,
      canOuterTop,
      canOuterBottom,
      availTop,
      availBottom,
    });
  }
  if (preferBottom) {
    let candidates: VerticalPosition[] = preferOuter
      ? ["outer-bottom", "outer-top", "inner-bottom", "inner-top"]
      : ["inner-bottom", "outer-bottom", "inner-top", "outer-top"];
    const edge = tipFontSize * 1.6;
    if (!preferOuter && availBottom < edge) {
      // if near the bottom edge, prefer top-side first for inner-first categories
      candidates = ["inner-top", "outer-top", "inner-bottom", "outer-bottom"];
    }
    return pickFirstFeasible(candidates, {
      innerOk,
      canOuterTop,
      canOuterBottom,
      availTop,
      availBottom,
    });
  }

  // Auto side based on available space
  const topFirst = availTop >= availBottom;
  const candidates: VerticalPosition[] = topFirst
    ? preferOuter
      ? ["outer-top", "outer-bottom", "inner-top", "inner-bottom"]
      : ["inner-top", "outer-top", "inner-bottom", "outer-bottom"]
    : preferOuter
      ? ["outer-bottom", "outer-top", "inner-bottom", "inner-top"]
      : ["inner-bottom", "outer-bottom", "inner-top", "outer-top"];
  return pickFirstFeasible(candidates, {
    innerOk,
    canOuterTop,
    canOuterBottom,
    availTop,
    availBottom,
  });
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
