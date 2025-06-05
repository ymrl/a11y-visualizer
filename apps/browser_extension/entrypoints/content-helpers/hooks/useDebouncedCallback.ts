import React from "react";
export const useDebouncedCallback = <
  F extends (...args: Parameters<F>) => void,
>(
  fn: F,
  delay: number,
  deps: React.DependencyList,
): ((...args: Parameters<F>) => void) => {
  const timeoutIdRef = React.useRef<number | null>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = React.useCallback(fn, [...deps]);

  return React.useCallback(
    (...args: Parameters<F>) => {
      if (timeoutIdRef.current) {
        return;
      }
      timeoutIdRef.current = window.setTimeout(() => {
        callback(...args);
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = null;
        }
      }, delay);
    },
    [delay, callback],
  );
};
