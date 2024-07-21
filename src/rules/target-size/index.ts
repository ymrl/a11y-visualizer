import { isInline } from "../../dom/isInline";
import { isDefaultSize } from "../../dom/isDefaultSize";
import { RuleObject } from "../type";

const ruleName = "target-size";
const defaultOptions = { enabled: true };

export const TargetSize: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames: ["button", "select", "textarea"],
  roles: [
    "button",
    "menuitem",
    "tab",
    "checkbox",
    "combobox",
    "listbox",
    "radio",
    "searchbox",
    "slider",
    "spinbutton",
    "switch",
    "textbox",
    "menuitemcheckbox",
    "menuitemradio",
    "link",
  ],
  selectors: [
    'input:not([type="hidden"])',
    "details > summary:first-child",
    "a[href]",
    "area[href]",
  ],
  evaluate: (
    element,
    { enabled },
    {
      elementDocument = element.ownerDocument,
      elementWindow = elementDocument.defaultView || window,
    },
  ) => {
    if (!enabled) {
      return undefined;
    }
    if (
      isSmallTarget(element, elementDocument, elementWindow) &&
      !(isInline(element) || isDefaultSize(element))
    ) {
      return [
        {
          type: "warning",
          message: "Small target",
          ruleName,
        },
      ];
    }
    return undefined;
  },
};

const isSmallTarget = (
  element: Element,
  elementDocument: Document,
  elementWindow: Window,
): boolean => {
  const rect = element.getBoundingClientRect();
  const style = elementWindow.getComputedStyle(element);
  const { display } = style;

  if (rect.width >= 24 && rect.height >= 24) {
    return false;
  }

  const checkboxLabel =
    isCheckboxOrRadiobutton(element) &&
    ((element.id &&
      elementDocument.querySelector(`[for="${CSS.escape(element.id)}"]`)) ||
      element.closest("label"));
  // チェックボックス・ラジオボタンはラベルの大きさも見る
  if (checkboxLabel) {
    return isSmallTarget(checkboxLabel, elementDocument, elementWindow);
  }

  // inlineの場合は、子要素に24px以上のものがあればfalse
  if (
    display === "inline" &&
    [...element.children].some((child) => {
      // チェックボックス・ラジオボタンはlabelと無限ループになるので除外
      if (isCheckboxOrRadiobutton(child)) {
        return false;
      }
      return !isSmallTarget(child, elementDocument, elementWindow);
    })
  ) {
    return false;
  }

  return true;
};

const isCheckboxOrRadiobutton = (element: Element): boolean => {
  const tagName = element.tagName.toLowerCase();
  const typeAttr = element.getAttribute("type");
  return (
    tagName === "input" && (typeAttr === "checkbox" || typeAttr === "radio")
  );
};
