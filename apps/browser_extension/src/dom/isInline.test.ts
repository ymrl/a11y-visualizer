import { afterEach, describe, expect, test } from "vitest";
import { isInline } from "./isInline";

describe("isInline", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("isolated node", () => {
    const el = document.createElement("span");
    expect(isInline(el)).toBe(false);
  });

  test("display: block", () => {
    const el = document.createElement("span");
    el.style.display = "block";
    document.body.appendChild(el);
    expect(isInline(el)).toBe(false);
  });

  test("display: flex", () => {
    const el = document.createElement("span");
    el.style.display = "flex";
    document.body.appendChild(el);
    expect(isInline(el)).toBe(false);
  });

  test("display: grid", () => {
    const el = document.createElement("span");
    el.style.display = "grid";
    document.body.appendChild(el);
    expect(isInline(el)).toBe(false);
  });

  test("parent is flex", () => {
    const parent = document.createElement("div");
    parent.style.display = "flex";
    const el = document.createElement("span");
    parent.appendChild(el);
    document.body.appendChild(parent);
    expect(isInline(el)).toBe(false);
  });

  test("parent is grid", () => {
    const parent = document.createElement("div");
    parent.style.display = "grid";
    const el = document.createElement("span");
    parent.appendChild(el);
    document.body.appendChild(parent);
    expect(isInline(el)).toBe(false);
  });

  test("bigger height than parent line height", () => {
    const parent = document.createElement("div");
    parent.style.fontSize = "16px";
    parent.style.lineHeight = "normal"; // 1.2 * 16 = 19.2
    const el = document.createElement("span");
    el.style.display = "inline-block";
    el.getBoundingClientRect = () => ({ height: 20 }) as DOMRect;
    parent.appendChild(el);
    document.body.appendChild(parent);
    expect(isInline(el)).toBe(false);
  });

  test("has previous inline sibling", () => {
    const parent = document.createElement("div");
    const el = document.createElement("span");
    el.style.display = "inline-block";
    el.getBoundingClientRect = () => ({ height: 19.2 }) as DOMRect;
    const sibling = document.createElement("span");
    sibling.textContent = "test";
    sibling.style.display = "inline-block";
    parent.appendChild(sibling);
    parent.appendChild(el);
    document.body.appendChild(parent);
    expect(isInline(el)).toBe(true);
  });

  test("previous sibling is position: absolute", () => {
    const parent = document.createElement("div");
    const el = document.createElement("span");
    el.style.display = "inline-block";
    el.getBoundingClientRect = () => ({ height: 19.2 }) as DOMRect;
    const sibling = document.createElement("span");
    sibling.textContent = "test";
    sibling.style.display = "inline-block";
    sibling.style.position = "absolute";
    parent.appendChild(sibling);
    parent.appendChild(el);
    document.body.appendChild(parent);
    expect(isInline(el)).toBe(false);
  });

  test("previous sibling does not have text content", () => {
    const parent = document.createElement("div");
    const el = document.createElement("span");
    el.style.display = "inline-block";
    el.getBoundingClientRect = () => ({ height: 19.2 }) as DOMRect;
    const sibling = document.createElement("span");
    sibling.style.display = "inline-block";
    parent.appendChild(sibling);
    parent.appendChild(el);
    document.body.appendChild(parent);
    expect(isInline(el)).toBe(false);
  });

  test("has next inline sibling", () => {
    const parent = document.createElement("div");
    const el = document.createElement("span");
    el.style.display = "inline-block";
    el.getBoundingClientRect = () => ({ height: 19.2 }) as DOMRect;
    const sibling = document.createElement("span");
    sibling.style.display = "inline-block";
    parent.appendChild(el);
    parent.appendChild(sibling);
    document.body.appendChild(parent);
    expect(isInline(el)).toBe(false);
  });

  test("has previous text sibling", () => {
    const parent = document.createElement("div");
    const el = document.createElement("span");
    el.style.display = "inline-block";
    el.getBoundingClientRect = () => ({ height: 19.2 }) as DOMRect;
    const sibling = document.createTextNode("test");
    parent.appendChild(sibling);
    parent.appendChild(el);
    document.body.appendChild(parent);
    expect(isInline(el)).toBe(true);
  });

  test("has next text sibling", () => {
    const parent = document.createElement("div");
    const el = document.createElement("span");
    el.style.display = "inline-block";
    el.getBoundingClientRect = () => ({ height: 19.2 }) as DOMRect;
    const sibling = document.createTextNode("test");
    parent.appendChild(el);
    parent.appendChild(sibling);
    document.body.appendChild(parent);
    expect(isInline(el)).toBe(false);
  });

  test("display:inline and has text", () => {
    const el = document.createElement("span");
    el.style.display = "inline";
    el.textContent = "test";
    el.getBoundingClientRect = () => ({ height: 19.2 }) as DOMRect;
    document.body.appendChild(el);
    expect(isInline(el)).toBe(true);
  });

  test("display:inline and does not have text", () => {
    const el = document.createElement("span");
    el.style.display = "inline";
    el.getBoundingClientRect = () => ({ height: 19.2 }) as DOMRect;
    document.body.appendChild(el);
    expect(isInline(el)).toBe(false);
  });

  test("nested span", () => {
    const grandParent = document.createElement("div");
    grandParent.style.display = "block";
    const el = document.createElement("span");
    const parent = document.createElement("span");
    const parentSibling = document.createElement("span");
    parentSibling.textContent = "test";
    [el, parent, parentSibling].forEach((e) => {
      e.style.display = "inline-block";
      e.getBoundingClientRect = () => ({ height: 19.2 }) as DOMRect;
    });
    parent.appendChild(el);
    grandParent.appendChild(parentSibling);
    grandParent.appendChild(parent);
    document.body.appendChild(grandParent);
    expect(isInline(el)).toBe(true);
  });
});
