import { describe, expect, test } from "vitest";
import { isLink } from "./linkTips";

describe("isLink()", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isLink(element)).toBe(false);
  });
  test("a", () => {
    const element = document.createElement("a");
    expect(isLink(element)).toBe(true);
  });
  test("area", () => {
    const element = document.createElement("area");
    expect(isLink(element)).toBe(true);
  });
  test("role=link", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "link");
    expect(isLink(element)).toBe(true);
  });
});
