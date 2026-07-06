import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { rafThrottle } from "./rafThrottle";

describe("rafThrottle()", () => {
  let rafCallbacks: Map<number, FrameRequestCallback>;
  let rafId: number;

  const flushAnimationFrames = () => {
    const callbacks = [...rafCallbacks.values()];
    rafCallbacks.clear();
    for (const callback of callbacks) {
      callback(0);
    }
  };

  beforeEach(() => {
    rafCallbacks = new Map();
    rafId = 0;
    vi.stubGlobal(
      "requestAnimationFrame",
      (callback: FrameRequestCallback): number => {
        rafId += 1;
        rafCallbacks.set(rafId, callback);
        return rafId;
      },
    );
    vi.stubGlobal("cancelAnimationFrame", (id: number): void => {
      rafCallbacks.delete(id);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("フレームが来るまで実行されない", () => {
    const fn = vi.fn();
    const throttled = rafThrottle(fn);
    throttled(1);
    expect(fn).not.toHaveBeenCalled();
    flushAnimationFrames();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);
  });

  test("1フレーム内の複数回の呼び出しは、最後の引数で1回だけ実行される", () => {
    const fn = vi.fn();
    const throttled = rafThrottle(fn);
    throttled(1);
    throttled(2);
    throttled(3);
    flushAnimationFrames();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(3);
  });

  test("フレームの後は再度スケジュールできる", () => {
    const fn = vi.fn();
    const throttled = rafThrottle(fn);
    throttled(1);
    flushAnimationFrames();
    throttled(2);
    flushAnimationFrames();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(2);
  });

  test("cancel()で保留中の実行をキャンセルできる", () => {
    const fn = vi.fn();
    const throttled = rafThrottle(fn);
    throttled(1);
    throttled.cancel();
    flushAnimationFrames();
    expect(fn).not.toHaveBeenCalled();
  });

  test("cancel()の後も再度スケジュールできる", () => {
    const fn = vi.fn();
    const throttled = rafThrottle(fn);
    throttled(1);
    throttled.cancel();
    throttled(2);
    flushAnimationFrames();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2);
  });
});
