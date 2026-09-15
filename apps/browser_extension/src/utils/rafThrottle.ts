export type RafThrottled<Args extends unknown[]> = ((...args: Args) => void) & {
  cancel: () => void;
};

/**
 * 関数の呼び出しをrequestAnimationFrameで間引く
 *
 * 1フレーム内に複数回呼び出された場合、最後の引数で1回だけ実行する。
 * mousemoveなどの高頻度イベントによる再レンダリングを抑えるために使う
 *
 * @param fn - 間引いて実行する関数
 * @returns 間引かれた関数。`cancel()`で保留中の実行をキャンセルできる
 */
export const rafThrottle = <Args extends unknown[]>(
  fn: (...args: Args) => void,
): RafThrottled<Args> => {
  let rafId: number | null = null;
  let lastArgs: Args | null = null;

  const throttled = (...args: Args) => {
    lastArgs = args;
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      if (lastArgs) {
        fn(...lastArgs);
      }
    });
  };

  throttled.cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    lastArgs = null;
  };

  return throttled;
};
