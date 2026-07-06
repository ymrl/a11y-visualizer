import { afterEach, describe, expect, test, vi } from "vitest";
import { getScrollBaseElement } from "./getScrollBaseElement";

describe("getScrollBaseElement()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  test("スクロール可能な祖先要素を返す", () => {
    document.body.innerHTML = `
      <div id="scrollable" style="overflow-y: auto; height: 100px;">
        <div><span id="target">target</span></div>
      </div>
    `;
    const target = document.getElementById("target") as Element;
    const scrollable = document.getElementById("scrollable");
    expect(getScrollBaseElement(target)).toBe(scrollable);
  });

  test("要素自身がスクロール可能な場合は自身を返す", () => {
    document.body.innerHTML = `
      <div id="target" style="overflow-x: scroll;">target</div>
    `;
    const target = document.getElementById("target") as Element;
    expect(getScrollBaseElement(target)).toBe(target);
  });

  test("スクロール可能な祖先がない場合はundefinedを返す", () => {
    document.body.innerHTML = `
      <div><span id="target">target</span></div>
    `;
    const target = document.getElementById("target") as Element;
    expect(getScrollBaseElement(target)).toBeUndefined();
  });

  test("body要素にはundefinedを返す", () => {
    expect(getScrollBaseElement(document.body)).toBeUndefined();
  });

  test("キャッシュがある場合、2回目以降はgetComputedStyleを呼ばない", () => {
    document.body.innerHTML = `
      <div id="scrollable" style="overflow-y: auto; height: 100px;">
        <div><span id="target">target</span></div>
      </div>
    `;
    const target = document.getElementById("target") as Element;
    const scrollable = document.getElementById("scrollable");
    const cache = new WeakMap<Element, Element | null>();
    const spy = vi.spyOn(window, "getComputedStyle");

    expect(getScrollBaseElement(target, document, window, cache)).toBe(
      scrollable,
    );
    const callsAfterFirst = spy.mock.calls.length;
    expect(callsAfterFirst).toBeGreaterThan(0);

    expect(getScrollBaseElement(target, document, window, cache)).toBe(
      scrollable,
    );
    expect(spy.mock.calls.length).toBe(callsAfterFirst);
  });

  test("スクロール基準がない結果もキャッシュされる", () => {
    document.body.innerHTML = `
      <div><span id="target">target</span></div>
    `;
    const target = document.getElementById("target") as Element;
    const cache = new WeakMap<Element, Element | null>();
    const spy = vi.spyOn(window, "getComputedStyle");

    expect(
      getScrollBaseElement(target, document, window, cache),
    ).toBeUndefined();
    const callsAfterFirst = spy.mock.calls.length;

    expect(
      getScrollBaseElement(target, document, window, cache),
    ).toBeUndefined();
    expect(spy.mock.calls.length).toBe(callsAfterFirst);
  });

  test("同じキャッシュを使うと祖先の判定結果が再利用される", () => {
    document.body.innerHTML = `
      <div id="scrollable" style="overflow-y: auto; height: 100px;">
        <div id="parent">
          <span id="target1">target1</span>
          <span id="target2">target2</span>
        </div>
      </div>
    `;
    const target1 = document.getElementById("target1") as Element;
    const target2 = document.getElementById("target2") as Element;
    const scrollable = document.getElementById("scrollable");
    const cache = new WeakMap<Element, Element | null>();
    const spy = vi.spyOn(window, "getComputedStyle");

    expect(getScrollBaseElement(target1, document, window, cache)).toBe(
      scrollable,
    );
    const callsAfterFirst = spy.mock.calls.length;

    // target2自身の分だけgetComputedStyleが増える(祖先はキャッシュ済み)
    expect(getScrollBaseElement(target2, document, window, cache)).toBe(
      scrollable,
    );
    expect(spy.mock.calls.length).toBe(callsAfterFirst + 1);
  });
});
