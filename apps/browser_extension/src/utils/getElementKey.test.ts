import { afterEach, describe, expect, test } from "vitest";
import { getElementKey } from "./getElementKey";

describe("getElementKey()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("同じ要素には常に同じキーを返す", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const key1 = getElementKey(element);
    const key2 = getElementKey(element);
    expect(key1).toBe(key2);
  });

  test("異なる要素には異なるキーを返す", () => {
    const element1 = document.createElement("div");
    const element2 = document.createElement("div");
    document.body.appendChild(element1);
    document.body.appendChild(element2);
    expect(getElementKey(element1)).not.toBe(getElementKey(element2));
  });

  test("DOMから切り離された後も同じキーを返す", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const key1 = getElementKey(element);
    element.remove();
    expect(getElementKey(element)).toBe(key1);
  });
});
