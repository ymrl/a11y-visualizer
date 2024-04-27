import { describe, test, expect, afterEach } from "vitest";
import { globalTips } from "./globalTips";

describe("globalTips()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("empty", () => {
    const element = document.createElement("div");
    expect(globalTips(element)).toEqual([]);
  });

  test("aria-describedby", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-describedby", "id");
    document.body.appendChild(element);
    const description = document.createElement("div");
    description.id = "id";
    description.textContent = "Hello";
    document.body.appendChild(description);
    expect(globalTips(element)).toEqual([
      { type: "description", content: "Hello" },
    ]);
  });

  test("missing aria-describedby", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-describedby", "id");
    document.body.appendChild(element);
    expect(globalTips(element)).toEqual([]);
  });

  test("title attribute", () => {
    const element = document.createElement("div");
    element.title = "Hello";
    expect(globalTips(element)).toEqual([
      { type: "description", content: "Hello" },
    ]);
  });

  test("role attribute", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    const result = globalTips(element);
    expect(result.find((t) => t.type === "role")).toEqual({
      type: "role",
      content: "button",
    });
    expect(result.find((t) => t.type === "tagName")).toEqual({
      type: "tagName",
      content: "div",
    });
  });
});
