import { describe, expect, test } from "vitest";
import { hasAnyContent } from "./hasAnyContent";

describe("hasAnyContent", () => {
  test("テキストコンテンツがある", () => {
    const element = document.createElement("div");
    element.textContent = "Hello";
    expect(hasAnyContent(element)).toBe(true);
  });

  test("テキストコンテンツが空白のみ", () => {
    const element = document.createElement("div");
    element.textContent = " \n \t  ";
    expect(hasAnyContent(element)).toBe(false);
  });

  test("孫要素にテキストコンテンツがある", () => {
    const element = document.createElement("div");
    const child = document.createElement("span");
    const grandChild = document.createElement("span");
    grandChild.textContent = "World";
    child.appendChild(grandChild);
    element.appendChild(child);
    expect(hasAnyContent(element)).toBe(true);
  });

  test("孫要素のテキストコンテンツがあるが空白文字のみ", () => {
    const element = document.createElement("div");
    const child = document.createElement("span");
    const grandChild = document.createElement("span");
    grandChild.textContent = "   \n  \t ";
    child.appendChild(grandChild);
    element.appendChild(child);
    expect(hasAnyContent(element)).toBe(false);
  });

  test("画像がある", () => {
    const element = document.createElement("div");
    const img = document.createElement("img");
    element.appendChild(img);
    expect(hasAnyContent(element)).toBe(true);
  });

  test("svgがある", () => {
    const element = document.createElement("div");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    element.appendChild(svg);
    expect(hasAnyContent(element)).toBe(true);
  });

  test("canvasがある", () => {
    const element = document.createElement("div");
    const canvas = document.createElement("canvas");
    element.appendChild(canvas);
    expect(hasAnyContent(element)).toBe(true);
  });

  test("videoがある", () => {
    const element = document.createElement("div");
    const video = document.createElement("video");
    element.appendChild(video);
    expect(hasAnyContent(element)).toBe(true);
  });

  test("フォーカス可能な要素がある", () => {
    const element = document.createElement("div");
    const button = document.createElement("button");
    element.appendChild(button);
    expect(hasAnyContent(element)).toBe(true);
  });

  test("フォーカス可能な要素があるがtabindex=-1", () => {
    const element = document.createElement("div");
    const button = document.createElement("button");
    button.setAttribute("tabindex", "-1");
    element.appendChild(button);
    expect(hasAnyContent(element)).toBe(false);
  });
});
