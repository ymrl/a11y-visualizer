import { describe, expect, test } from "vitest";
import { isButton } from "./buttonTips";

describe("isButton()", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isButton(element)).toBe(false);
  });

  test("button element", () => {
    const element = document.createElement("button");
    expect(isButton(element)).toBe(true);
  });

  test("input type = button", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "button");
    expect(isButton(element)).toBe(true);
  });

  test("input type = submit", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "submit");
    expect(isButton(element)).toBe(true);
  });

  test("input type = reset", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "reset");
    expect(isButton(element)).toBe(true);
  });

  test("input type = image", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "image");
    expect(isButton(element)).toBe(true);
  });

  test("input type = text", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "text");
    expect(isButton(element)).toBe(false);
  });

  test("role = button", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    expect(isButton(element)).toBe(true);
  });

  test("summary", () => {
    const element = document.createElement("summary");
    const details = document.createElement("details");
    details.appendChild(element);
    expect(isButton(element)).toBe(true);
  });

  test("role = menuitem", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "menuitem");
    expect(isButton(element)).toBe(true);
  });
});
