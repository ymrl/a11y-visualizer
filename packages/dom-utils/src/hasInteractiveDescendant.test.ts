import { describe, expect, test } from "vitest";
import { hasInteractiveDescendant } from "./hasInteractiveDescendant";

describe("hasInteractiveDescendant", () => {
  test("single element", () => {
    const el = document.createElement("button");
    expect(hasInteractiveDescendant(el)).toBe(false);
  });

  test("nested element", () => {
    const el = document.createElement("button");
    const link = document.createElement("a");
    link.href = "https://example.com";
    el.appendChild(link);
    expect(hasInteractiveDescendant(el)).toBe(true);
  });

  test("descendant with interactive role but no tabindex", () => {
    const el = document.createElement("button");
    const widget = document.createElement("div");
    widget.setAttribute("role", "button");
    el.appendChild(widget);
    expect(hasInteractiveDescendant(el)).toBe(true);
  });

  test("descendant with interactive role as a token", () => {
    const el = document.createElement("button");
    const widget = document.createElement("div");
    widget.setAttribute("role", "invalidrole checkbox");
    el.appendChild(widget);
    expect(hasInteractiveDescendant(el)).toBe(true);
  });

  test("descendant with non-interactive role", () => {
    const el = document.createElement("button");
    const child = document.createElement("div");
    child.setAttribute("role", "presentation");
    el.appendChild(child);
    expect(hasInteractiveDescendant(el)).toBe(false);
  });
});
