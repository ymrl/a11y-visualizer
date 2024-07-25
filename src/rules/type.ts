import { Table } from "../table";

export type RuleResultError = {
  type: "error";
  ruleName: string;
  message: string;
};
export type RuleResultWarning = {
  type: "warning";
  ruleName: string;
  message: string;
};
export type RuleResultMessage = RuleResultError | RuleResultWarning;

export type RuleResultContent = {
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
    | "list";
  ruleName: string;
  content: string;
  contentLabel?: string;
};

export type RuleResultState = {
  type: "state";
  ruleName: string;
  state: string;
};

export type RuleResult =
  | RuleResultMessage
  | RuleResultContent
  | RuleResultState;

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
