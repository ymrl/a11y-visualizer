export const FormSelectors = [
  "input:not([type='hidden']):not([type='button']):not([type='submit']):not([type='reset']):not([type='image'])",
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
  "fieldset",
  "form",
] as const;

const hasInputRole = (el: Element): boolean =>
  [
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
  ].includes(el.getAttribute("role") || "");

const hasInputTag = (el: Element): boolean => {
  const tagName = el.tagName.toLowerCase();
  const typeAttr = el.getAttribute("type");
  return (
    (tagName === "input" &&
      (typeAttr === null ||
        (typeAttr &&
          !["button", "submit", "reset", "image", "hidden"].includes(
            typeAttr,
          )))) ||
    tagName === "textarea" ||
    tagName === "select"
  );
};

export const isLabel = (el: Element): boolean =>
  el.tagName.toLowerCase() === "label";

export const isFieldset = (el: Element): boolean =>
  el.tagName.toLowerCase() === "fieldset";

export const isFormControl = (el: Element): boolean =>
  hasInputRole(el) || hasInputTag(el);
