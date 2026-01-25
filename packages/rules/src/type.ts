import type { Table } from "@a11y-visualizer/table";

type RuleResultBase = {
  ruleName: string;
  type: unknown;
};

export type RuleResultError = RuleResultBase & {
  type: "error";
  message: string;
  messageParams?: Record<string, string>;
};
export type RuleResultWarning = RuleResultBase & {
  type: "warning";
  message: string;
  messageParams?: Record<string, string>;
};
export type RuleResultMessage = RuleResultError | RuleResultWarning;

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
  "ariaAttribute",
  "tabIndex",
] as const;

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
    | "ariaAttribute"
    | "tabIndex";
  content: string;
  contentLabel?: string;
};

export const RAW_CONTENT_TYPES = [
  "name",
  "description",
  "lang",
  "linkTarget",
  "pageTitle",
  "tableHeader",
  "ariaAttribute",
  "tabIndex",
] as const;

export type RuleResultRawContent = RuleResultBase & {
  type: (typeof RAW_CONTENT_TYPES)[number];
  content: string;
  contentLabel?: string;
};

export type RuleResultState = RuleResultBase & {
  type: "state";
  state: string;
};

export type RuleResultAriaAttributes = RuleResultBase & {
  type: "ariaAttributes";
  attributes: Array<{
    name: string;
    value: string;
  }>;
};

export type RuleResult =
  | RuleResultMessage
  | RuleResultContent
  | RuleResultState
  | RuleResultAriaAttributes;

type RuleOptions = {
  enabled: boolean;
};

export type RuleEvaluationCondition = {
  name?: string;
  role?: string | null;
  elementDocument?: Document;
  elementWindow?: Window;
  tables?: Table[];
  srcdoc?: boolean;
  shadowRoots?: ShadowRoot[];
};

export type RuleEvaluation<
  Options extends RuleOptions = RuleOptions,
  Condition extends RuleEvaluationCondition = RuleEvaluationCondition,
> = (
  element: Element,
  options: Options,
  condition: Condition,
) => RuleResult[] | undefined;

export type RuleObject<
  Options extends RuleOptions = RuleOptions,
  Condition extends RuleEvaluationCondition = RuleEvaluationCondition,
> = {
  ruleName: string;
  evaluate: RuleEvaluation<Options, Condition>;
  defaultOptions: Options;
  tagNames?: readonly string[];
  roles?: readonly string[];
  selectors?: readonly string[];
};
