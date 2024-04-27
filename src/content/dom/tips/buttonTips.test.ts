import { afterEach, describe, expect, test } from "vitest";
import { buttonTips } from "./buttonTips";

describe("buttonTips()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });
  test("div", () => {
    const element = document.createElement("div");
    expect(buttonTips(element)).toEqual([]);
  });

  test("empty button", () => {
    const element = document.createElement("button");
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).toBeUndefined();
    expect(result.find((t) => t.type === "error")).toEqual({
      type: "error",
      content: "messages.noName",
    });
  });

  test("button element", () => {
    const element = document.createElement("button");
    element.textContent = "Hello";
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).toEqual({
      type: "name",
      content: "Hello",
    });
    expect(result.find((t) => t.type === "error")).toBeUndefined();
  });

  test("input type = button", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "button");
    element.value = "Hello";
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).toEqual({
      type: "name",
      content: "Hello",
    });
  });

  test("input type = button without name", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "button");
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).toBeUndefined();
    expect(result.find((t) => t.type === "error")).toEqual({
      type: "error",
      content: "messages.noName",
    });
  });

  test("input type = submit", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "submit");
    element.value = "Hello";
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).toEqual({
      type: "name",
      content: "Hello",
    });
  });

  test("input type = reset", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "reset");
    element.value = "Hello";
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).toEqual({
      type: "name",
      content: "Hello",
    });
  });

  test("input type = submit without value", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "submit");
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).not.toBeUndefined;
  });

  test("input type = reset without value", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "reset");
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).not.toBeUndefined;
  });

  test("input type = image", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "image");
    element.setAttribute("alt", "Hello");
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).toEqual({
      type: "name",
      content: "Hello",
    });
  });

  test("input type = image without alt", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "image");
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).not.toBeUndefined;
  });

  test("role = button", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.textContent = "Hello";
    element.tabIndex = 0;
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).toEqual({
      type: "name",
      content: "Hello",
    });
  });

  test("role = button without name", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.tabIndex = 0;
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).toBeUndefined();
    expect(result.find((t) => t.type === "error")).toEqual({
      type: "error",
      content: "messages.noName",
    });
  });

  test("role = button without tabindex", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.textContent = "Hello";
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(2);
    expect(result.find((t) => t.type === "name")).toEqual({
      type: "name",
      content: "Hello",
    });
    expect(result.find((t) => t.type === "error")).toEqual({
      type: "error",
      content: "messages.notFocusable",
    });
  });

  test("role = button without namae and tabindex", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(2);
    expect(
      result.find((t) => t.type === "error" && t.content === "messages.noName"),
    ).not.toBeUndefined();
    expect(
      result.find(
        (t) => t.type === "error" && t.content === "messages.notFocusable",
      ),
    ).not.toBeUndefined();
  });

  test("role = button with aria-hidden", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.setAttribute("aria-hidden", "true");
    element.textContent = "Hello";
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "name")).toBeUndefined();
  });
});
