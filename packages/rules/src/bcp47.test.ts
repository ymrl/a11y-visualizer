import { describe, expect, test } from "vitest";
import { isWellFormedLanguageTag } from "./bcp47";

describe("isWellFormedLanguageTag", () => {
  test.each([
    "en",
    "ja",
    "EN",
    "en-US",
    "en-us",
    "zh-Hans",
    "zh-Hans-CN",
    "es-419",
    "de-CH-1901",
    "sl-rozaj-biske",
    "en-a-bbb-x-a-ccc",
    "x-private",
    "hak", // 3-letter primary language
    "i-klingon", // grandfathered
    "zh-min-nan", // grandfathered
  ])("valid: %s", (tag) => {
    expect(isWellFormedLanguageTag(tag)).toBe(true);
  });

  test.each([
    "japanese",
    "english",
    "en_US", // underscore is not allowed
    "en-", // trailing hyphen
    "-en",
    "123",
    "e",
    "a-DE",
    "en--US",
    "",
  ])("invalid: %s", (tag) => {
    expect(isWellFormedLanguageTag(tag)).toBe(false);
  });
});
