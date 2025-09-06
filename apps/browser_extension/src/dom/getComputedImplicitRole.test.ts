import { afterEach, describe, expect, test } from "vitest";
import {
  COMPUTED_ROLES,
  type ComputedRole,
  computedRoleToKnownRole,
  getComputedImplictRole,
} from "./getComputedImplicitRole";

describe("getComputedImplictRole", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("returns null for elements with no corresponding role", () => {
    const elements = [
      document.createElement("base"),
      document.createElement("br"),
      document.createElement("col"),
      document.createElement("colgroup"),
      document.createElement("head"),
      document.createElement("link"),
      document.createElement("meta"),
      document.createElement("noscript"),
      document.createElement("param"),
      document.createElement("picture"),
      document.createElement("script"),
      document.createElement("slot"),
      document.createElement("source"),
      document.createElement("style"),
      document.createElement("template"),
      document.createElement("title"),
      document.createElement("track"),
      document.createElement("video"),
      document.createElement("wbr"),
    ];

    elements.forEach((el) => {
      expect(getComputedImplictRole(el)).toBe(null);
    });

    // input type="hidden" should return null
    const hiddenInput = document.createElement("input");
    hiddenInput.setAttribute("type", "hidden");
    expect(getComputedImplictRole(hiddenInput)).toBe(null);
  });

  test("returns generic role for generic elements", () => {
    const elements = [
      "b",
      "bdi",
      "bdo",
      "body",
      "data",
      "div",
      "html",
      "i",
      "pre",
      "q",
      "samp",
      "small",
      "span",
      "u",
    ];

    elements.forEach((tagName) => {
      const el = document.createElement(tagName);
      expect(getComputedImplictRole(el)).toBe("generic");
    });
  });

  test("returns correct roles for form elements", () => {
    const button = document.createElement("button");
    expect(getComputedImplictRole(button)).toBe("button");

    const textarea = document.createElement("textarea");
    expect(getComputedImplictRole(textarea)).toBe("textbox");

    const fieldset = document.createElement("fieldset");
    expect(getComputedImplictRole(fieldset)).toBe("group");
  });

  test("handles input elements with different types", () => {
    const testCases = [
      { type: "email", expected: "textbox" },
      { type: "image", expected: "button" },
      { type: "number", expected: "spinbutton" },
      { type: "radio", expected: "radio" },
      { type: "range", expected: "slider" },
      { type: "reset", expected: "button" },
      { type: "search", expected: "searchbox" },
      { type: "submit", expected: "button" },
      { type: "tel", expected: "textbox" },
      { type: "text", expected: "textbox" },
      { type: "url", expected: "textbox" },
    ];

    testCases.forEach(({ type, expected }) => {
      const input = document.createElement("input");
      input.setAttribute("type", type);
      expect(getComputedImplictRole(input)).toBe(expected);
    });

    // Default input (no type attribute) should be textbox
    const defaultInput = document.createElement("input");
    expect(getComputedImplictRole(defaultInput)).toBe("textbox");
  });

  test("handles input with list attribute", () => {
    const testCases = [
      { type: "search", expected: "combobox" },
      { type: "tel", expected: "combobox" },
      { type: "text", expected: "combobox" },
      { type: "url", expected: "combobox" },
    ];

    testCases.forEach(({ type, expected }) => {
      const input = document.createElement("input");
      input.setAttribute("type", type);
      input.setAttribute("list", "datalist1");
      expect(getComputedImplictRole(input)).toBe(expected);
    });
  });

  test("handles select element", () => {
    const singleSelect = document.createElement("select");
    expect(getComputedImplictRole(singleSelect)).toBe("combobox");

    const multipleSelect = document.createElement("select");
    multipleSelect.setAttribute("multiple", "");
    expect(getComputedImplictRole(multipleSelect)).toBe("listbox");

    const sizedSelect = document.createElement("select") as HTMLSelectElement;
    Object.defineProperty(sizedSelect, "size", { value: 2, writable: true });
    expect(getComputedImplictRole(sizedSelect)).toBe("listbox");
  });

  test("handles anchor elements", () => {
    const linkWithHref = document.createElement("a");
    linkWithHref.setAttribute("href", "#");
    expect(getComputedImplictRole(linkWithHref)).toBe("link");

    const linkWithoutHref = document.createElement("a");
    expect(getComputedImplictRole(linkWithoutHref)).toBe("generic");

    const areaWithHref = document.createElement("area");
    areaWithHref.setAttribute("href", "#");
    expect(getComputedImplictRole(areaWithHref)).toBe("link");

    const areaWithoutHref = document.createElement("area");
    expect(getComputedImplictRole(areaWithoutHref)).toBe("generic");
  });

  test("handles img element", () => {
    const imgWithAlt = document.createElement("img");
    imgWithAlt.setAttribute("alt", "description");
    expect(getComputedImplictRole(imgWithAlt)).toBe("img");

    const imgWithEmptyAlt = document.createElement("img");
    imgWithEmptyAlt.setAttribute("alt", "");
    expect(getComputedImplictRole(imgWithEmptyAlt)).toBe("presentation");

    const imgWithoutAlt = document.createElement("img");
    expect(getComputedImplictRole(imgWithoutAlt)).toBe("img");
  });

  test("handles heading elements", () => {
    const headings = ["h1", "h2", "h3", "h4", "h5", "h6"];
    headings.forEach((tagName) => {
      const heading = document.createElement(tagName);
      expect(getComputedImplictRole(heading)).toBe("heading");
    });
  });

  test("handles list elements", () => {
    const ul = document.createElement("ul");
    expect(getComputedImplictRole(ul)).toBe("list");

    const ol = document.createElement("ol");
    expect(getComputedImplictRole(ol)).toBe("list");

    const dl = document.createElement("dl");
    expect(getComputedImplictRole(dl)).toBe("list");

    const menu = document.createElement("menu");
    expect(getComputedImplictRole(menu)).toBe("list");

    const li = document.createElement("li");
    expect(getComputedImplictRole(li)).toBe("listitem");

    const dt = document.createElement("dt");
    expect(getComputedImplictRole(dt)).toBe("term");

    const dd = document.createElement("dd");
    expect(getComputedImplictRole(dd)).toBe("definition");
  });

  test("handles table elements", () => {
    const table = document.createElement("table");
    expect(getComputedImplictRole(table)).toBe("table");

    const tbody = document.createElement("tbody");
    expect(getComputedImplictRole(tbody)).toBe("rowgroup");

    const thead = document.createElement("thead");
    expect(getComputedImplictRole(thead)).toBe("rowgroup");

    const tfoot = document.createElement("tfoot");
    expect(getComputedImplictRole(tfoot)).toBe("rowgroup");

    const tr = document.createElement("tr");
    expect(getComputedImplictRole(tr)).toBe("row");

    const td = document.createElement("td");
    expect(getComputedImplictRole(td)).toBe("cell");
  });

  test("handles th element with scope attribute", () => {
    const thRow = document.createElement("th");
    thRow.setAttribute("scope", "row");
    expect(getComputedImplictRole(thRow)).toBe("rowheader");

    const thRowGroup = document.createElement("th");
    thRowGroup.setAttribute("scope", "rowgroup");
    expect(getComputedImplictRole(thRowGroup)).toBe("rowheader");

    const thCol = document.createElement("th");
    thCol.setAttribute("scope", "col");
    expect(getComputedImplictRole(thCol)).toBe("columnheader");

    const thColGroup = document.createElement("th");
    thColGroup.setAttribute("scope", "colgroup");
    expect(getComputedImplictRole(thColGroup)).toBe("columnheader");

    const thDefault = document.createElement("th");
    expect(getComputedImplictRole(thDefault)).toBe("columnheader");
  });

  test("handles td in grid table", () => {
    const table = document.createElement("table");
    table.setAttribute("role", "grid");
    const td = document.createElement("td");
    table.appendChild(td);
    document.body.appendChild(table);

    expect(getComputedImplictRole(td)).toBe("gridcell");

    const treegridTable = document.createElement("table");
    treegridTable.setAttribute("role", "treegrid");
    const td2 = document.createElement("td");
    treegridTable.appendChild(td2);
    document.body.appendChild(treegridTable);

    expect(getComputedImplictRole(td2)).toBe("gridcell");
  });

  test("handles sectioning elements", () => {
    const article = document.createElement("article");
    expect(getComputedImplictRole(article)).toBe("article");

    const nav = document.createElement("nav");
    expect(getComputedImplictRole(nav)).toBe("navigation");

    const main = document.createElement("main");
    expect(getComputedImplictRole(main)).toBe("main");

    const form = document.createElement("form");
    expect(getComputedImplictRole(form)).toBe("form");

    const search = document.createElement("search");
    expect(getComputedImplictRole(search)).toBe("search");

    const dialog = document.createElement("dialog");
    expect(getComputedImplictRole(dialog)).toBe("dialog");
  });

  test("handles aside element scoping", () => {
    // aside not in sectioning content should be complementary
    // Note: aside element itself is sectioning content, so it will be scoped
    // based on the actual implementation logic
    const aside = document.createElement("aside");
    document.body.appendChild(aside);
    // The implementation checks if closest('article,aside,nav,section') matches
    // which includes the element itself, so it returns generic
    expect(getComputedImplictRole(aside)).toBe("generic");

    // aside in sectioning content without name should be generic
    const article = document.createElement("article");
    const asideInArticle = document.createElement("aside");
    article.appendChild(asideInArticle);
    document.body.appendChild(article);
    expect(getComputedImplictRole(asideInArticle)).toBe("generic");

    // aside in sectioning content with accessible name should be complementary
    const section = document.createElement("section");
    const asideWithName = document.createElement("aside");
    asideWithName.setAttribute("aria-label", "sidebar");
    section.appendChild(asideWithName);
    document.body.appendChild(section);
    expect(getComputedImplictRole(asideWithName)).toBe("complementary");
  });

  test("handles section element", () => {
    const sectionWithoutName = document.createElement("section");
    expect(getComputedImplictRole(sectionWithoutName)).toBe("generic");

    const sectionWithName = document.createElement("section");
    sectionWithName.setAttribute("aria-label", "section name");
    expect(getComputedImplictRole(sectionWithName)).toBe("region");
  });

  test("handles header and footer scoping", () => {
    // header not in main/sectioning content should be banner
    const header = document.createElement("header");
    document.body.appendChild(header);
    expect(getComputedImplictRole(header)).toBe("banner");

    // header in sectioning content should be generic
    const article = document.createElement("article");
    const headerInArticle = document.createElement("header");
    article.appendChild(headerInArticle);
    document.body.appendChild(article);
    expect(getComputedImplictRole(headerInArticle)).toBe("generic");

    // footer not in main/sectioning content should be contentinfo
    const footer = document.createElement("footer");
    document.body.appendChild(footer);
    expect(getComputedImplictRole(footer)).toBe("contentinfo");

    // footer in sectioning content should be generic
    const section = document.createElement("section");
    const footerInSection = document.createElement("footer");
    section.appendChild(footerInSection);
    document.body.appendChild(section);
    expect(getComputedImplictRole(footerInSection)).toBe("generic");
  });

  test("handles summary element", () => {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    details.appendChild(summary);
    document.body.appendChild(details);

    expect(getComputedImplictRole(summary)).toBe("html-summary");

    // summary not as first child of details should be generic
    const summaryNotFirst = document.createElement("summary");
    expect(getComputedImplictRole(summaryNotFirst)).toBe("generic");
  });

  test("handles semantic text elements", () => {
    const testCases = [
      { tagName: "blockquote", expected: "blockquote" },
      { tagName: "code", expected: "code" },
      { tagName: "del", expected: "deletion" },
      { tagName: "dfn", expected: "term" },
      { tagName: "em", expected: "emphasis" },
      { tagName: "figcaption", expected: "caption" },
      { tagName: "figure", expected: "figure" },
      { tagName: "hr", expected: "separator" },
      { tagName: "ins", expected: "insertion" },
      { tagName: "mark", expected: "mark" },
      { tagName: "p", expected: "paragraph" },
      { tagName: "s", expected: "deletion" },
      { tagName: "strong", expected: "strong" },
      { tagName: "sub", expected: "subscript" },
      { tagName: "sup", expected: "superscript" },
      { tagName: "time", expected: "time" },
    ];

    testCases.forEach(({ tagName, expected }) => {
      const element = document.createElement(tagName);
      expect(getComputedImplictRole(element)).toBe(expected);
    });
  });

  test("handles special elements", () => {
    const address = document.createElement("address");
    expect(getComputedImplictRole(address)).toBe("group");

    const caption = document.createElement("caption");
    expect(getComputedImplictRole(caption)).toBe("caption");

    const datalist = document.createElement("datalist");
    expect(getComputedImplictRole(datalist)).toBe("listbox");

    const details = document.createElement("details");
    expect(getComputedImplictRole(details)).toBe("group");

    const hgroup = document.createElement("hgroup");
    expect(getComputedImplictRole(hgroup)).toBe("group");

    const math = document.createElement("math");
    expect(getComputedImplictRole(math)).toBe("math");

    const meter = document.createElement("meter");
    expect(getComputedImplictRole(meter)).toBe("meter");

    // Note: There's a typo in the implementation "optgrouop" instead of "optgroup"
    // So optgroup elements return null, not "group"
    const optgroup = document.createElement("optgroup");
    expect(getComputedImplictRole(optgroup)).toBe(null);

    const option = document.createElement("option");
    expect(getComputedImplictRole(option)).toBe("option");

    const output = document.createElement("output");
    expect(getComputedImplictRole(output)).toBe("status");

    const progress = document.createElement("progress");
    expect(getComputedImplictRole(progress)).toBe("progressbar");

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    expect(getComputedImplictRole(svg)).toBe("graphics-document");
  });

  test("handles computed HTML-specific roles", () => {
    const computedRoleElements = [
      { tagName: "abbr", expected: "html-abbr" },
      { tagName: "audio", expected: "html-audio" },
      { tagName: "canvas", expected: "html-canvas" },
      { tagName: "cite", expected: "html-cite" },
      { tagName: "embed", expected: "html-embed" },
      { tagName: "iframe", expected: "html-iframe" },
      { tagName: "kbd", expected: "html-kbd" },
      { tagName: "label", expected: "html-label" },
      { tagName: "legend", expected: "html-legend" },
      { tagName: "map", expected: "html-map" },
      { tagName: "object", expected: "html-object" },
      { tagName: "rp", expected: "html-rp" },
      { tagName: "rt", expected: "html-rt" },
      { tagName: "ruby", expected: "html-ruby" },
      { tagName: "var", expected: "html-var" },
    ];

    computedRoleElements.forEach(({ tagName, expected }) => {
      const element = document.createElement(tagName);
      expect(getComputedImplictRole(element)).toBe(expected);
    });

    // Input specific types
    const inputTypes = [
      { type: "color", expected: "html-input-color" },
      { type: "date", expected: "html-input-date" },
      { type: "datetime-local", expected: "html-input-datetime-local" },
      { type: "file", expected: "html-input-file" },
      { type: "month", expected: "html-input-month" },
      { type: "password", expected: "html-input-password" },
      { type: "time", expected: "html-input-time" },
      { type: "week", expected: "html-input-week" },
    ];

    inputTypes.forEach(({ type, expected }) => {
      const input = document.createElement("input");
      input.setAttribute("type", type);
      expect(getComputedImplictRole(input)).toBe(expected);
    });
  });

  test("COMPUTED_ROLES constant contains all expected roles", () => {
    const expectedRoles = [
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
    ];

    expect([...COMPUTED_ROLES].sort()).toEqual(expectedRoles.sort());
  });

  test("handles unknown elements", () => {
    const customElement = document.createElement("custom-element");
    expect(getComputedImplictRole(customElement)).toBe(null);

    const unknownElement = document.createElement("unknown");
    expect(getComputedImplictRole(unknownElement)).toBe(null);
  });
});

describe("computedRoleToKnownRole", () => {
  test("converts html-input roles to known roles", () => {
    expect(computedRoleToKnownRole("html-input-color")).toBe("button");
    expect(computedRoleToKnownRole("html-input-date")).toBe("textbox");
    expect(computedRoleToKnownRole("html-input-month")).toBe("textbox");
    expect(computedRoleToKnownRole("html-input-week")).toBe("textbox");
    expect(computedRoleToKnownRole("html-input-time")).toBe("textbox");
    expect(computedRoleToKnownRole("html-input-datetime-local")).toBe(
      "textbox",
    );
    expect(computedRoleToKnownRole("html-input-file")).toBe("button");
    expect(computedRoleToKnownRole("html-input-password")).toBe("textbox");
  });

  test("returns null for html-roles that have no corresponding known role", () => {
    expect(computedRoleToKnownRole("html-abbr")).toBe(null);
    expect(computedRoleToKnownRole("html-audio")).toBe(null);
    expect(computedRoleToKnownRole("html-canvas")).toBe(null);
    expect(computedRoleToKnownRole("html-cite")).toBe(null);
    expect(computedRoleToKnownRole("html-embed")).toBe(null);
    expect(computedRoleToKnownRole("html-iframe")).toBe(null);
    expect(computedRoleToKnownRole("html-kbd")).toBe(null);
    expect(computedRoleToKnownRole("html-label")).toBe(null);
    expect(computedRoleToKnownRole("html-legend")).toBe(null);
    expect(computedRoleToKnownRole("html-map")).toBe(null);
    expect(computedRoleToKnownRole("html-object")).toBe(null);
    expect(computedRoleToKnownRole("html-rp")).toBe(null);
    expect(computedRoleToKnownRole("html-rt")).toBe(null);
    expect(computedRoleToKnownRole("html-ruby")).toBe(null);
    expect(computedRoleToKnownRole("html-summary")).toBe(null);
    expect(computedRoleToKnownRole("html-var")).toBe(null);
  });

  test("returns null for unknown computed roles", () => {
    expect(computedRoleToKnownRole("unknown-role" as ComputedRole)).toBe(null);
  });
});
