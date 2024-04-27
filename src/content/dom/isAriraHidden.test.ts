import { describe, test, expect } from "vitest";
import { isAriaHidden } from "./isAriaHidden";

describe("isAriaHidden()", () => {
  test("empty", () => {
    const element = document.createElement("div");
    expect(isAriaHidden(element)).toBe(false);
  });
  test("aria-hidden = true", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-hidden", "true");
    expect(isAriaHidden(element)).toBe(true);
  });
  test("aria-hidden = false", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-hidden", "false");
    expect(isAriaHidden(element)).toBe(false);
  });
  test("invalid aria-hidden", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-hidden", "invalid");
    expect(isAriaHidden(element)).toBe(false);
  });
});
