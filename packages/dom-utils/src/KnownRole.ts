/**
 * このパッケージおよびAccessibility Visualizerが扱う既知のWAI-ARIAロールの一覧
 *
 * WAI-ARIA 1.2のロール（抽象ロールを含む）に加えて、ARIA 1.3で追加予定の
 * ロールとWAI-ARIA Graphics Module（graphics-*）のロールを含む。
 * {@link getKnownRole} はこの一覧に含まれるロールのみを返す
 */
export const knownRoles = [
  "alert",
  "alertdialog",
  "application",
  "article",
  "banner",
  "blockquote",
  "button",
  "caption",
  "cell",
  "checkbox",
  "code",
  "columnheader",
  "combobox",
  "command", // abstract role
  "comment", // will add in ARIA 1.3
  "complementary",
  "composite", //abstract role
  "contentinfo",
  "definition",
  "deletion",
  "dialog",
  "directory",
  "document",
  "emphasis",
  "feed",
  "figure",
  "form",
  "generic",
  "grid",
  "gridcell",
  "group",
  "heading",
  "image", // will add in ARIA 1.3
  "img",
  "input", // abstract role
  "insertion",
  "landmark", // abstract role
  "link",
  "list",
  "listbox",
  "listitem",
  "log",
  "main",
  "mark", // will add in ARIA 1.3
  "marquee",
  "math",
  "menu",
  "menubar",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "meter",
  "navigation",
  "none",
  "note",
  "option",
  "paragraph",
  "presentation",
  "progressbar",
  "radio",
  "radiogroup",
  "range", // abstract role
  "region",
  "roletype", // abstract role
  "row",
  "rowgroup",
  "rowheader",
  "scrollbar",
  "search",
  "searchbox",
  "section", // abstract role
  "sectionhead", // abstract role
  "select", // abstract role
  "separator",
  "slider",
  "spinbutton",
  "status",
  "strong",
  "structure", // abstract role
  "subscript",
  "suggestion", // will add in ARIA 1.3
  "superscript",
  "switch",
  "tab",
  "table",
  "tablist",
  "tabpanel",
  "term",
  "textbox",
  "time",
  "timer",
  "toolbar",
  "tooltip",
  "tree",
  "treegrid",
  "treeitem",
  "widget", // abstract role
  "window", // abstract role
  // for SVG
  "graphics-document",
  "graphics-object",
  "graphics-symbol",
] as const;

/** 既知のWAI-ARIAロール（{@link knownRoles} の要素） */
export type KnownRole = (typeof knownRoles)[number];
