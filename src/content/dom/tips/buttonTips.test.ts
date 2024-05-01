import { afterEach, describe, expect, test } from "vitest";
import { buttonTips, isButton } from "./buttonTips";

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
});

describe("buttonTips()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });
  test("div", () => {
    const element = document.createElement("div");
    expect(buttonTips(element)).toHaveLength(0);
  });

  test("empty button", () => {
    const element = document.createElement("button");
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(
      result.find((t) => t.type === "error" && t.content === "messages.noName"),
    ).toBeDefined();
  });

  test("button element", () => {
    const element = document.createElement("button");
    element.textContent = "Hello";
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(0);
  });

  test("input type = button", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "button");
    element.value = "Hello";
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(0);
  });

  test("input type = button without name", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "button");
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(
      result.find((t) => t.type === "error" && t.content === "messages.noName"),
    ).toBeDefined();
  });

  test("input type = submit", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "submit");
    element.value = "Hello";
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(0);
  });

  test("input type = reset", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "reset");
    element.value = "Hello";
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(0);
  });

  test("input type = submit without value", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "submit");
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(0);
  });

  test("input type = reset without value", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "reset");
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(0);
  });

  test("input type = image", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "image");
    element.setAttribute("alt", "Hello");
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(0);
  });

  test("input type = image without alt", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "image");
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(0);
  });

  test("role = button", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.textContent = "Hello";
    element.tabIndex = 0;
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(0);
  });

  test("role = button without name", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.tabIndex = 0;
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(
      result.find((t) => t.type === "error" && t.content === "messages.noName"),
    ).toBeDefined();
  });

  test("role = button without tabindex", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.textContent = "Hello";
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(
      result.find(
        (t) => t.type === "error" && t.content === "messages.notFocusable",
      ),
    ).toBeDefined();
  });

  test("role = button without namae and tabindex", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(2);
    expect(
      result.find((t) => t.type === "error" && t.content === "messages.noName"),
    ).toBeDefined();
    expect(
      result.find(
        (t) => t.type === "error" && t.content === "messages.notFocusable",
      ),
    ).toBeDefined();
  });

  test("role = button with aria-hidden", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("tabindex", "0");
    element.textContent = "Hello";
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(0);
  });
});
