import { describe, test, expect, afterEach } from "vitest";
import { isInline } from "./isInline";

describe("isInline", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("isolated node", () => {
    const el = document.createElement("span");
    expect(isInline(el)).toBe(false);
  });

  test("element is the only child of block", () => {
    const p = document.createElement("p");
    p.setAttribute("style", "display: block");
    const el = document.createElement("span");
    el.setAttribute("style", "display: inline");
    document.body.appendChild(p);
    p.appendChild(el);
    expect(isInline(el)).toBe(true);
  });

  test("element is in inline element", () => {
    const p = document.createElement("p");
    p.setAttribute("style", "display: block");
    const span = document.createElement("span");
    const el = document.createElement("span");
    const prev = document.createElement("span");
    [span, el, prev].forEach((e) => e.setAttribute("style", "display: inline"));
    document.body.appendChild(p);
    p.appendChild(prev);
    p.appendChild(span);
    span.appendChild(el);
    expect(isInline(el)).toBe(true);
  });
});
