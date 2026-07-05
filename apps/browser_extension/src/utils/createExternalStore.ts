export type ExternalStore<T> = {
  get: () => T;
  set: (newValue: T) => void;
  subscribe: (listener: () => void) => () => void;
};

/**
 * React.useSyncExternalStoreで購読できる単純なストアを作成する
 *
 * モジュールスコープで状態を一元管理し、多数のコンポーネントから
 * 参照される値(言語設定など)を、コンポーネントごとの読み込みや
 * リスナー登録なしで共有するために使う
 *
 * @param initialValue - 初期値
 * @returns 値の取得・更新・購読ができるストア
 */
export const createExternalStore = <T>(initialValue: T): ExternalStore<T> => {
  let value = initialValue;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set: (newValue: T) => {
      if (Object.is(newValue, value)) return;
      value = newValue;
      for (const listener of [...listeners]) {
        listener();
      }
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};
