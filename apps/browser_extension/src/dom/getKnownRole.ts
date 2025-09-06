import { getRole } from "dom-accessibility-api";
import { type KnownRole, knownRoles } from "./KnownRole";

export const getKnownRole = (el: Element): KnownRole | null => {
  const role = getRole(el);
  if (role && knownRoles.includes(role as KnownRole)) {
    return role as KnownRole;
  }
  const roleAttr = el.getAttribute("role");
  const roles = roleAttr?.split(" ") || [];
  const knownRole = roles.find((e) => knownRoles.includes(e as KnownRole));
  if (knownRole) {
    return knownRole as KnownRole;
  }

  if (el.tagName.toLowerCase() === "input") {
    return inputRole(el as HTMLInputElement);
  }
  if (el.tagName.toLowerCase() === "svg") {
    return "graphics-document";
  }
  return null;
};

// Aria in HTML で未定義になっているものを中心に、暗黙のロールを仮定する
// Chrome, Firefoxではそれぞれ独自の内部的なロールが表示されるものが多い
const inputRole = (el: HTMLInputElement): KnownRole | null => {
  if (el.tagName.toLowerCase() !== "input") {
    return null;
  }
  const type = el.getAttribute("type");
  switch (type) {
    case "button": //html-aria: button
    case "reset": //html-aria: button
    case "submit": //html-aria: button
    case "image": //html-aria: button
      return "button";
    case "checkbox": // html-aria: checkbox
      return "checkbox";
    case "radio": //html-aria: radio
      return "radio";
    case "range": // html-aria: slider
      return "slider";
    case "number": // html-aria: spinbutton
      return "spinbutton";
    case "search": // html-aria: searchbox/combobox
      return el.getAttribute("list") ? "combobox" : "searchbox";
    // ここから仮のロール
    case "hidden":
      // html-aria: no corresponding role
      return null;
    case "color":
      // html-aria: no corresponding role
      // Chrome: ColorWell
      // Firefox: button
      return "button";
    case "date":
      // html-aria: no corresponding role
      // Chrome: Date
      // Firefox: date editor
      return "textbox";
    case "month":
      // html-aria: no corresponding role
      // Chrome: DateTime
      // Firefox: (does not support)
      return "textbox";
    case "week":
      // html-aria no corresponding role
      // Crhome: Week
      // Firefox: (does not support)
      return "textbox";
    case "time":
      //html-aria: no corresponding role
      // Chrome: InputTime
      // Firefox: time editor
      return "textbox";
    case "datetime-local":
      // html-aria: no corresponding role
      // Chrome: DateTime
      // Firefox: date editor
      return "textbox";
    case "file":
      // html-aria: no corresponding role
      // Chrome: button
      // Firefox: button
      return "button";
    case "password":
      // html-aria: no corresponding role
      // Chrome: textbox
      // Firefox: password text
      return "textbox";
    // ここまで仮のロール

    // case "text": //html-aria: textbox/combobox
    // case "tel": //html-aria: textbox/combobox
    // case "url": //html-aria: textbox/combobox
    // case "email": //html-aria: textbox/combobox
    default:
      return el.getAttribute("list") ? "combobox" : "textbox";
  }
};
