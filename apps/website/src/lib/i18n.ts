// Use interface instead of a recursive alias to avoid
// "type alias circularly references itself" errors in some toolchains.
export interface Dict {
  [key: string]: string | Dict | undefined;
}

function getDeep(dict: Dict | undefined, path: string[]): string | undefined {
  let cur: unknown = dict;
  for (const p of path) {
    if (typeof cur !== "object" || cur === null) return undefined;
    cur = (cur as Dict)[p];
  }
  return typeof cur === "string" ? cur : undefined;
}

export type TFn = (key: string) => string;

/**
 * Create a translator bound to provided dictionaries.
 * - `localeDict`: the page/component-specific language dictionary (near the file)
 * - `fallbackDict`: English dictionary for fallback
 */
export function createLocalT(
  localeDict: Dict | undefined,
  fallbackDict: Dict,
): TFn {
  return (key: string): string => {
    const path = key.split(".");
    const valLang = getDeep(localeDict, path);
    if (valLang !== undefined) return valLang;
    const valEn = getDeep(fallbackDict, path);
    if (valEn !== undefined) return valEn;
    return key;
  };
}
