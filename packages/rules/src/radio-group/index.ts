import {
  getElementByIdFromRoots,
  querySelectorAllFromRoots,
} from "@a11y-visualizer/dom-utils";
import type { RuleObject } from "../type";

const ruleName = "radio-group";
const defaultOptions = {
  enabled: true,
};

/**
 * 要素のフォームオーナーを求める。
 * form属性が指定されていればそのIDで参照されるform要素が、なければ
 * 最も近い祖先のform要素がフォームオーナーになる（HTML仕様準拠）。
 * 同名のラジオボタンでもフォームオーナーが異なれば同じグループにならない
 */
const getFormOwner = (
  element: Element,
  elementDocument: Document,
  shadowRoots?: ShadowRoot[],
): Element | null => {
  const formId = element.getAttribute("form");
  if (formId !== null) {
    const owner = getElementByIdFromRoots(formId, elementDocument, shadowRoots);
    return owner?.tagName.toLowerCase() === "form" ? owner : null;
  }
  return element.closest("form");
};
export const RadioGroup: RuleObject = {
  ruleName,
  defaultOptions,
  selectors: ['input[type="radio"]'],
  evaluate: (
    element,
    { enabled } = defaultOptions,
    { elementDocument = element.ownerDocument, shadowRoots } = {},
  ) => {
    if (!enabled) {
      return undefined;
    }

    const nameAttr = element.getAttribute("name");
    if (!nameAttr) {
      return [
        {
          type: "error",
          message: "No name attribute",
          ruleName,
        },
      ];
    } else {
      // 同名でもフォームオーナーが一致するラジオボタンだけが同じグループになる
      const owner = getFormOwner(element, elementDocument, shadowRoots);
      const radios = querySelectorAllFromRoots(
        `input[type="radio"][name="${CSS.escape(nameAttr)}"]`,
        elementDocument,
        shadowRoots,
      ).filter(
        (radio) => getFormOwner(radio, elementDocument, shadowRoots) === owner,
      );
      if (radios.length < 2) {
        return [
          {
            type: "error",
            message: "Ungrouped radio button",
            ruleName,
          },
        ];
      }
    }
  },
};
