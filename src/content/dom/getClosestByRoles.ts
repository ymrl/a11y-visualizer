import { getKnownRole, KnownRole } from "./getKnownRole";

export const getClosestByRoles = (
  el: Element,
  roles: KnownRole[],
): Element | null => {
  const parent = el.parentElement;
  if (!parent) {
    return null;
  }
  const role = getKnownRole(parent);
  if (role) {
    if (roles.includes(role)) {
      return parent;
    }
  }
  return getClosestByRoles(parent, roles);
};
