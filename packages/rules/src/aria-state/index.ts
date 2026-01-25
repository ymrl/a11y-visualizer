import { getKnownRole, type KnownRole } from "@a11y-visualizer/dom-utils";
import {
  ARIA_ATTRIBUTE_ROLES,
  ARIA_ATTRIBUTE_VALUES,
  type AriaAttribute,
} from "../aria-validation/ariaSpec";
import type { RuleObject, RuleResultMessage, RuleResultState } from "../type";

const ruleName = "aria-state";
const defaultOptions = { enabled: true };

/**
 * ARIA attributes that AriaState rule handles for display.
 * These attributes have corresponding native HTML functionality.
 */
const ARIA_STATE_RULE_ATTRIBUTES = [
  "aria-busy",
  "aria-current",
  "aria-checked",
  "aria-disabled",
  "aria-expanded",
  "aria-invalid",
  "aria-pressed",
  "aria-selected",
  "aria-required",
  "aria-readonly",
] as const;

/**
 * Global ARIA attributes that AriaState rule should check on any element.
 * These are global attributes that this rule specifically handles.
 */
const GLOBAL_ARIA_STATE_ATTRIBUTES = ["aria-busy", "aria-current"] as const;

/**
 * Human-readable names for ARIA attributes handled by AriaState rule.
 */
const ARIA_STATE_RULE_NAMES: Record<string, string> = {
  "aria-busy": "Busy",
  "aria-current": "Current",
  "aria-checked": "Checked",
  "aria-disabled": "Disabled",
  "aria-expanded": "Expanded",
  "aria-invalid": "Invalid",
  "aria-pressed": "Pressed",
  "aria-selected": "Selected",
  "aria-required": "Required",
  "aria-readonly": "Read Only",
} as const;

type AriaStateRuleAttribute = (typeof ARIA_STATE_RULE_ATTRIBUTES)[number];

const getNativeCheckedValue = (element: Element) => {
  if (
    element.tagName.toLowerCase() === "input" &&
    ["checkbox", "radio"].includes(element.getAttribute("type") || "")
  ) {
    return (element as HTMLInputElement).checked ? "true" : "false";
  }
  return null;
};

const getNativeDisabledValue = (element: Element) => {
  const tagName = element.tagName.toLowerCase();
  if (
    [
      "button",
      "fieldset",
      "optgroup",
      "option",
      "select",
      "textarea",
      "input",
    ].includes(tagName)
  ) {
    return (element as HTMLInputElement).disabled
      ? "true"
      : element.closest("fieldset[disabled]")
        ? "true"
        : null;
  }
  return null;
};

const getNativeExpandedValue = (element: Element) => {
  const tagName = element.tagName.toLowerCase();
  if (
    tagName === "summary" &&
    element.matches("details > summary:first-child")
  ) {
    return element.closest("details")?.open ? "true" : "false";
  }
  return null;
};

const getNativeInvalidValue = (element: Element) => {
  const tagName = element.tagName.toLowerCase();
  if (["input", "select", "textarea"].includes(tagName)) {
    const validity = (element as HTMLInputElement).validity;
    if (!validity) {
      return null;
    }
    return validity.valid ? null : "true";
  }
  return null;
};
const getNativeRequiredValue = (element: Element) => {
  const tagName = element.tagName.toLowerCase();
  if (["input", "select", "textarea"].includes(tagName)) {
    const required = (element as HTMLInputElement).required;
    return required ? "true" : null;
  }
  return null;
};

const getNativeReadonlyValue = (element: Element) => {
  const tagName = element.tagName.toLowerCase();
  if (["input", "textarea"].includes(tagName)) {
    const readOnly = (element as HTMLInputElement).readOnly;
    return readOnly ? "true" : null;
  }
  return null;
};

const getNativeValue = (state: AriaStateRuleAttribute, element: Element) => {
  switch (state) {
    case "aria-checked":
      return getNativeCheckedValue(element);
    case "aria-disabled":
      return getNativeDisabledValue(element);
    case "aria-expanded":
      return getNativeExpandedValue(element);
    case "aria-invalid":
      return getNativeInvalidValue(element);
    case "aria-required":
      return getNativeRequiredValue(element);
    case "aria-readonly":
      return getNativeReadonlyValue(element);
    default:
      return null;
  }
};

/**
 * ネイティブでもARIAでも状態を持つARIA属性を中心に、その状態を表示する
 * WAI-ARIAの仕様に従い、ネイティブの値が存在する場合はそれを優先する
 */
export const AriaState: RuleObject = {
  ruleName,
  defaultOptions,
  evaluate: (element, { enabled }, { role = getKnownRole(element) }) => {
    if (!enabled) {
      return undefined;
    }
    const result: (RuleResultState | RuleResultMessage)[] = [];

    for (const state of GLOBAL_ARIA_STATE_ATTRIBUTES) {
      const value = element.getAttribute(state);
      const validValues = ARIA_ATTRIBUTE_VALUES[state];
      if (value && Array.isArray(validValues) && validValues.includes(value)) {
        result.push({
          type: "state",
          state: `${ARIA_STATE_RULE_NAMES[state]}: ${value}`,
          ruleName,
        });
      }
    }

    for (const state of ARIA_STATE_RULE_ATTRIBUTES) {
      if ((GLOBAL_ARIA_STATE_ATTRIBUTES as readonly string[]).includes(state)) {
        continue; // Already handled above
      }

      const validRoles = ARIA_ATTRIBUTE_ROLES[state as AriaAttribute];
      if (
        role &&
        validRoles !== "all" &&
        validRoles.includes(role as KnownRole)
      ) {
        const ariaStateValue = element.getAttribute(state);
        const nativeValue = getNativeValue(state, element);
        const value = nativeValue || ariaStateValue;
        const validValues = ARIA_ATTRIBUTE_VALUES[state as AriaAttribute];
        if (
          value &&
          Array.isArray(validValues) &&
          validValues.includes(value)
        ) {
          result.push({
            type: "state",
            state: `${ARIA_STATE_RULE_NAMES[state]}: ${value}`,
            ruleName,
          });
        }
      }
    }
    if (result.length > 0) {
      return result;
    }
    return undefined;
  },
};
