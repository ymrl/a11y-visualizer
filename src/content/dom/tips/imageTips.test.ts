import { describe, test, expect, afterEach } from "vitest";
import { imageTips, isImage } from "./imageTips";

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

describe("imageTips()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });
  test("div", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    expect(imageTips(element)).toEqual([]);
  });
  test("img with alt", () => {
    const element = document.createElement("img");
    element.setAttribute("alt", "Hello");
    element.setAttribute("src", "hello.png");
    document.body.appendChild(element);
    expect(imageTips(element)).toEqual([]);
  });

  test("img without alt", () => {
    const element = document.createElement("img");
    element.setAttribute("src", "hello.png");
    document.body.appendChild(element);
    expect(imageTips(element)).toEqual([
      { type: "error", content: "messages.noAltImage" },
    ]);
  });

  test("img with empty alt", () => {
    const element = document.createElement("img");
    element.setAttribute("alt", "");
    element.setAttribute("src", "hello.png");
    document.body.appendChild(element);
    expect(imageTips(element)).toEqual([
      { type: "warning", content: "messages.emptyAltImage" },
    ]);
  });

  test("svg", () => {
    const element = document.createElement("svg");
    document.body.appendChild(element);
    const result = imageTips(element);
    expect(result.find((e) => e.type === "tagName")).toEqual({
      type: "tagName",
      content: "svg",
    });
    expect(result.find((e) => e.type === "error")).toEqual({
      type: "error",
      content: "messages.noName",
    });
  });

  test("aria-hidden svg", () => {
    const element = document.createElement("svg");
    element.setAttribute("aria-hidden", "true");
    document.body.appendChild(element);
    const result = imageTips(element);
    expect(result).toHaveLength(1);
    expect(
      result.find((e) => e.type === "tagName" && e.content === "svg"),
    ).toBeDefined();
    expect(result.find((e) => e.type === "error")).toBeUndefined();
  });
});
