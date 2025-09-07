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

describe("getTipPosition - category: page", () => {
  it("horizontal is center", () => {
    const { horizontalPosition } = getTipPosition({
      category: "page",
      scrollOffsetX: 0,
      scrollOffsetY: 0,
      ...baseArgs,
    });
    expect(horizontalPosition).toBe("center");
  });

  it("vertical is inner-top", () => {
    const { verticalPosition } = getTipPosition({
      category: "page",
      scrollOffsetX: 0,
      scrollOffsetY: 0,
      ...baseArgs,
    });
    expect(verticalPosition).toBe("inner-top");
  });

  it("vertical stays inner-top even if element is small", () => {
    const { verticalPosition } = getTipPosition({
      category: "page",
      scrollOffsetX: 0,
      scrollOffsetY: 200,
      ...baseArgs,
      height: 12,
    });
    expect(verticalPosition).toBe("inner-top");
  });
});

describe("getTipPosition - category: section", () => {
  it("horizontal is right (fixed)", () => {
    const { horizontalPosition } = getTipPosition({
      category: "section",
      scrollOffsetX: 20,
      scrollOffsetY: 0,
      ...baseArgs,
    });
    expect(horizontalPosition).toBe("right");
  });

  it("vertical prefers inner-top when enough top space", () => {
    const { verticalPosition } = getTipPosition({
      category: "section",
      scrollOffsetY: 300, // plenty of space above
      scrollOffsetX: 0,
      ...baseArgs,
      ruleResults: [
        { type: "name", ruleName: "r", content: "x" },
        { type: "role", ruleName: "r", content: "x" },
      ],
    });
    expect(verticalPosition).toBe("inner-top");
  });

  it("vertical near top falls back to inner-bottom", () => {
    const { verticalPosition } = getTipPosition({
      category: "section",
      scrollOffsetY: 5, // little top space
      scrollOffsetX: 0,
      ...baseArgs,
      ruleResults: [
        { type: "name", ruleName: "r", content: "x" },
        { type: "role", ruleName: "r", content: "x" },
      ] as unknown as RuleResult[],
    });
    expect(verticalPosition).toBe("inner-bottom");
  });

  it("vertical prefers outer-top when element is too short for inner", () => {
    const { verticalPosition } = getTipPosition({
      category: "section",
      scrollOffsetY: 300, // top space available
      scrollOffsetX: 0,
      ...baseArgs,
      height: 12, // too small for inner
      ruleResults: [
        { type: "name", ruleName: "r", content: "x" },
      ] as unknown as RuleResult[],
    });
    expect(verticalPosition).toBe("outer-top");
  });
});

describe("getTipPosition - category: image", () => {
  it("horizontal is left (fixed)", () => {
    const { horizontalPosition } = getTipPosition({
      category: "image",
      scrollOffsetX: 900, // left space >> right spaceでもleft固定
      scrollOffsetY: 0,
      ...baseArgs,
    });
    expect(horizontalPosition).toBe("left");
  });

  it("vertical prefers inner-top when possible", () => {
    const { verticalPosition } = getTipPosition({
      category: "image",
      scrollOffsetY: 650, // near bottom, top space is large
      scrollOffsetX: 0,
      ...baseArgs,
    });
    expect(verticalPosition).toBe("inner-top");
  });

  it("vertical becomes outer-top when element is too short for inner", () => {
    const { verticalPosition } = getTipPosition({
      category: "image",
      scrollOffsetY: 650, // top space is large here
      scrollOffsetX: 0,
      ...baseArgs,
      height: 12, // too small for inner
    });
    expect(verticalPosition).toBe("outer-top");
  });
});

describe("getTipPosition - category: heading", () => {
  it("horizontal is always left (near left edge)", () => {
    const { horizontalPosition } = getTipPosition({
      category: "heading",
      scrollOffsetX: 20, // right space >> left space
      scrollOffsetY: 0,
      ...baseArgs,
    });
    expect(horizontalPosition).toBe("left");
  });

  it("horizontal is always left (near right edge)", () => {
    const { horizontalPosition } = getTipPosition({
      category: "heading",
      scrollOffsetX: 900, // left space >> right space
      scrollOffsetY: 0,
      ...baseArgs,
    });
    expect(horizontalPosition).toBe("left");
  });
});

describe("getTipPosition - category: control", () => {
  it("horizontal chooses by space: left when right space is larger", () => {
    const { horizontalPosition } = getTipPosition({
      category: "control",
      scrollOffsetX: 20, // right space >> left space
      scrollOffsetY: 0,
      ...baseArgs,
    });
    expect(horizontalPosition).toBe("left");
  });

  it("horizontal chooses by space: right when left space is larger", () => {
    const { horizontalPosition } = getTipPosition({
      category: "control",
      scrollOffsetX: 900, // left space >> right space
      scrollOffsetY: 0,
      ...baseArgs,
    });
    expect(horizontalPosition).toBe("right");
  });

  it("vertical prefers outer-bottom when bottom has space", () => {
    const { verticalPosition } = getTipPosition({
      category: "control",
      scrollOffsetY: 100, // plenty of bottom space
      scrollOffsetX: 0,
      ...baseArgs,
      ruleResults: [
        { type: "name", ruleName: "r", content: "x" },
      ] as unknown as RuleResult[],
    });
    expect(verticalPosition).toBe("outer-bottom");
  });

  it("vertical falls back to outer-top when top has space and bottom lacks", () => {
    const { verticalPosition } = getTipPosition({
      category: "control",
      scrollOffsetY: 770, // near bottom, bottom space is insufficient for outer placement
      scrollOffsetX: 0,
      ...baseArgs,
      ruleResults: [
        { type: "name", ruleName: "r", content: "x" },
      ] as unknown as RuleResult[],
    });
    expect(verticalPosition).toBe("outer-top");
  });
});
