import { afterEach, describe, expect, test } from "vitest";
import { linkTips } from "./linkTips";

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
    const result = linkTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).toBeUndefined();
    expect(result.find((t) => t.type === "warning")).toEqual({
      type: "warning",
      content: "messages.noHref",
    });
  });

  test("a with name and href", () => {
    const element = document.createElement("a");
    element.textContent = "Hello";
    element.href = "https://example.com";
    document.body.appendChild(element);
    const result = linkTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).toEqual({
      type: "name",
      content: "Hello",
    });
    expect(result.find((t) => t.type === "error")).toBeUndefined();
  });

  test("a without href", () => {
    const element = document.createElement("a");
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
    element.href = "https://example.com";
    document.body.appendChild(element);
    const result = linkTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).toBeUndefined();
    expect(result.find((t) => t.type === "error")).toEqual({
      type: "error",
      content: "messages.noName",
    });
  });

  test("area", () => {
    const element = document.createElement("area");
    element.href = "https://example.com";
    element.alt = "Hello";
    const mapElement = document.createElement("map");
    document.body.appendChild(mapElement);
    mapElement.appendChild(element);
    const result = linkTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).toEqual({
      type: "name",
      content: "Hello",
    });
  });

  test("area without href", () => {
    const element = document.createElement("area");
    element.alt = "Hello";
    const mapElement = document.createElement("map");
    document.body.appendChild(mapElement);
    mapElement.appendChild(element);
    const result = linkTips(element);
    expect(result).toHaveLength(2);
    expect(result.find((t) => t.type === "name")).toEqual({
      type: "name",
      content: "Hello",
    });
    expect(result.find((t) => t.type === "warning")).toEqual({
      type: "warning",
      content: "messages.noHref",
    });
  });

  test("role = link", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "link");
    document.body.appendChild(element);
    element.textContent = "Hello";
    element.tabIndex = 0;
    const result = linkTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).toEqual({
      type: "name",
      content: "Hello",
    });
  });

  test("invalid role = link", () => {
    const element = document.createElement("div");
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
});
