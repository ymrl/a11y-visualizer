import { ElementTip } from "../../types";
import { isAriaHidden } from "../isAriaHidden";

export const AriraHiddenSelectors = ['[aria-hidden="true"]'] as const;

export const ariaHiddenTips = (el: Element): ElementTip[] =>
  isAriaHidden(el) ? [{ type: "warning", content: "messages.ariaHidden" }] : [];
