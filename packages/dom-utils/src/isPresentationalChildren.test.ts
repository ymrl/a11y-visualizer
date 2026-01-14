import { afterEach, describe, expect, test } from "vitest";
import { isPresentationalChildren } from "./isPresentationalChildren";

describe("isPresentationalChildren", () => {
  afterEach(() => {
    document.documentElement.innerHTML = "";
  });

  test("div", () => {
    document.body.innerHTML = `<div></div>`;
    const el: Element | null = document.querySelector("div");
    expect(el && isPresentationalChildren(el)).toBe(false);
  });

  test("img", () => {
    document.body.innerHTML = `<img>`;
    const el = document.querySelector("img");
    expect(el && isPresentationalChildren(el)).toBe(false);
  });

  test("button", () => {
    document.body.innerHTML = `<button></button>`;
    const el = document.querySelector("button");
    expect(el && isPresentationalChildren(el)).toBe(false);
  });

  test('div[role="button"]', () => {
    document.body.innerHTML = `<div role="button"></div>`;
    const el = document.querySelector("div");
    expect(el && isPresentationalChildren(el)).toBe(false);
  });

  test("div > img", () => {
    document.body.innerHTML = `<div><img></div>`;
    const el = document.querySelector("img");
    expect(el && isPresentationalChildren(el)).toBe(false);
  });

  test("div > button", () => {
    document.body.innerHTML = `<div><button></div>`;
    const el = document.querySelector("button");
    expect(el && isPresentationalChildren(el)).toBe(false);
  });

  test("div > button > img", () => {
    document.body.innerHTML = `<div><button><img></button></div>`;
    const el = document.querySelector("img");
    expect(el && isPresentationalChildren(el)).toBe(true);
  });

  test('div > div[role="button"] > img', () => {
    document.body.innerHTML = `<div><div role="button"><img></div></div>`;
    const el = document.querySelector("img");
    expect(el && isPresentationalChildren(el)).toBe(true);
  });
});
