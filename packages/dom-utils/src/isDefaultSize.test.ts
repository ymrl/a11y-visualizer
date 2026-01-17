import { afterEach, describe, expect, test } from "vitest";
import { isDefaultSize } from "./isDefaultSize";

describe("isDefaultSize", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("default checkbox", () => {
    const el = document.createElement("input");
    el.setAttribute("type", "checkbox");
    document.body.appendChild(el);
    expect(isDefaultSize(el)).toBe(true);
  });

  test("default button", () => {
    const el = document.createElement("button");
    el.textContent = "hello";
    document.body.appendChild(el);
    expect(isDefaultSize(el)).toBe(true);
  });

  test("size specified button", () => {
    const el = document.createElement("button");
    el.textContent = "hello";
    el.style.height = "24px";
    document.body.appendChild(el);
    expect(isDefaultSize(el)).toBe(false);
  });

  test("input type not specified", () => {
    const el = document.createElement("input");
    document.body.appendChild(el);
    expect(isDefaultSize(el)).toBe(true);
  });

  [
    "text",
    "search",
    "tel",
    "email",
    "password",
    "date",
    "month",
    "week",
    "time",
    "datetime-local",
    "number",
    "range",
    "color",
    "checkbox",
    "radio",
    "file",
    "submit",
    // "image",
    "reset",
    "button",
  ].forEach((type) => {
    test(`default input type ${type}`, () => {
      const el = document.createElement("input");
      el.setAttribute("type", type);
      document.body.appendChild(el);
      expect(isDefaultSize(el)).toBe(true);
    });
  });
});
