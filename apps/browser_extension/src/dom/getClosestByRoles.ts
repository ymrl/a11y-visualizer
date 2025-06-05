import { getKnownRole, KnownRole } from "./getKnownRole";

export const getClosestByRoles = (
  el: Element,
  roles: KnownRole[],
): Element | null => {
  const role = getKnownRole(el);
  if (role) {
    if (roles.includes(role)) {
      return el;
    }
  }

  const parent = el.parentElement;
  if (!parent) {
    return null;
  }
  return getClosestByRoles(parent, roles);
};
