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
});
