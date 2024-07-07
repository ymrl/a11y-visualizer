import { afterEach, describe, expect, test } from "vitest";
import { linkTips, isLink } from "./linkTips";

const getBoundingClientRect = () => ({
  width: 24,
  height: 24,
  x: 0,
  y: 0,
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  toJSON: () => "",
});

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

describe("linkTips()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("div", () => {
    const element = document.createElement("div");
    expect(linkTips(element)).toEqual([]);
  });

  test("empty a", () => {
    const element = document.createElement("a");
    document.body.appendChild(element);
    element.getBoundingClientRect = getBoundingClientRect;
    const result = linkTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "warning")).toEqual({
      type: "warning",
      content: "messages.noHref",
    });
  });

  test("a with name and href", () => {
    const element = document.createElement("a");
    element.getBoundingClientRect = getBoundingClientRect;
    element.textContent = "Hello";
    element.href = "https://example.com";
    document.body.appendChild(element);
    const result = linkTips(element);
    expect(result).toHaveLength(0);
  });

  test("a with target", () => {
    const element = document.createElement("a");
    element.getBoundingClientRect = getBoundingClientRect;
    element.textContent = "Hello";
    element.href = "https://example.com";
    element.target = "_blank";
    document.body.appendChild(element);
    const result = linkTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "linkTarget")).toEqual({
      type: "linkTarget",
      content: "_blank",
    });
  });

  test("a without href", () => {
    const element = document.createElement("a");
    element.getBoundingClientRect = getBoundingClientRect;
    element.textContent = "Hello";
    document.body.appendChild(element);
    const result = linkTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "warning")).toEqual({
      type: "warning",
      content: "messages.noHref",
    });
  });
  test("a without name", () => {
    const element = document.createElement("a");
    element.getBoundingClientRect = getBoundingClientRect;
    element.href = "https://example.com";
    document.body.appendChild(element);
    const result = linkTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "error")).toEqual({
      type: "error",
      content: "messages.noName",
    });
  });

  test("area", () => {
    const element = document.createElement("area");
    element.getBoundingClientRect = getBoundingClientRect;
    element.href = "https://example.com";
    element.alt = "Hello";
    const mapElement = document.createElement("map");
    document.body.appendChild(mapElement);
    mapElement.appendChild(element);
    const result = linkTips(element);
    // If using firefox, name will be added to the result
    expect(
      result.filter((t) => !(t.type === "name" && t.content === "Hello")),
    ).toHaveLength(0);
  });

  test("area without name", () => {
    const element = document.createElement("area");
    element.getBoundingClientRect = getBoundingClientRect;
    element.href = "https://example.com";
    const mapElement = document.createElement("map");
    document.body.appendChild(mapElement);
    mapElement.appendChild(element);
    const result = linkTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "error")).toEqual({
      type: "error",
      content: "messages.noAltImageMap",
    });
  });

  test("area without href", () => {
    const element = document.createElement("area");
    element.getBoundingClientRect = getBoundingClientRect;
    element.alt = "Hello";
    const mapElement = document.createElement("map");
    document.body.appendChild(mapElement);
    mapElement.appendChild(element);
    const result = linkTips(element);
    // If using firefox, name will be added to the result
    expect(
      result.filter((t) => !(t.type === "name" && t.content === "Hello")),
    ).toHaveLength(1);
    expect(result.find((t) => t.type === "warning")).toEqual({
      type: "warning",
      content: "messages.noHref",
    });
  });

  test("role = link", () => {
    const element = document.createElement("div");
    element.getBoundingClientRect = getBoundingClientRect;
    element.setAttribute("role", "link");
    document.body.appendChild(element);
    element.textContent = "Hello";
    element.tabIndex = 0;
    const result = linkTips(element);
    expect(result).toHaveLength(0);
  });

  test("invalid role = link", () => {
    const element = document.createElement("div");
    element.getBoundingClientRect = getBoundingClientRect;
    element.setAttribute("role", "link");
    document.body.appendChild(element);
    const result = linkTips(element);
    expect(result).toHaveLength(2);
    expect(
      result.find(
        (t) => t.type === "error" && t.content === "messages.notFocusable",
      ),
    ).not.toBeUndefined();
    expect(
      result.find((t) => t.type === "error" && t.content === "messages.noName"),
    ).not.toBeUndefined();
  });

  test("nested interactive", () => {
    const element = document.createElement("a");
    element.getBoundingClientRect = getBoundingClientRect;
    element.textContent = "Hello";
    element.href = "https://example.com";
    const child = document.createElement("button");
    child.textContent = "world";
    element.appendChild(child);
    document.body.appendChild(element);
    const result = linkTips(element);
    expect(result).toHaveLength(1);
    expect(
      result.find(
        (t) => t.type === "error" && t.content === "messages.nestedInteractive",
      ),
    ).toBeDefined();
  });

  test("nested tabindex", () => {
    const element = document.createElement("a");
    element.getBoundingClientRect = getBoundingClientRect;
    element.textContent = "Hello";
    element.href = "https://example.com";
    const child = document.createElement("div");
    child.setAttribute("tabindex", "0");
    element.appendChild(child);
    document.body.appendChild(element);
    const result = linkTips(element);
    expect(result).toHaveLength(1);
    expect(
      result.find(
        (t) => t.type === "error" && t.content === "messages.nestedInteractive",
      ),
    ).toBeDefined();
  });

  test("nested a", () => {
    const element = document.createElement("a");
    element.getBoundingClientRect = getBoundingClientRect;
    element.textContent = "Hello";
    element.href = "https://example.com";
    const child = document.createElement("a");
    child.textContent = "world";
    element.appendChild(child);
    document.body.appendChild(element);
    const result = linkTips(element);
    expect(result).toHaveLength(1);
    expect(
      result.find(
        (t) => t.type === "error" && t.content === "messages.nestedInteractive",
      ),
    ).toBeDefined();
  });

  test("nested a in parent", () => {
    const parent = document.createElement("a");
    parent.textContent = "Hello";
    parent.href = "https://example.com";
    const child = document.createElement("a");
    child.textContent = "world";
    child.href = "https://example.com";
    parent.appendChild(child);
    document.body.appendChild(parent);
    child.getBoundingClientRect = getBoundingClientRect;
    const result = linkTips(child);
    expect(result).toHaveLength(1);
    expect(
      result.find(
        (t) => t.type === "error" && t.content === "messages.nestedInteractive",
      ),
    ).toBeDefined();
  });
});
