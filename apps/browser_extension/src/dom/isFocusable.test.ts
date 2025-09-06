import { describe, expect, test } from "vitest";
import { isFocusable } from "./isFocusable";

describe("isFocusable", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isFocusable(element)).toBe(false);
    expect(isFocusable(element, true)).toBe(false);
  });
  test("link without href", () => {
    const element = document.createElement("a");
    expect(isFocusable(element)).toBe(false);
    expect(isFocusable(element, true)).toBe(false);
  });
  test("link with href", () => {
    const element = document.createElement("a");
    element.href = "https://example.com";
    expect(isFocusable(element)).toBe(true);
    expect(isFocusable(element, true)).toBe(true);
  });
  test("area without map", () => {
    const element = document.createElement("area");
    element.href = "https://example.com";
    expect(isFocusable(element)).toBe(false);
    expect(isFocusable(element, true)).toBe(false);
  });
  test("area with map", () => {
    const element = document.createElement("area");
    element.href = "https://example.com";
    const mapElement = document.createElement("map");
    mapElement.appendChild(element);
    expect(isFocusable(element)).toBe(true);
    expect(isFocusable(element, true)).toBe(true);
  });
  test("area without href", () => {
    const element = document.createElement("area");
    const mapElement = document.createElement("map");
    mapElement.appendChild(element);
    expect(isFocusable(element)).toBe(false);
    expect(isFocusable(element, true)).toBe(false);
  });
  test("wrong area", () => {
    const element = document.createElement("area");
    element.href = "https://example.com";
    const mapElement = document.createElement("map");
    const divElement = document.createElement("div");
    mapElement.appendChild(divElement);
    divElement.appendChild(element);
    expect(isFocusable(element)).toBe(false);
    expect(isFocusable(element, true)).toBe(false);
  });
  test("button", () => {
    const element = document.createElement("button");
    expect(isFocusable(element)).toBe(true);
    expect(isFocusable(element, true)).toBe(true);
  });
  test("input", () => {
    const element = document.createElement("input");
    expect(isFocusable(element)).toBe(true);
    expect(isFocusable(element, true)).toBe(true);
  });
  test("hidden input", () => {
    const element = document.createElement("input");
    element.type = "hidden";
    expect(isFocusable(element)).toBe(false);
    expect(isFocusable(element, true)).toBe(false);
  });
  test("object", () => {
    const element = document.createElement("object");
    expect(isFocusable(element)).toBe(true);
    expect(isFocusable(element, true)).toBe(true);
  });
  test("select", () => {
    const element = document.createElement("select");
    expect(isFocusable(element)).toBe(true);
    expect(isFocusable(element, true)).toBe(true);
  });
  test("textarea", () => {
    const element = document.createElement("textarea");
    expect(isFocusable(element)).toBe(true);
    expect(isFocusable(element, true)).toBe(true);
  });
  test("summary", () => {
    const element = document.createElement("summary");
    const detailsElement = document.createElement("details");
    detailsElement.appendChild(element);
    expect(isFocusable(element)).toBe(true);
    expect(isFocusable(element, true)).toBe(true);
  });
  test("summary without details", () => {
    const element = document.createElement("summary");
    expect(isFocusable(element)).toBe(false);
    expect(isFocusable(element, true)).toBe(false);
  });
  test("wrong summary", () => {
    const element = document.createElement("summary");
    const detailsElement = document.createElement("details");
    const divElement = document.createElement("div");
    divElement.appendChild(element);
    detailsElement.appendChild(divElement);
    expect(isFocusable(element)).toBe(false);
    expect(isFocusable(element, true)).toBe(false);
  });
  test("tabindex", () => {
    const element = document.createElement("div");
    element.tabIndex = 0;
    expect(isFocusable(element)).toBe(true);
    expect(isFocusable(element, true)).toBe(true);
  });
  test("tabindex -1", () => {
    const element = document.createElement("div");
    element.tabIndex = -1;
    expect(isFocusable(element)).toBe(true);
    expect(isFocusable(element, true)).toBe(false);
  });
  test("button tabindex -1", () => {
    const element = document.createElement("button");
    element.tabIndex = -1;
    expect(isFocusable(element)).toBe(true);
    expect(isFocusable(element, true)).toBe(false);
  });

  test("contenteditable=true", () => {
    const element = document.createElement("div");
    element.contentEditable = "true";
    expect(isFocusable(element)).toBe(true);
    expect(isFocusable(element, true)).toBe(true);
  });

  test("contenteditable=false", () => {
    const element = document.createElement("div");
    element.contentEditable = "false";
    expect(isFocusable(element)).toBe(true);
    expect(isFocusable(element, true)).toBe(true);
  });

  test("contenteditable='' (empty string)", () => {
    const element = document.createElement("div");
    element.setAttribute("contenteditable", "");
    expect(isFocusable(element)).toBe(true);
    expect(isFocusable(element, true)).toBe(true);
  });

  test("contenteditable=inherit", () => {
    const element = document.createElement("div");
    element.contentEditable = "inherit";
    expect(isFocusable(element)).toBe(false);
    expect(isFocusable(element, true)).toBe(false);
  });
});
