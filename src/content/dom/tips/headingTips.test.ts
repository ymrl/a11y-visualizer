import { afterEach, describe, expect, test } from "vitest";
import { headingTips, isHeading } from "./headingTips";

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

describe("headingTips()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("div", () => {
    const element = document.createElement("div");
    expect(headingTips(element)).toHaveLength(0);
  });

  test("empty h1", () => {
    const element = document.createElement("h1");
    document.body.appendChild(element);
    const result = headingTips(element);
    expect(result).toHaveLength(2);
    expect(
      result.find((t) => t.type === "level" && t.content === "1"),
    ).toBeDefined();
    expect(
      result.find((t) => t.type === "error" && t.content === "messages.noName"),
    ).toBeDefined();
  });

  test("h1 with name", () => {
    const element = document.createElement("h1");
    element.textContent = "Hello";
    document.body.appendChild(element);
    const result = headingTips(element);
    expect(result).toHaveLength(1);
    expect(
      result.find((t) => t.type === "level" && t.content === "1"),
    ).toBeDefined();
  });

  test("levels", () => {
    expect(
      headingTips(document.createElement("h1")).find((t) => t.type === "level")
        ?.content,
    ).toEqual("1");
    expect(
      headingTips(document.createElement("h2")).find((t) => t.type === "level")
        ?.content,
    ).toEqual("2");
    expect(
      headingTips(document.createElement("h3")).find((t) => t.type === "level")
        ?.content,
    ).toEqual("3");
    expect(
      headingTips(document.createElement("h4")).find((t) => t.type === "level")
        ?.content,
    ).toEqual("4");
    expect(
      headingTips(document.createElement("h5")).find((t) => t.type === "level")
        ?.content,
    ).toEqual("5");
    expect(
      headingTips(document.createElement("h6")).find((t) => t.type === "level")
        ?.content,
    ).toEqual("6");
  });

  test("aria-level", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "heading");
    element.setAttribute("aria-level", "2");
    document.body.appendChild(element);
    const result = headingTips(element);
    expect(
      result.find((t) => t.type === "level" && t.content === "2"),
    ).toBeDefined();
    expect(
      result.find((t) => t.type === "error" && t.content === "messages.noName"),
    ).toBeDefined;
  });

  test("no aria-level", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "heading");
    document.body.appendChild(element);
    const result = headingTips(element);
    expect(
      result.find(
        (t) => t.type === "error" && t.content === "messages.noHeadingLevel",
      ),
    ).toBeDefined();
  });

  test("aria-level, name", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "heading");
    element.setAttribute("aria-level", "2");
    element.textContent = "Hello";
    document.body.appendChild(element);
    const result = headingTips(element);
    expect(
      result.find((t) => t.type === "level" && t.content === "2"),
    ).toBeDefined();
  });
});
