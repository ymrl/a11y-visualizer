import { describe, expect, test, vi } from "vitest";
import { createExternalStore } from "./createExternalStore";

describe("createExternalStore()", () => {
  test("初期値を取得できる", () => {
    const store = createExternalStore("en");
    expect(store.get()).toBe("en");
  });

  test("値を更新すると購読者に通知される", () => {
    const store = createExternalStore("en");
    const listener = vi.fn();
    store.subscribe(listener);
    store.set("ja");
    expect(store.get()).toBe("ja");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test("同じ値をセットしても通知されない", () => {
    const store = createExternalStore("en");
    const listener = vi.fn();
    store.subscribe(listener);
    store.set("en");
    expect(listener).not.toHaveBeenCalled();
  });

  test("購読解除すると通知されなくなる", () => {
    const store = createExternalStore("en");
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.set("ja");
    expect(listener).not.toHaveBeenCalled();
  });

  test("複数の購読者に通知される", () => {
    const store = createExternalStore(0);
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    store.subscribe(listener1);
    store.subscribe(listener2);
    store.set(1);
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });
});
