/**
 * WAI-ARIA 1.2 specification data
 *
 * This file contains the complete WAI-ARIA specification data used by multiple rules:
 * - AriaValidation rule: Validates all ARIA attributes for value and role compatibility
 * - AriaState rule: Uses subset of attributes for display purposes
 */

// ============================================================================
// ALL ARIA ATTRIBUTES
// ============================================================================

/**
 * All ARIA attributes defined in WAI-ARIA 1.2 specification.
 * This is the single source of truth for all ARIA attributes.
 */
export const ALL_ARIA_ATTRIBUTES = [
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-braillelabel",
  "aria-brailleroledescription",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colindextext",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-description",
  "aria-details",
  "aria-disabled",
  "aria-dropeffect",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-grabbed",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowindextext",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
] as const;

export type AriaAttribute = (typeof ALL_ARIA_ATTRIBUTES)[number];

// ============================================================================
// VALID VALUES FOR ARIA ATTRIBUTES
// ============================================================================

/**
 * Valid values for all ARIA attributes.
 * Used by both AriaState (for display) and AriaValidation (for validation).
 */
export const ARIA_ATTRIBUTE_VALUES: Record<
  AriaAttribute,
  | string[]
  | "any"
  | "id-reference"
  | "id-reference-list"
  | "integer"
  | "number"
  | { multipleValues: string[] }
> = {
  "aria-activedescendant": "id-reference",
  "aria-atomic": ["true", "false"],
  "aria-autocomplete": ["none", "inline", "list", "both"],
  "aria-braillelabel": "any",
  "aria-brailleroledescription": "any",
  "aria-busy": ["true", "false"],
  "aria-checked": ["true", "false", "mixed", "undefined"],
  "aria-colcount": "integer",
  "aria-colindex": "integer",
  "aria-colindextext": "any",
  "aria-colspan": "integer",
  "aria-controls": "id-reference-list",
  "aria-current": ["true", "false", "page", "step", "location", "date", "time"],
  "aria-describedby": "id-reference-list",
  "aria-description": "any",
  "aria-details": "id-reference",
  "aria-disabled": ["true", "false"],
  "aria-dropeffect": ["none", "copy", "execute", "link", "move", "popup"],
  "aria-errormessage": "id-reference",
  "aria-expanded": ["true", "false", "undefined"],
  "aria-flowto": "id-reference-list",
  "aria-grabbed": ["true", "false", "undefined"],
  "aria-haspopup": [
    "false",
    "true",
    "menu",
    "listbox",
    "tree",
    "grid",
    "dialog",
  ],
  "aria-hidden": ["true", "false"],
  "aria-invalid": ["true", "false", "grammar", "spelling"],
  "aria-keyshortcuts": "any",
  "aria-label": "any",
  "aria-labelledby": "id-reference-list",
  "aria-level": "integer",
  "aria-live": ["off", "polite", "assertive"],
  "aria-modal": ["true", "false"],
  "aria-multiline": ["true", "false"],
  "aria-multiselectable": ["true", "false"],
  "aria-orientation": ["horizontal", "vertical", "undefined"],
  "aria-owns": "id-reference-list",
  "aria-placeholder": "any",
  "aria-posinset": "integer",
  "aria-pressed": ["true", "false", "mixed", "undefined"],
  "aria-readonly": ["true", "false"],
  "aria-relevant": { multipleValues: ["additions", "removals", "text", "all"] },
  "aria-required": ["true", "false"],
  "aria-roledescription": "any",
  "aria-rowcount": "integer",
  "aria-rowindex": "integer",
  "aria-rowindextext": "any",
  "aria-rowspan": "integer",
  "aria-selected": ["true", "false", "undefined"],
  "aria-setsize": "integer",
  "aria-sort": ["none", "ascending", "descending", "other"],
  "aria-valuemax": "number",
  "aria-valuemin": "number",
  "aria-valuenow": "number",
  "aria-valuetext": "any",
} as const;

// ============================================================================
// ROLE COMPATIBILITY
// ============================================================================

/**
 * Roles that can use each ARIA attribute.
 * Used by AriaValidation rule for role compatibility validation.
 */
export const ARIA_ATTRIBUTE_ROLES: Record<AriaAttribute, string[] | "all"> = {
  "aria-activedescendant": [
    "application",
    "combobox",
    "composite",
    "group",
    "textbox",
    "columnheader",
    "grid",
    "gridcell",
    "listbox",
    "menu",
    "menubar",
    "radiogroup",
    "row",
    "rowheader",
    "searchbox",
    "select",
    "tablist",
    "tree",
    "treegrid",
    "treeitem",
  ],
  "aria-atomic": "all", // global
  "aria-autocomplete": ["combobox", "textbox", "searchbox"],
  "aria-braillelabel": "all", // global
  "aria-brailleroledescription": "all", // global
  "aria-busy": "all", // global
  "aria-checked": [
    "checkbox",
    "menuitemcheckbox",
    "option",
    "radio",
    "switch",
    "menuitemradio",
    "treeitem",
  ],
  "aria-colcount": ["table", "grid", "treegrid"],
  "aria-colindex": ["cell", "columnheader", "gridcell", "row", "rowheader"],
  "aria-colindextext": ["cell", "columnheader", "gridcell", "row", "rowheader"],
  "aria-colspan": ["cell", "columnheader", "gridcell", "rowheader"],
  "aria-controls": "all", // global
  "aria-current": "all", // global
  "aria-describedby": "all", // global
  "aria-description": "all", // global
  "aria-details": "all", // global
  "aria-disabled": [
    "application",
    "button",
    "composite",
    "gridcell",
    "group",
    "input",
    "link",
    "menuitem",
    "scrollbar",
    "separator",
    "tab",
    "checkbox",
    "columnheader",
    "combobox",
    "grid",
    "listbox",
    "menu",
    "menubar",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "radio",
    "radiogroup",
    "row",
    "rowheader",
    "searchbox",
    "select",
    "slider",
    "spinbutton",
    "switch",
    "tablist",
    "textbox",
    "toolbar",
    "tree",
    "treegrid",
    "treeitem",
  ],
  "aria-dropeffect": "all", // global (deprecated)
  "aria-errormessage": "all", // global
  "aria-expanded": [
    "application",
    "button",
    "checkbox",
    "combobox",
    "gridcell",
    "link",
    "listbox",
    "menuitem",
    "row",
    "rowheader",
    "tab",
    "treeitem",
    "columnheader",
    "menuitemcheckbox",
    "menuitemradio",
    "switch",
  ],
  "aria-flowto": "all", // global
  "aria-grabbed": "all", // global (deprecated)
  "aria-haspopup": "all", // global
  "aria-hidden": "all", // global
  "aria-invalid": [
    "application",
    "checkbox",
    "combobox",
    "gridcell",
    "listbox",
    "radiogroup",
    "slider",
    "spinbutton",
    "textbox",
    "tree",
    "columnheader",
    "rowheader",
    "searchbox",
    "switch",
    "treegrid",
  ],
  "aria-keyshortcuts": "all", // global
  "aria-label": "all", // global
  "aria-labelledby": "all", // global
  "aria-level": ["heading", "listitem", "row", "treeitem"],
  "aria-live": "all", // global
  "aria-modal": ["dialog"],
  "aria-multiline": ["textbox", "searchbox"],
  "aria-multiselectable": ["grid", "listbox", "tablist", "tree", "treegrid"],
  "aria-orientation": [
    "scrollbar",
    "select",
    "separator",
    "slider",
    "tablist",
    "toolbar",
    "listbox",
    "menu",
    "menubar",
    "radiogroup",
    "tree",
    "treegrid",
  ],
  "aria-owns": "all", // global
  "aria-placeholder": ["textbox", "searchbox"],
  "aria-posinset": [
    "article",
    "listitem",
    "menuitem",
    "option",
    "radio",
    "row", // only in treegrid
    "tab",
    "menuitemcheckbox",
    "menuitemradio",
    "treeitem",
  ],
  "aria-pressed": ["button"],
  "aria-readonly": [
    "checkbox",
    "combobox",
    "grid",
    "gridcell",
    "listbox",
    "radiogroup",
    "slider",
    "spinbutton",
    "textbox",
    "columnheader",
    "rowheader",
    "searchbox",
    "switch",
    "treegrid",
  ],
  "aria-relevant": "all", // global
  "aria-required": [
    "checkbox",
    "combobox",
    "gridcell",
    "listbox",
    "radiogroup",
    "spinbutton",
    "textbox",
    "tree",
    "columnheader",
    "rowheader",
    "searchbox",
    "switch",
    "treegrid",
  ],
  "aria-roledescription": "all", // global
  "aria-rowcount": ["table", "grid", "treegrid"],
  "aria-rowindex": ["cell", "row", "columnheader", "gridcell", "rowheader"],
  "aria-rowindextext": ["cell", "row", "columnheader", "gridcell", "rowheader"],
  "aria-rowspan": ["cell", "columnheader", "gridcell", "rowheader"],
  "aria-selected": [
    "gridcell",
    "option",
    "row",
    "tab",
    "columnheader",
    "rowheader",
    "treeitem",
  ],
  "aria-setsize": [
    "article",
    "listitem",
    "menuitem",
    "option",
    "radio",
    "row", // only in treegrid
    "tab",
    "menuitemcheckbox",
    "menuitemradio",
    "treeitem",
  ],
  "aria-sort": ["columnheader", "rowheader"],
  "aria-valuemax": [
    "progressbar",
    "scrollbar",
    "separator",
    "slider",
    "spinbutton",
  ],
  "aria-valuemin": [
    "progressbar",
    "scrollbar",
    "separator",
    "slider",
    "spinbutton",
  ],
  "aria-valuenow": [
    "progressbar",
    "scrollbar",
    "separator",
    "slider",
    "spinbutton",
  ],
  "aria-valuetext": [
    "progressbar",
    "scrollbar",
    "separator",
    "slider",
    "spinbutton",
  ],
} as const;

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================================

/**
 * Validates the value of any ARIA attribute.
 */
export const validateAriaAttributeValue = (
  attribute: AriaAttribute,
  value: string,
): boolean => {
  const validValues = ARIA_ATTRIBUTE_VALUES[attribute];

  if (validValues === "integer") {
    const num = parseInt(value.trim(), 10);
    return !Number.isNaN(num) && num.toString() === value.trim() && num >= 1;
  }

  if (validValues === "number") {
    const num = parseFloat(value.trim());
    return !Number.isNaN(num) && Number.isFinite(num);
  }

  if (Array.isArray(validValues)) {
    return validValues.includes(value.trim());
  }

  // Handle multiple values (space-separated)
  if (typeof validValues === "object" && validValues.multipleValues) {
    const tokens = value.trim().split(/\s+/);
    // All tokens must be valid values
    return (
      tokens.length > 0 &&
      tokens.every((token) => validValues.multipleValues.includes(token))
    );
  }

  return true;
};

/**
 * Checks if an ARIA attribute is valid for the given role.
 */
export const isValidAriaAttributeForRole = (
  attribute: AriaAttribute,
  role: string | null,
): boolean => {
  const validRoles = ARIA_ATTRIBUTE_ROLES[attribute];

  if (validRoles === "all") {
    return true;
  }

  if (!role) {
    return false;
  }

  return validRoles.includes(role);
};
