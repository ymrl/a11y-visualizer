import { getClosestByRoles } from "./getClosestByRoles";
import type { KnownRole } from "./KnownRole";

const ChildrenPresentationalRoles: KnownRole[] = [
  "button",
  "checkbox",
  "img",
  "menuitemcheckbox",
  "menuitemradio",
  "meter",
  "option",
  "progressbar",
  "radio",
  "scrollbar",
  "separator",
  "slider",
  "switch",
  "tab",
] as const;

export const isPresentationalChildren = (el: Element): boolean =>
  !!(
    el.parentElement &&
    (getClosestByRoles(el.parentElement, ChildrenPresentationalRoles) ||
      el.parentElement.closest("button"))
  );
