import { afterEach, describe, expect, test } from "vitest";
import { isInert, isInInert } from "./isInert";

// CSSの interactivity: inert はブラウザ間で対応状況が異なる（Firefox未対応）。
// 非対応ブラウザでは getComputedStyle が "inert" を返さないため、
// 該当テストは test.skipIf でスキップする。属性ベースの挙動は全ブラウザで検証する。
const supportsInteractivityInert =
  typeof CSS !== "undefined" && !!CSS.supports?.("interactivity: inert");

describe("isInert()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("empty", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    expect(isInert(element)).toBe(false);
  });

  test("inert attribute", () => {
    const element = document.createElement("div");
    element.setAttribute("inert", "");
    document.body.appendChild(element);
    expect(isInert(element)).toBe(true);
  });

  test.skipIf(!supportsInteractivityInert)("interactivity: inert style", () => {
    const element = document.createElement("div");
    element.style.setProperty("interactivity", "inert");
    document.body.appendChild(element);
    expect(isInert(element)).toBe(true);
  });
});

describe("isInInert()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("node is inert", () => {
    const element = document.createElement("div");
    element.setAttribute("inert", "");
    document.body.appendChild(element);
    expect(isInInert(element)).toBe(true);
  });

  test("parent is inert", () => {
    const parent = document.createElement("div");
    parent.setAttribute("inert", "");
    const element = document.createElement("div");
    parent.appendChild(element);
    document.body.appendChild(parent);
    expect(isInInert(element)).toBe(true);
  });

  test("grandparent is inert", () => {
    const grandparent = document.createElement("div");
    grandparent.setAttribute("inert", "");
    const parent = document.createElement("div");
    grandparent.appendChild(parent);
    const element = document.createElement("div");
    parent.appendChild(element);
    document.body.appendChild(grandparent);
    expect(isInInert(element)).toBe(true);
  });

  test("node is not inert", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    expect(isInInert(element)).toBe(false);
  });

  test("parent is not inert", () => {
    const parent = document.createElement("div");
    const element = document.createElement("div");
    parent.appendChild(element);
    document.body.appendChild(parent);
    expect(isInInert(element)).toBe(false);
  });

  test("grandparent is not inert", () => {
    const grandparent = document.createElement("div");
    const parent = document.createElement("div");
    grandparent.appendChild(parent);
    const element = document.createElement("div");
    parent.appendChild(element);
    document.body.appendChild(grandparent);
    expect(isInInert(element)).toBe(false);
  });

  test.skipIf(!supportsInteractivityInert)(
    "ancestor has interactivity: inert style",
    () => {
      const parent = document.createElement("div");
      parent.style.setProperty("interactivity", "inert");
      const element = document.createElement("div");
      parent.appendChild(element);
      document.body.appendChild(parent);
      expect(isInInert(element)).toBe(true);
    },
  );
});
