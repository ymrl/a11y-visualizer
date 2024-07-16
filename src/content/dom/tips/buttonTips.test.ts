import { afterEach, describe, expect, test } from "vitest";
import { buttonTips, isButton } from "./buttonTips";

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
    expect(
      result.find((t) => t.type === "error" && t.content === "messages.noName"),
    ).toBeDefined();
    // If browser does not support computedStyleMap, there may be a size warning.
    expect(
      result.filter(
        (t) =>
          !(t.type === "error" && t.content === "messages.noName") &&
          !(t.type === "warning" && t.content === "messages.smallTargetSize"),
      ).length,
    ).toBe(0);
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
    element.getBoundingClientRect = getBoundingClientRect;
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(0);
  });

  test("input type = image without alt", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "image");
    element.getBoundingClientRect = getBoundingClientRect;
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(0);
  });

  test("role = button", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.textContent = "Hello";
    element.tabIndex = 0;
    element.getBoundingClientRect = getBoundingClientRect;
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(0);
  });

  test("role = button without name", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.tabIndex = 0;
    document.body.appendChild(element);
    element.getBoundingClientRect = getBoundingClientRect;
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
    element.getBoundingClientRect = getBoundingClientRect;
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
    element.getBoundingClientRect = getBoundingClientRect;
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
    element.getBoundingClientRect = getBoundingClientRect;
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(0);
  });

  test("summary", () => {
    const element = document.createElement("summary");
    const details = document.createElement("details");
    element.textContent = "Hello";
    details.appendChild(element);
    element.getBoundingClientRect = getBoundingClientRect;
    document.body.appendChild(details);
    const result = buttonTips(element);
    expect(result).toHaveLength(0);
  });

  test("summary without name", () => {
    const element = document.createElement("summary");
    const details = document.createElement("details");
    details.appendChild(element);
    element.getBoundingClientRect = getBoundingClientRect;
    document.body.appendChild(details);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("error");
    expect(result[0].content).toBe("messages.noName");
  });

  test("nested interactive", () => {
    const element = document.createElement("div");
    element.role = "button";
    element.tabIndex = 0;
    element.appendChild(new Text("Hello"));
    const button = document.createElement("button");
    button.textContent = "world";
    element.appendChild(button);
    document.body.appendChild(element);
    element.getBoundingClientRect = getBoundingClientRect;
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("error");
    expect(result[0].content).toBe("messages.nestedInteractive");
  });

  test("nested tabindex", () => {
    const element = document.createElement("button");
    element.appendChild(new Text("Hello"));
    const span = document.createElement("span");
    span.tabIndex = 0;
    span.textContent = "world";
    element.appendChild(span);
    document.body.appendChild(element);
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("error");
    expect(result[0].content).toBe("messages.nestedInteractive");
  });

  test("nested interactive parent", () => {
    const link = document.createElement("a");
    link.textContent = "Hello";
    link.href = "http://example.com";
    const button = document.createElement("button");
    button.textContent = "world";
    link.appendChild(button);
    document.body.appendChild(link);
    const result = buttonTips(button);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("error");
    expect(result[0].content).toBe("messages.nestedInteractive");
  });

  test("small button", () => {
    const element = document.createElement("button");
    element.getBoundingClientRect = () => ({
      width: 20,
      height: 20,
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      toJSON: () => "",
    });
    element.setAttribute("style", "padding: 0");
    element.textContent = "hello";
    const result = buttonTips(element);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("warning");
    expect(result[0].content).toBe("messages.smallTargetSize");
  });
});
