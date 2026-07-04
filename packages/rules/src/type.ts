import type { Table } from "@a11y-visualizer/table";

type RuleResultBase = {
  ruleName: string;
  type: unknown;
};

/**
 * ルールの評価結果のうち、明確なアクセシビリティ上の問題を表すもの
 *
 * `message` は翻訳キーとして扱われ、表示時に `messageParams` とともに
 * i18nで変換される
 */
export type RuleResultError = RuleResultBase & {
  type: "error";
  message: string;
  messageParams?: Record<string, string>;
};

/**
 * ルールの評価結果のうち、文脈によっては問題になりうる（偽陽性の可能性がある）
 * ことを表すもの
 *
 * `message` は翻訳キーとして扱われ、表示時に `messageParams` とともに
 * i18nで変換される
 */
export type RuleResultWarning = RuleResultBase & {
  type: "warning";
  message: string;
  messageParams?: Record<string, string>;
};

/** ユーザーにメッセージとして表示される評価結果（エラーまたは警告） */
export type RuleResultMessage = RuleResultError | RuleResultWarning;

/**
 * コンテンツ系の評価結果（{@link RuleResultContent}）の `type` に指定できる
 * 値の一覧。要素のアクセシブルな名前やロールなど、問題の指摘ではなく
 * 要素の情報の可視化として表示されるものを表す
 */
export const CONTENT_TYPES = [
  "name",
  "description",
  "role",
  "heading",
  "lang",
  "linkTarget",
  "pageTitle",
  "landmark",
  "tagName",
  "tableHeader",
  "tableSize",
  "tableCellPosition",
  "list",
  "listType",
  "roleDescription",
  "ariaAttribute",
  "tabIndex",
] as const;

/**
 * ルールの評価結果のうち、要素の情報（アクセシブルな名前、ロール、
 * 見出しレベルなど）をオーバーレイに表示するためのもの
 *
 * `content` が表示内容で、`type` の種類（{@link CONTENT_TYPES}）に応じて
 * アイコンや色分けがされる
 */
export type RuleResultContent = RuleResultBase & {
  type:
    | "name"
    | "description"
    | "role"
    | "heading"
    | "lang"
    | "linkTarget"
    | "pageTitle"
    | "landmark"
    | "tagName"
    | "tableHeader"
    | "tableSize"
    | "tableCellPosition"
    | "list"
    | "listType"
    | "roleDescription"
    | "ariaAttribute"
    | "tabIndex";
  content: string;
  contentLabel?: string;
};

/**
 * {@link CONTENT_TYPES} のうち、`content` をそのまま（翻訳せずに）表示する
 * 種類の一覧。ページ由来のテキスト（アクセシブルな名前や言語など）が
 * 該当し、表示時にi18nの変換を通さない判定に使う
 */
export const RAW_CONTENT_TYPES = [
  "name",
  "description",
  "lang",
  "linkTarget",
  "pageTitle",
  "tableHeader",
  "roleDescription",
  "ariaAttribute",
  "tabIndex",
] as const;

/**
 * コンテンツ系の評価結果のうち、`content` をそのまま（翻訳せずに）表示するもの
 */
export type RuleResultRawContent = RuleResultBase & {
  type: (typeof RAW_CONTENT_TYPES)[number];
  content: string;
  contentLabel?: string;
};

/**
 * ルールの評価結果のうち、要素の状態（チェック状態や展開状態など）を
 * 表すもの。`state` は翻訳キーとして扱われる
 */
export type RuleResultState = RuleResultBase & {
  type: "state";
  state: string;
};

/**
 * ルールの評価結果のうち、要素に指定されているaria-*属性の一覧を表すもの
 */
export type RuleResultAriaAttributes = RuleResultBase & {
  type: "ariaAttributes";
  attributes: Array<{
    name: string;
    value: string;
  }>;
};

/**
 * ルールの評価結果。各ルールの `evaluate` が返し、拡張機能が要素の
 * オーバーレイ（チップ）として表示する
 */
export type RuleResult =
  | RuleResultMessage
  | RuleResultContent
  | RuleResultState
  | RuleResultAriaAttributes;

type RuleOptions = {
  enabled: boolean;
};

/**
 * ルールの評価時に渡される、評価対象の周辺情報
 *
 * 呼び出し側で計算済みの値（アクセシブルな名前やロールなど）を渡すことで、
 * ルール内での再計算を省略する。省略された場合は各ルールが自前で計算する
 */
export type RuleEvaluationCondition = {
  /** 要素のアクセシブルな名前（計算済みの場合に渡す） */
  name?: string;
  /** 要素のロール（計算済みの場合に渡す） */
  role?: string | null;
  /** 要素が属するDocument */
  elementDocument?: Document;
  /** 要素が属するWindow */
  elementWindow?: Window;
  /**
   * 解析済みテーブルのキャッシュ。テーブル系ルールが同じテーブルを
   * 重複して解析しないよう、ページ内の評価で共有される
   */
  tables?: Table[];
  /** 評価対象がsrcdoc属性によるiframe内かどうか */
  srcdoc?: boolean;
  /** ページ内で収集されたShadowRootの配列（Shadow DOM内の要素の参照解決に使う） */
  shadowRoots?: ShadowRoot[];
};

/**
 * ルールの評価関数
 *
 * @param element - 評価対象の要素
 * @param options - ルールのオプション（`enabled: false` の場合は評価しない）
 * @param condition - 評価対象の周辺情報（{@link RuleEvaluationCondition}）
 * @returns 評価結果の配列。表示すべき結果がない場合はundefined
 */
export type RuleEvaluation<
  Options extends RuleOptions = RuleOptions,
  Condition extends RuleEvaluationCondition = RuleEvaluationCondition,
> = (
  element: Element,
  options: Options,
  condition: Condition,
) => RuleResult[] | undefined;

/**
 * アクセシビリティルールの定義
 *
 * 各ルールはこのインターフェースを実装したオブジェクトとして定義され、
 * `Rules` に登録される。`tagNames`・`roles`・`selectors` は評価対象の
 * 事前フィルタリング（`isRuleTargetElement`）に使われ、いずれも未指定の
 * 場合はすべての要素が対象になる
 */
export type RuleObject<
  Options extends RuleOptions = RuleOptions,
  Condition extends RuleEvaluationCondition = RuleEvaluationCondition,
> = {
  /** ルールの識別名（評価結果の `ruleName` に設定される） */
  ruleName: string;
  /** ルールの評価関数 */
  evaluate: RuleEvaluation<Options, Condition>;
  /** ルールのデフォルトオプション */
  defaultOptions: Options;
  /** 評価対象とするタグ名の一覧 */
  tagNames?: readonly string[];
  /** 評価対象とするロールの一覧 */
  roles?: readonly string[];
  /** 評価対象とするCSSセレクタの一覧 */
  selectors?: readonly string[];
};
