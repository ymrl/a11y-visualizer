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
