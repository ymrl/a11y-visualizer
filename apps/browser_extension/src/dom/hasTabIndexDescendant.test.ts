import { describe, expect, test } from "vitest";
import { hasTabIndexDescendant } from "./hasTabIndexDescendant";

describe("hasTabIndexDescendant", () => {
  test("single element", () => {
    const el = document.createElement("button");
    expect(hasTabIndexDescendant(el)).toBe(false);
  });

  test("nested element", () => {
    const el = document.createElement("button");
    const child = document.createElement("span");
    child.tabIndex = 0;
    el.appendChild(child);
    expect(hasTabIndexDescendant(el)).toBe(true);
  });
});
