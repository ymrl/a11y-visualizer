import { afterEach, describe, expect, test } from "vitest";
import { headingTips } from "./headingTips";

describe("headingTips()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("div", () => {
    const element = document.createElement("div");
    expect(headingTips(element)).toEqual([]);
  });

  test("empty h1", () => {
    const element = document.createElement("h1");
    document.body.appendChild(element);
    const result = headingTips(element);
    expect(result).toHaveLength(2);
    expect(result.find((t) => t.type === "level")).toEqual({
      type: "level",
      content: "1",
    });
    expect(result.find((t) => t.type === "error")).toEqual({
      type: "error",
      content: "messages.noName",
    });
  });

  test("h1 with name", () => {
    const element = document.createElement("h1");
    element.textContent = "Hello";
    document.body.appendChild(element);
    const result = headingTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "level")).toEqual({
      type: "level",
      content: "1",
    });
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
    expect(result.find((t) => t.type === "level")).toEqual({
      type: "level",
      content: "2",
    });
    expect(result.find((t) => t.type === "error")).toEqual({
      type: "error",
      content: "messages.noName",
    });
  });

  test("no aria-level", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "heading");
    document.body.appendChild(element);
    const result = headingTips(element);
    expect(result.find((t) => t.type === "error")).toEqual({
      type: "error",
      content: "messages.noHeadingLevel",
    });
  });

  test("aria-level, name", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "heading");
    element.setAttribute("aria-level", "2");
    element.textContent = "Hello";
    document.body.appendChild(element);
    const result = headingTips(element);
    expect(result.find((t) => t.type === "level")).toEqual({
      type: "level",
      content: "2",
    });
  });
});
