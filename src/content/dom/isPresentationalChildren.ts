import { getClosestByRoles } from "./getClosestByRoles";
import { KnownRole } from "./getKnownRole";
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
