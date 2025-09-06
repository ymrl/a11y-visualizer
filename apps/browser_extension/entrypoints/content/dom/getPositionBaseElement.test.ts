import { afterEach, describe, expect, test } from "vitest";
import { getPositionBaseElement } from "./getPositionBaseElement";

describe("getPositionBaseElement", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("el is null", () => {
    expect(getPositionBaseElement(null, document, window)).toBe(null);
  });

  test("el is not null", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    expect(getPositionBaseElement(element, document, window)).toBe(null);
  });

  test("el is position static", () => {
    const element = document.createElement("div");
    element.style.position = "static";
    document.body.appendChild(element);
    expect(getPositionBaseElement(element, document, window)).toBe(null);
  });

  test("el is position relative", () => {
    const element = document.createElement("div");
    element.style.position = "relative";
    document.body.appendChild(element);
    expect(getPositionBaseElement(element, document, window)).toBe(element);
  });

  test("el is position absolute", () => {
    const element = document.createElement("div");
    element.style.position = "absolute";
    document.body.appendChild(element);
    expect(getPositionBaseElement(element, document, window)).toBe(element);
  });

  test("el is position fixed", () => {
    const element = document.createElement("div");
    element.style.position = "fixed";
    document.body.appendChild(element);
    expect(getPositionBaseElement(element, document, window)).toBe(element);
  });

  test("el is body", () => {
    const element = document.body;
    expect(getPositionBaseElement(element, document, window)).toBe(null);
  });

  test("el has parent", () => {
    const parent = document.createElement("div");
    document.body.appendChild(parent);
    const element = document.createElement("div");
    parent.appendChild(element);
    expect(getPositionBaseElement(element, document, window)).toBe(null);
  });

  test("parent of el is position static", () => {
    const parent = document.createElement("div");
    parent.style.position = "static";
    document.body.appendChild(parent);
    const element = document.createElement("div");
    parent.appendChild(element);
    expect(getPositionBaseElement(element, document, window)).toBe(null);
  });

  test("parent of el is position relative", () => {
    const parent = document.createElement("div");
    parent.style.position = "relative";
    document.body.appendChild(parent);
    const element = document.createElement("div");
    parent.appendChild(element);
    expect(getPositionBaseElement(element, document, window)).toBe(parent);
  });

  test("parent of el is position absolute", () => {
    const parent = document.createElement("div");
    parent.style.position = "absolute";
    document.body.appendChild(parent);
    const element = document.createElement("div");
    parent.appendChild(element);
    expect(getPositionBaseElement(element, document, window)).toBe(parent);
  });

  test("parent of el is position fixed", () => {
    const parent = document.createElement("div");
    parent.style.position = "fixed";
    document.body.appendChild(parent);
    const element = document.createElement("div");
    parent.appendChild(element);
    expect(getPositionBaseElement(element, document, window)).toBe(parent);
  });
});
