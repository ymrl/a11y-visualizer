import { describe, test, expect } from "vitest";
import { isImage } from "./imageTips";

describe("isImage()", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isImage(element)).toBe(false);
  });
  test("img", () => {
    const element = document.createElement("img");
    expect(isImage(element)).toBe(true);
  });
  test("svg", () => {
    const element = document.createElement("svg");
    expect(isImage(element)).toBe(true);
  });
  test("role=img", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "img");
    expect(isImage(element)).toBe(true);
  });
  test("role=button", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    expect(isImage(element)).toBe(false);
  });
  test("svg role=presentation", () => {
    const element = document.createElement("svg");
    element.setAttribute("role", "presentation");
    expect(isImage(element)).toBe(true);
  });
});
