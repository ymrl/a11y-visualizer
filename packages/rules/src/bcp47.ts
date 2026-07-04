/**
 * BCP 47 (RFC 5646) の言語タグとして構文的に妥当かどうかを判定する
 *
 * 言語コードの実在性（例: `jp` が言語として存在するか）ではなく、
 * あくまで書式（well-formedness）のみを検証する。`japanese` のような
 * 明らかに言語タグでない値を検出する用途を想定している。
 */

// RFC 5646 で定義される grandfathered（irregular / regular）タグ。
// 正規表現の一般ルールに当てはまらないため個別に許可する（小文字で保持）
const GRANDFATHERED = [
  // irregular
  "en-gb-oed",
  "i-ami",
  "i-bnn",
  "i-default",
  "i-enochian",
  "i-hak",
  "i-klingon",
  "i-lux",
  "i-mingo",
  "i-navajo",
  "i-pwn",
  "i-tao",
  "i-tay",
  "i-tsu",
  "sgn-be-fr",
  "sgn-be-nl",
  "sgn-ch-de",
  // regular
  "art-lojban",
  "cel-gaulish",
  "no-bok",
  "no-nyn",
  "zh-guoyu",
  "zh-hakka",
  "zh-min",
  "zh-min-nan",
  "zh-xiang",
];

// RFC 5646 の langtag の ABNF を反映した正規表現（大文字小文字は無視）。
// ABNF 上は 5〜8文字の primary language subtag も許容されるが、IANA レジストリ
// に実在せず `japanese` / `english` のような誤った値を通してしまうため、
// 実用上は 2〜4文字（ISO 639 の 2〜3文字 + extlang、または将来予約の4文字）に限定する
const language = "(?:[a-z]{2,3}(?:-[a-z]{3}){0,3}|[a-z]{4})";
const script = "(?:-[a-z]{4})?";
const region = "(?:-(?:[a-z]{2}|[0-9]{3}))?";
const variant = "(?:-(?:[a-z0-9]{5,8}|[0-9][a-z0-9]{3}))*";
const extension = "(?:-[0-9a-wy-z](?:-[a-z0-9]{2,8})+)*";
const privateuse = "(?:-x(?:-[a-z0-9]{1,8})+)?";
const langtag = `${language}${script}${region}${variant}${extension}${privateuse}`;
const privateuseOnly = "x(?:-[a-z0-9]{1,8})+";

const LANGUAGE_TAG_PATTERN = new RegExp(
  `^(?:${langtag}|${privateuseOnly})$`,
  "i",
);

/**
 * 言語タグが BCP 47 (RFC 5646) の書式として妥当かどうかを返す
 *
 * @param tag - 検証する言語タグの文字列
 * @returns 書式として妥当な場合は true
 */
export const isWellFormedLanguageTag = (tag: string): boolean => {
  if (GRANDFATHERED.includes(tag.toLowerCase())) {
    return true;
  }
  return LANGUAGE_TAG_PATTERN.test(tag);
};
