import type { RuleObject } from "../type";

const ruleName = "page-title";
const defaultOptions = { enabled: true };

export const PageTitle: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["body"],
  evaluate: (
    element,
    { enabled },
    { elementDocument = element.ownerDocument, srcdoc = false },
  ) => {
    if (!enabled) {
      return undefined;
    }
    const title = elementDocument.title;
    if (title) {
      return [
        {
          type: "pageTitle",
          ruleName,
          content: `${title}`,
        },
      ];
    }
    if (!srcdoc && !title) {
      return [
        {
          type: "error",
          ruleName,
          message: "No <title> element",
        },
      ];
    }
  },
};
