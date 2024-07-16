import { describe, expect, test } from "vitest";
import { isSection } from "./sectionTips";

describe("isSection()", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isSection(element)).toBe(false);
  });
  test("section", () => {
    const element = document.createElement("section");
    expect(isSection(element)).toBe(true);
  });
  test("role=region", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "region");
    expect(isSection(element)).toBe(true);
  });
});
