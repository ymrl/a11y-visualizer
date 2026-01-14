import { afterEach, describe, expect, test } from "vitest";
import { isAriaHidden, isInAriaHidden } from "./isAriaHidden";

describe("isAriaHidden()", () => {
  test("empty", () => {
    const element = document.createElement("div");
    expect(isAriaHidden(element)).toBe(false);
  });
  test("aria-hidden = true", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-hidden", "true");
    expect(isAriaHidden(element)).toBe(true);
  });
  test("aria-hidden = false", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-hidden", "false");
    expect(isAriaHidden(element)).toBe(false);
  });
  test("invalid aria-hidden", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-hidden", "invalid");
    expect(isAriaHidden(element)).toBe(false);
  });
});

describe("isInAriaHidden()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("node is aria-hidden", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-hidden", "true");
    document.body.appendChild(element);
    expect(isInAriaHidden(element)).toBe(true);
  });

  test("parent is aria-hidden", () => {
    const parent = document.createElement("div");
    parent.setAttribute("aria-hidden", "true");
    const element = document.createElement("div");
    parent.appendChild(element);
    document.body.appendChild(parent);
    expect(isInAriaHidden(element)).toBe(true);
  });
  test("grandparent is aria-hidden", () => {
    const grandparent = document.createElement("div");
    grandparent.setAttribute("aria-hidden", "true");
    const parent = document.createElement("div");
    grandparent.appendChild(parent);
    const element = document.createElement("div");
    parent.appendChild(element);
    document.body.appendChild(grandparent);
    expect(isInAriaHidden(element)).toBe(true);
  });

  test("node is not aria-hidden", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    expect(isInAriaHidden(element)).toBe(false);
  });
  test("parent is not aria-hidden", () => {
    const parent = document.createElement("div");
    const element = document.createElement("div");
    parent.appendChild(element);
    document.body.appendChild(parent);
    expect(isInAriaHidden(element)).toBe(false);
  });
  test("grandparent is not aria-hidden", () => {
    const grandparent = document.createElement("div");
    const parent = document.createElement("div");
    grandparent.appendChild(parent);
    const element = document.createElement("div");
    parent.appendChild(element);
    document.body.appendChild(grandparent);
    expect(isInAriaHidden(element)).toBe(false);
  });
});
