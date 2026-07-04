import { afterEach, describe, expect, it, vi } from "vitest";
import { createAlertTracker } from "./createAlertTracker";

afterEach(() => {
  document.body.innerHTML = "";
});

const createAlert = (): Element => {
  const el = document.createElement("div");
  el.setAttribute("role", "alert");
  el.textContent = "alert";
  document.body.appendChild(el);
  return el;
};

describe("createAlertTracker", () => {
  it("renderableなalertは即座にannounceされる", () => {
    const tracker = createAlertTracker();
    const announce = vi.fn();
    const el = createAlert();

    tracker.handle(el, { isRenderable: () => true, announce });

    expect(announce).toHaveBeenCalledTimes(1);
    expect(announce).toHaveBeenCalledWith(el);
  });

  it("同じalertを二度announceしない", () => {
    const tracker = createAlertTracker();
    const announce = vi.fn();
    const el = createAlert();
    const options = { isRenderable: () => true, announce };

    tracker.handle(el, options);
    tracker.handle(el, options);

    expect(announce).toHaveBeenCalledTimes(1);
  });

  it("renderableでないalertはannounceされずpendingになる", () => {
    const tracker = createAlertTracker();
    const announce = vi.fn();
    const el = createAlert();

    tracker.handle(el, { isRenderable: () => false, announce });

    expect(announce).not.toHaveBeenCalled();
  });

  it("非表示から表示になったalertは再チェックでannounceされる", () => {
    const tracker = createAlertTracker();
    const announce = vi.fn();
    const el = createAlert();
    let renderable = false;
    const options = {
      isRenderable: () => renderable,
      announce,
    };

    // 初回スキャン時は非表示なので見送られる
    tracker.handle(el, options);
    expect(announce).not.toHaveBeenCalled();

    // 表示に切り替わってから再チェックするとannounceされる
    renderable = true;
    tracker.recheckPending(options);
    expect(announce).toHaveBeenCalledTimes(1);
    expect(announce).toHaveBeenCalledWith(el);
  });

  it("再チェックで一度announceしたalertは再度announceしない", () => {
    const tracker = createAlertTracker();
    const announce = vi.fn();
    const el = createAlert();
    let renderable = false;
    const options = {
      isRenderable: () => renderable,
      announce,
    };

    tracker.handle(el, options);
    renderable = true;
    tracker.recheckPending(options);
    tracker.recheckPending(options);

    expect(announce).toHaveBeenCalledTimes(1);
  });

  it("非表示のまま再チェックしてもannounceしない", () => {
    const tracker = createAlertTracker();
    const announce = vi.fn();
    const el = createAlert();
    const options = { isRenderable: () => false, announce };

    tracker.handle(el, options);
    tracker.recheckPending(options);
    tracker.recheckPending(options);

    expect(announce).not.toHaveBeenCalled();
  });

  it("DOMから取り除かれたpending alertは再チェックで破棄される", () => {
    const tracker = createAlertTracker();
    const announce = vi.fn();
    const el = createAlert();
    let renderable = false;
    const options = {
      isRenderable: () => renderable,
      announce,
    };

    tracker.handle(el, options);
    // pendingのままDOMから取り除く
    el.remove();

    // 破棄されるので、表示可能に戻してもannounceされない
    renderable = true;
    tracker.recheckPending(options);
    expect(announce).not.toHaveBeenCalled();

    // 破棄済みなので再度追加・表示してもannounceされない
    // (同一要素は破棄されたが、handleで明示的に扱えば再登録される)
    document.body.appendChild(el);
    tracker.recheckPending(options);
    expect(announce).not.toHaveBeenCalled();
  });

  it("複数のpending alertをそれぞれ独立に扱う", () => {
    const tracker = createAlertTracker();
    const announce = vi.fn();
    const el1 = createAlert();
    const el2 = createAlert();
    const renderable = new Set<Element>();
    const options = {
      isRenderable: (el: Element) => renderable.has(el),
      announce,
    };

    tracker.handle(el1, options);
    tracker.handle(el2, options);
    expect(announce).not.toHaveBeenCalled();

    // el1のみ表示可能にする
    renderable.add(el1);
    tracker.recheckPending(options);
    expect(announce).toHaveBeenCalledTimes(1);
    expect(announce).toHaveBeenCalledWith(el1);

    // el2も表示可能にする
    renderable.add(el2);
    tracker.recheckPending(options);
    expect(announce).toHaveBeenCalledTimes(2);
    expect(announce).toHaveBeenCalledWith(el2);
  });
});
