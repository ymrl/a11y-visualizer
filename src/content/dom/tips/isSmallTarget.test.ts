import { describe, test, expect, afterEach } from "vitest";
import { isSmallTarget } from "./isSmallTarget";

describe("isSmallTarget", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("small inline-block", () => {
    const el = document.createElement("span");
    el.style.display = "inline-block";
    el.getBoundingClientRect = () => ({ width: 20, height: 20 }) as DOMRect;
    document.body.appendChild(el);
    expect(isSmallTarget(el)).toBe(true);
  });

  test("big inline-block", () => {
    const el = document.createElement("span");
    el.style.display = "inline-block";
    el.getBoundingClientRect = () => ({ width: 24, height: 24 }) as DOMRect;
    document.body.appendChild(el);
    expect(isSmallTarget(el)).toBe(false);
  });

  test("small inline", () => {
    const el = document.createElement("span");
    el.style.display = "inline";
    el.getBoundingClientRect = () => ({ width: 0, height: 20 }) as DOMRect;
    document.body.appendChild(el);
    expect(isSmallTarget(el)).toBe(true);
  });

  test("small inline but has big child", () => {
    const el = document.createElement("span");
    el.style.display = "inline";
    el.getBoundingClientRect = () => ({ width: 24, height: 20 }) as DOMRect;
    const child = document.createElement("span");
    child.getBoundingClientRect = () => ({ width: 24, height: 24 }) as DOMRect;
    el.appendChild(child);
    document.body.appendChild(el);
    expect(isSmallTarget(el)).toBe(false);
  });
});
