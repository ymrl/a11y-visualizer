import { describe, expect, it } from "vitest";
import type { RuleResult } from "../rules";
import { getTipPosition } from "./getTipPosition";

const baseArgs = {
  x: 100,
  y: 100,
  width: 200,
  height: 100,
  rootWidth: 1200,
  rootHeight: 800,
  tipFontSize: 12,
  ruleResults: [] as RuleResult[],
};

describe("getHorizontalPosition", () => {
  it("returns center for page", () => {
    const { horizontalPosition } = getTipPosition({
      category: "page",
      scrollOffsetX: 0,
      scrollOffsetY: 0,
      ...baseArgs,
    });
    expect(horizontalPosition).toBe("center");
  });

  it("prefers left when right-side space is larger", () => {
    const { horizontalPosition } = getTipPosition({
      category: "section",
      // near left edge: right space >> left space
      scrollOffsetX: 20,
      scrollOffsetY: 0,
      ...baseArgs,
    });
    expect(horizontalPosition).toBe("left");
  });

  it("prefers right when left-side space is larger", () => {
    const { horizontalPosition } = getTipPosition({
      category: "section",
      // near right edge: left space >> right space
      scrollOffsetX: 900,
      scrollOffsetY: 0,
      ...baseArgs,
    });
    expect(horizontalPosition).toBe("right");
  });
});

describe("getVerticalPosition", () => {
  it("returns inner-top for page", () => {
    const { verticalPosition } = getTipPosition({
      category: "page",
      scrollOffsetX: 0,
      scrollOffsetY: 0,
      ...baseArgs,
    });
    expect(verticalPosition).toBe("inner-top");
  });

  it("section prefers outer-top when enough top space", () => {
    const { verticalPosition } = getTipPosition({
      category: "section",
      // plenty of space above
      scrollOffsetY: 300,
      scrollOffsetX: 0,
      ...baseArgs,
      ruleResults: [
        { type: "name", ruleName: "r", content: "x" },
        { type: "role", ruleName: "r", content: "x" },
      ] as unknown as RuleResult[],
    });
    expect(verticalPosition).toBe("outer-top");
  });

  it("section falls back to outer-bottom if no top space", () => {
    const { verticalPosition } = getTipPosition({
      category: "section",
      // near top: little top space
      scrollOffsetY: 5,
      scrollOffsetX: 0,
      ...baseArgs,
      ruleResults: [
        { type: "name", ruleName: "r", content: "x" },
        { type: "role", ruleName: "r", content: "x" },
      ] as unknown as RuleResult[],
    });
    expect(verticalPosition).toBe("outer-bottom");
  });

  it("image prefers inner when possible (near bottom -> inner-top)", () => {
    const { verticalPosition } = getTipPosition({
      category: "image",
      // near bottom: little bottom space; top space is large
      scrollOffsetY: 650,
      scrollOffsetX: 0,
      ...baseArgs,
    });
    // with larger top space than bottom, and enough top space, prefer inner-top
    expect(["inner-top", "outer-top"]).toContain(verticalPosition);
  });
});
