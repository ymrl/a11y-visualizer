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

  test("aria-busy", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-busy", "true");
    expect(globalTips(element)).toEqual([
      { type: "ariaStatus", content: 'aria-busy="true"' },
    ]);
  });

  test("aria-current", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-current", "page");
    expect(globalTips(element)).toEqual([
      { type: "ariaStatus", content: 'aria-current="page"' },
    ]);
  });

  test("aria-disabled", () => {
    const element = document.createElement("button");
    element.setAttribute("aria-disabled", "true");
    expect(globalTips(element)).toEqual([
      { type: "ariaStatus", content: 'aria-disabled="true"' },
    ]);
  });

  test("aria-disabled on prohibited role", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "article");
    element.setAttribute("aria-disabled", "true");
    const result = globalTips(element);
    expect(result).toHaveLength(2);
    expect(result.find((t) => t.type === "role")).toBeDefined();
    expect(result.find((t) => t.type === "tagName")).toBeDefined();
  });
});
