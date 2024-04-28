import { computeAccessibleName } from "dom-accessibility-api";
import { ElementTip } from "../../types";
import { isAriaHidden, isFocusable, isHidden } from "../index";

export const FormSelectors = [
  "input:not([type='hidden'])",
  "textarea",
  "select",
  '[role="checkbox"]',
  '[role="combobox"]',
  '[role="radio"]',
  '[role="searchbox"]',
  '[role="slider"]',
  '[role="spinbutton"]',
  '[role="switch"]',
  '[role="textbox"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  "label",
] as const;

const LABELABLE_SELECTOR = [
  "button",
  "input:not([type='hidden'])",
  "meter",
  "output",
  "progress",
  "select",
  "textarea",
].join(",");

export const formTips = (el: Element): ElementTip[] => {
  const result: ElementTip[] = [];
  const tagName = el.tagName.toLowerCase();
  const typeAttr = el.getAttribute("type");
  const roleAttr = el.getAttribute("role") || "";
  const hasInputTag =
    (tagName === "input" &&
      (typeAttr === null ||
        (typeAttr &&
          !["button", "submit", "reset", "image", "hidden"].includes(
            typeAttr,
          )))) ||
    tagName === "textarea" ||
    tagName === "select";

  const hasInputRole = [
    "checkbox",
    "combobox",
    "radio",
    "searchbox",
    "slider",
    "spinbutton",
    "switch",
    "textbox",
    "menuitemcheckbox",
    "menuitemradio",
  ].includes(roleAttr);

  if (hasInputTag || hasInputRole) {
    const name = computeAccessibleName(el);
    if (name) {
      result.push({ type: "name", content: name });
    } else if (!isAriaHidden(el)) {
      result.push({ type: "error", content: "messages.noName" });
    }
    if (!isFocusable(el)) {
      result.push({ type: "error", content: "messages.notFocusable" });
    }
  }
  if (tagName === "input" && typeAttr === "radio") {
    const nameAttr = el.getAttribute("name");
    if (!nameAttr) {
      result.push({ type: "error", content: "messages.noNameAttr" });
    } else {
      const form = el.closest("form");
      const radios = (form || el.ownerDocument).querySelectorAll(
        `input[type="radio"][name="${nameAttr}"]`,
      );
      if (radios.length < 2) {
        result.push({ type: "error", content: "messages.noRadioGroup" });
      }
    }
  }

  if (tagName === "label") {
    const forAttr = el.getAttribute("for");
    const forElement = forAttr && el.ownerDocument.getElementById(forAttr);
    const controlByFor =
      forElement && forElement.matches(LABELABLE_SELECTOR) ? forElement : null;
    const controlInside = el.querySelector(LABELABLE_SELECTOR);
    if (
      (!controlByFor && !controlInside) ||
      (controlByFor && isHidden(controlByFor)) ||
      (controlInside && isHidden(controlInside))
    ) {
      result.push({ type: "warning", content: "messages.noControlForLabel" });
    }
  }
  return result;
};
