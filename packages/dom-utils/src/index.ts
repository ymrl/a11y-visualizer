// Types

export { getClosestByRoles } from "./getClosestByRoles";
export {
  COMPUTED_ROLES,
  type ComputedRole,
  computedRoleToKnownRole,
  getComputedImplictRole,
  getImplicitRole,
} from "./getComputedImplicitRole";
// Shadow DOM utilities
export { getElementByIdFromRoots } from "./getElementByIdFromRoots";
// Role utilities
export { getKnownRole } from "./getKnownRole";

// Interactive element utilities
export { hasInteractiveDescendant } from "./hasInteractiveDescendant";
export { hasTabIndexDescendant } from "./hasTabIndexDescendant";
// Visibility utilities
export { isAriaHidden, isInAriaHidden } from "./isAriaHidden";
// Size and display utilities
export { isDefaultSize } from "./isDefaultSize";
export { FOCUSABLE_SELECTOR, isFocusable } from "./isFocusable";
export { isHidden } from "./isHidden";
export { isInline } from "./isInline";
export { isPresentationalChildren } from "./isPresentationalChildren";
export { type KnownRole, knownRoles } from "./KnownRole";
export { querySelectorAllFromRoots } from "./querySelectorAllFromRoots";
