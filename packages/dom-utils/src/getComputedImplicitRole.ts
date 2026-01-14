import { computeAccessibleName } from "dom-accessibility-api";
import { type KnownRole, knownRoles } from "./KnownRole";

const isScopedToSectioningContent = (el: Element) => {
  return el.closest("article,aside,nav,section") !== null;
};
const isScopedToMainOrSectioningContent = (el: Element) => {
  return el.closest("main,article,aside,nav,section") !== null;
};

export const COMPUTED_ROLES = [
  "html-abbr",
  "html-audio",
  "html-canvas",
  "html-cite",
  "html-embed",
  "html-iframe",
  "html-input-color",
  "html-input-date",
  "html-input-datetime-local",
  "html-input-file",
  "html-input-month",
  "html-input-password",
  "html-input-time",
  "html-input-week",
  "html-kbd",
  "html-label",
  "html-legend",
  "html-map",
  "html-object",
  "html-rp",
  "html-rt",
  "html-ruby",
  "html-summary",
  "html-var",
] as const;

export type ComputedRole = KnownRole | (typeof COMPUTED_ROLES)[number];

export const getImplicitRole = (el: Element): KnownRole | null => {
  const computedRole = getComputedImplictRole(el);
  if (computedRole) {
    return computedRoleToKnownRole(computedRole);
  }
  return null;
};

export const getComputedImplictRole = (el: Element): ComputedRole | null => {
  const tagName = el.tagName.toLowerCase();
  switch (tagName) {
    // HTML
    case "a":
    case "area":
      if (el.hasAttribute("href")) {
        return "link";
      }
      return "generic";
    case "abbr":
      return "html-abbr";
    case "address":
      return "group";
    case "article":
      return "article";
    case "aside": {
      if (isScopedToSectioningContent(el)) {
        if (computeAccessibleName(el).trim()) {
          return "complementary";
        }
        return "generic";
      }
      return "complementary";
    }
    case "audio":
      return "html-audio";
    case "b":
      return "generic";
    case "base":
      // no corresponding role
      return null;
    case "bdi":
      return "generic";
    case "bdo":
      return "generic";
    case "blockquote":
      return "blockquote";
    case "body":
      return "generic";
    case "br":
      // no corresponding role
      return null;
    case "button":
      return "button";
    case "canvas":
      return "html-canvas";
    case "caption":
      return "caption";
    case "cite":
      return "html-cite";
    case "code":
      return "code";
    case "col":
      // no corresponding role
      return null;
    case "colgroup":
      // no corresponding role
      return null;
    case "data":
      return "generic";
    case "datalist":
      return "listbox";
    case "dd":
      // This may chagnge upon resolution of
      // https://github.com/w3c/aria/issues/1662
      return "definition";
    case "del":
      return "deletion";
    case "details":
      return "group";
    case "dfn":
      return "term";
    case "dialog":
      return "dialog";
    case "div":
      return "generic";
    case "dl":
      // This may chagnge upon resolution of
      // https://github.com/w3c/aria/issues/1662
      return "list";
    case "dt":
      // This may chagnge upon resolution of
      // https://github.com/w3c/aria/issues/1662
      return "term";
    case "em":
      return "emphasis";
    case "embed":
      return "html-embed";
    case "fieldset":
      return "group";
    case "figcaption":
      return "caption";
    case "figure":
      return "figure";
    case "footer": {
      if (isScopedToMainOrSectioningContent(el)) {
        return "generic";
      }
      return "contentinfo";
    }
    case "form":
      return "form";
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return "heading";
    case "head":
      // no corresponding role
      return null;
    case "header": {
      if (isScopedToMainOrSectioningContent(el)) {
        // This may change upon resolution of
        // https://github.com/w3c/aria/issues/1915
        return "generic";
      }
      return "banner";
    }
    case "hgroup":
      return "group";
    case "hr":
      return "separator";
    case "html":
      return "generic";
    case "i":
      return "generic";
    case "iframe":
      // no corresponding role
      return "html-iframe";
    case "img": {
      if (el.getAttribute("alt") === "") {
        return "presentation";
      }
      return "img";
    }
    case "input": {
      const type = el.getAttribute("type");
      switch (type) {
        case "color":
          return "html-input-color";
        case "date":
          return "html-input-date";
        case "datetime-local":
          return "html-input-datetime-local";
        case "email":
          return "textbox";
        case "file":
          return "html-input-file";
        case "hidden":
          // no corresponding role
          return null;
        case "image":
          return "button";
        case "month":
          return "html-input-month";
        case "number":
          return "spinbutton";
        case "password":
          return "html-input-password";
        case "radio":
          return "radio";
        case "range":
          return "slider";
        case "reset":
          return "button";
        case "search":
          return el.hasAttribute("list") ? "combobox" : "searchbox";
        case "submit":
          return "button";
        case "tel":
          return el.hasAttribute("list") ? "combobox" : "textbox";
        case "text":
          return el.hasAttribute("list") ? "combobox" : "textbox";
        case "time":
          return "html-input-time";
        case "url":
          return el.hasAttribute("list") ? "combobox" : "textbox";
        case "week":
          return "html-input-week";
      }
      return "textbox";
    }
    case "ins":
      return "insertion";
    case "kbd":
      return "html-kbd";
    case "label":
      return "html-label";
    case "legend":
      return "html-legend";
    case "li":
      return "listitem";
    case "link":
      // no corresponding role
      return null;
    case "main":
      return "main";
    case "map":
      return "html-map";
    case "mark":
      return "mark";
    case "math":
      return "math";
    case "menu":
      return "list";
    case "meta":
      // no corresponding role
      return null;
    case "meter":
      return "meter";
    case "nav":
      return "navigation";
    case "noscript":
      // no corresponding role
      return null;
    case "object":
      return "html-object";
    case "ol":
      return "list";
    case "optgrouop":
      return "group";
    case "option":
      return "option";
    case "output":
      return "status";
    case "p":
      return "paragraph";
    case "param":
      // no corresponding role
      return null;
    case "picture":
      // no corresponding role
      return null;
    case "pre":
      return "generic";
    case "progress":
      return "progressbar";
    case "q":
      return "generic";
    case "rp":
      return "html-rp";
    case "rt":
      return "html-rt";
    case "ruby":
      return "html-ruby";
    case "s":
      return "deletion";
    case "samp":
      return "generic";
    case "script":
      // no corresponding role
      return null;
    case "search":
      return "search";
    case "section": {
      if (computeAccessibleName(el).trim()) {
        return "region";
      }
      return "generic";
    }
    case "select": {
      if (
        (el as HTMLSelectElement).hasAttribute("multiple") ||
        (el as HTMLSelectElement).size > 1
      ) {
        return "listbox";
      }
      return "combobox";
    }
    case "slot":
      // no corresponding role
      return null;
    case "small":
      return "generic";
    case "source":
      // no corresponding role
      return null;
    case "span":
      return "generic";
    case "strong":
      return "strong";
    case "style":
      // no corresponding role
      return null;
    case "sub":
      return "subscript";
    case "summary": {
      if (
        el.parentElement?.tagName.toLowerCase() === "details" &&
        el.parentElement?.firstElementChild === el
      ) {
        return "html-summary";
      }
      return "generic";
    }
    case "sup":
      return "superscript";
    case "svg":
      return "graphics-document";
    case "table":
      return "table";
    case "tbody":
      return "rowgroup";
    case "td": {
      const table = el.closest("table");
      const tableRole = table?.getAttribute("role");
      if (tableRole === "grid" || tableRole === "treegrid") {
        return "gridcell";
      }
      return "cell";
    }
    case "template":
      // no corresponding role
      return null;
    case "textarea":
      return "textbox";
    case "tfoot":
      return "rowgroup";
    case "th": {
      const scope = el.getAttribute("scope");
      if (scope === "row" || scope === "rowgroup") {
        // FIXME: scopeがautoの場合でもrowheaderになる場合がある
        return "rowheader";
      } else if (scope === "col" || scope === "colgroup") {
        return "columnheader";
      }
      // FIXME: rowheader / columnheader にならない場合がある
      return "columnheader";
    }
    case "thead":
      return "rowgroup";
    case "time":
      return "time";
    case "title":
      // no corresponding role
      return null;
    case "tr":
      return "row";
    case "track":
      // no corresponding role
      return null;
    case "u":
      return "generic";
    case "ul":
      return "list";
    case "var":
      return "html-var";
    case "video":
      // no corresponding role
      return null;
    case "wbr":
      // no corresponding role
      return null;
    default:
      return null;
  }
};

export const computedRoleToKnownRole = (
  role: ComputedRole,
): KnownRole | null => {
  if (knownRoles.includes(role as KnownRole)) {
    return role as KnownRole;
  }
  switch (role) {
    case "html-abbr":
      // Chrome: Abbr
      // Firefox: generic
      return null;
    case "html-audio":
      // if (el.hasAttribute("controls")) {
      //   Chrome: Audio
      //   Firefox: group
      //   return "group";
      // }
      // Chrome: link
      // Firefox: link
      return null;
    case "html-canvas":
      // Chrome: Canvas
      // Firefox: canvas
      return null;
    case "html-cite":
      // Chrome: node not exposed
      // Firefox: ignored?
      return null;
    case "html-embed":
      // Chrome: EmbeddedObject
      // Firefox: internal frame
      return null;
    case "html-iframe":
      // Chrome: Iframe
      // Firefox: internal frame
      return null;
    case "html-input-color":
      // Chrome: ColorWell
      // Firefox: button
      return "button";
    case "html-input-date":
      // Chrome: Date
      // Firefox: date editor
      return "textbox";
    case "html-input-month":
      // Chrome: DateTime
      // Firefox: (does not support)
      return "textbox";
    case "html-input-week":
      // Crhome: Week
      // Firefox: (does not support)
      return "textbox";
    case "html-input-time":
      // Chrome: InputTime
      // Firefox: time editor
      return "textbox";
    case "html-input-datetime-local":
      // Chrome: DateTime
      // Firefox: date editor
      return "textbox";
    case "html-input-file":
      // Chrome: button
      // Firefox: button
      return "button";
    case "html-input-password":
      // Chrome: textbox
      // Firefox: password text
      return "textbox";
    case "html-kbd":
      // Chrome: generic
      // Firefox: text leaf
      return null;
    case "html-label":
      // Chrome: node not exposed
      // Firefox: generic
      return null;
    case "html-legend":
      // Chrome: Legend
      // Firefox: label
      return null;
    case "html-map":
      // Chrome: node not exposed
      // Firefox:
      return null;
    case "html-object":
      // Chrome: PluginObject
      // Firefox: internal frame
      return null;
    case "html-rp":
      // Chrome: node not exposed
      // Firefox:
      return null;
    case "html-rt":
      // Chrome: Accessibility node not exposed
      // Firefox: text leaf
      return null;
    case "html-ruby":
      // Chrome: Ruby
      // Firefox: text leaf
      return null;
    case "html-summary":
      // Chrome: DisclosureTriangle
      // Firefox: summary
      return null;
    case "html-var":
      // Chrome: Element not interesting for accessibility
      // Firefox: text leaf
      return null;
  }
  return null;
};
