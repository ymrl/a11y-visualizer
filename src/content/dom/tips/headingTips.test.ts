import { describe, expect, test } from "vitest";
import { isHeading } from "./headingTips";

describe("isHeading()", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isHeading(element)).toBe(false);
  });

  test("h1", () => {
    const element = document.createElement("h1");
    expect(isHeading(element)).toBe(true);
  });

  test("h2", () => {
    const element = document.createElement("h2");
    expect(isHeading(element)).toBe(true);
  });

  test("h3", () => {
    const element = document.createElement("h3");
    expect(isHeading(element)).toBe(true);
  });

  test("h4", () => {
    const element = document.createElement("h4");
    expect(isHeading(element)).toBe(true);
  });

  test("h5", () => {
    const element = document.createElement("h5");
    expect(isHeading(element)).toBe(true);
  });

  test("h6", () => {
    const element = document.createElement("h6");
    expect(isHeading(element)).toBe(true);
  });

  test("role=heading", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "heading");
    expect(isHeading(element)).toBe(true);
  });
});
