import { describe, expect, test } from "vitest";
import {
  getElementCategory,
  isButton,
  isFormControl,
  isGroup,
  isHeading,
  isImage,
  isLang,
  isLink,
  isList,
  isListItem,
  isPage,
  isSection,
  isTable,
  isTableCell,
} from "./getElementCategory";

describe("getElementCategory", () => {
  test("body", () => {
    document.body.setAttribute("lang", "en");
    expect(getElementCategory(document.body)).toBe("page");
    document.body.removeAttribute("lang");
  });

  test("img", () => {
    const el = document.createElement("img");
    expect(getElementCategory(el)).toBe("image");
  });

  ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((tagName) => {
    test(tagName, () => {
      const el = document.createElement(tagName);
      el.setAttribute("lang", "en");
      expect(getElementCategory(el)).toBe("heading");
    });
  });

  ["button", "input", "select", "textarea", "a"].forEach((tagName) => {
    test(tagName, () => {
      const el = document.createElement(tagName);
      el.setAttribute("lang", "en");
      expect(getElementCategory(el)).toBe("control");
    });
  });

  ["section", "article", "aside", "nav", "iframe"].forEach((tagName) => {
    test(tagName, () => {
      const el = document.createElement(tagName);
      el.setAttribute("lang", "en");
      expect(getElementCategory(el)).toBe("section");
    });
  });

  ["ul", "ol", "dl", "menu"].forEach((tagName) => {
    test(tagName, () => {
      const el = document.createElement(tagName);
      el.setAttribute("lang", "en");
      expect(getElementCategory(el)).toBe("list");
    });
  });

  ["li", "dd", "dt"].forEach((tagName) => {
    test(tagName, () => {
      const el = document.createElement(tagName);
      el.setAttribute("lang", "en");
      expect(getElementCategory(el)).toBe("listItem");
    });
  });

  test("table", () => {
    const el = document.createElement("table");
    el.setAttribute("lang", "en");
    expect(getElementCategory(el)).toBe("table");
  });

  ["td", "th"].forEach((tagName) => {
    test(tagName, () => {
      const el = document.createElement(tagName);
      el.setAttribute("lang", "en");
      expect(getElementCategory(el)).toBe("tableCell");
    });
  });

  test("fieldset", () => {
    const el = document.createElement("fieldset");
    el.setAttribute("lang", "en");
    expect(getElementCategory(el)).toBe("group");
  });

  test("div lang en", () => {
    const el = document.createElement("div");
    el.setAttribute("lang", "en");
    expect(getElementCategory(el)).toBe("section");
  });

  test("div", () => {
    const el = document.createElement("div");
    expect(getElementCategory(el)).toBe("general");
  });
});

describe("isImage()", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isImage(element)).toBe(false);
  });
  test("img", () => {
    const element = document.createElement("img");
    expect(isImage(element)).toBe(true);
  });
  test("svg", () => {
    const element = document.createElement("svg");
    expect(isImage(element)).toBe(true);
  });
  test("role=img", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "img");
    expect(isImage(element)).toBe(true);
  });
  test("role=button", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    expect(isImage(element)).toBe(false);
  });
  test("svg role=presentation", () => {
    const element = document.createElement("svg");
    element.setAttribute("role", "presentation");
    expect(isImage(element)).toBe(true);
  });
});

describe("isPage", () => {
  test("div", () => {
    const div = document.createElement("div");
    expect(isPage(div)).toBe(false);
  });

  test("body", () => {
    expect(isPage(document.body)).toBe(true);
  });
});

describe("isHeading()", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isHeading(element)).toBe(false);
  });

  test("h1", () => {
    const element = document.createElement("h1");
    expect(isHeading(element)).toBe(true);
  });

  test("h2", () => {
    const element = document.createElement("h2");
    expect(isHeading(element)).toBe(true);
  });

  test("h3", () => {
    const element = document.createElement("h3");
    expect(isHeading(element)).toBe(true);
  });

  test("h4", () => {
    const element = document.createElement("h4");
    expect(isHeading(element)).toBe(true);
  });

  test("h5", () => {
    const element = document.createElement("h5");
    expect(isHeading(element)).toBe(true);
  });

  test("h6", () => {
    const element = document.createElement("h6");
    expect(isHeading(element)).toBe(true);
  });

  test("role=heading", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "heading");
    expect(isHeading(element)).toBe(true);
  });
});

describe("isFormControl()", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isFormControl(element)).toBe(false);
  });

  test("input", () => {
    const element = document.createElement("input");
    expect(isFormControl(element)).toBe(true);
  });

  test("input hidden", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "hidden");
    expect(isFormControl(element)).toBe(false);
  });

  test("textarea", () => {
    const element = document.createElement("textarea");
    expect(isFormControl(element)).toBe(true);
  });

  test("select", () => {
    const element = document.createElement("select");
    expect(isFormControl(element)).toBe(true);
  });

  test("role=menuitemcheckbox", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "menuitemcheckbox");
    expect(isFormControl(element)).toBe(true);
  });

  test("role=menuitemradio", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "menuitemradio");
    expect(isFormControl(element)).toBe(true);
  });
});

describe("isGroup", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isGroup(element)).toBe(false);
  });

  test("fieldset", () => {
    const element = document.createElement("fieldset");
    expect(isGroup(element)).toBe(true);
  });
  test("hgroup", () => {
    const element = document.createElement("hgroup");
    expect(isGroup(element)).toBe(true);
  });
  test("role=group", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "group");
    expect(isGroup(element)).toBe(true);
  });
});

describe("isButton()", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isButton(element)).toBe(false);
  });

  test("button element", () => {
    const element = document.createElement("button");
    expect(isButton(element)).toBe(true);
  });

  test("input type = button", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "button");
    expect(isButton(element)).toBe(true);
  });

  test("input type = submit", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "submit");
    expect(isButton(element)).toBe(true);
  });

  test("input type = reset", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "reset");
    expect(isButton(element)).toBe(true);
  });

  test("input type = image", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "image");
    expect(isButton(element)).toBe(true);
  });

  test("input type = text", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "text");
    expect(isButton(element)).toBe(false);
  });

  test("role = button", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    expect(isButton(element)).toBe(true);
  });

  test("summary", () => {
    const element = document.createElement("summary");
    const details = document.createElement("details");
    details.appendChild(element);
    expect(isButton(element)).toBe(true);
  });

  test("role = menuitem", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "menuitem");
    expect(isButton(element)).toBe(true);
  });
});

describe("isLang", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isLang(element)).toBe(false);
  });

  test("div lang", () => {
    const element = document.createElement("div");
    element.setAttribute("lang", "en");
    expect(isLang(element)).toBe(true);
  });

  test("div xml:lang", () => {
    const element = document.createElement("div");
    element.setAttribute("xml:lang", "en");
    expect(isLang(element)).toBe(true);
  });
});

describe("isLink()", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isLink(element)).toBe(false);
  });
  test("a", () => {
    const element = document.createElement("a");
    expect(isLink(element)).toBe(true);
  });
  test("area", () => {
    const element = document.createElement("area");
    expect(isLink(element)).toBe(true);
  });
  test("role=link", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "link");
    expect(isLink(element)).toBe(true);
  });
});

describe("isList()", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isList(element)).toBe(false);
  });

  ["ul", "ol", "dl"].forEach((tagName) => {
    test(tagName, () => {
      const element = document.createElement(tagName);
      expect(isList(element)).toBe(true);
    });
  });

  test("role=list", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "list");
    expect(isList(element)).toBe(true);
  });

  test("role=directory", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "directory");
    expect(isList(element)).toBe(true);
  });

  test("role=menu", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "menu");
    expect(isList(element)).toBe(true);
  });

  test("role=menubar", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "menubar");
    expect(isList(element)).toBe(true);
  });
});

describe("isListItem", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isListItem(element)).toBe(false);
  });

  ["li", "dd", "dt"].forEach((tagName) => {
    test(tagName, () => {
      const element = document.createElement(tagName);
      expect(isListItem(element)).toBe(true);
    });
  });

  test("role=listitem", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "listitem");
    expect(isListItem(element)).toBe(true);
  });

  ["menuitem", "menuitemcheckbox", "menuitemradio"].forEach((role) => {
    test(`role=${role}`, () => {
      const element = document.createElement("div");
      element.setAttribute("role", role);
      expect(isListItem(element)).toBe(true);
    });
  });
});
describe("isSection()", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isSection(element)).toBe(false);
  });

  ["article", "section", "nav", "aside", "dialog", "iframe"].forEach(
    (tagName) => {
      test(tagName, () => {
        const element = document.createElement(tagName);
        expect(isSection(element)).toBe(true);
      });
    },
  );

  test("role=article", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "article");
    expect(isSection(element)).toBe(true);
  });
});

describe("isTable", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isTable(element)).toBe(false);
  });

  test("table", () => {
    const element = document.createElement("table");
    expect(isTable(element)).toBe(true);
  });

  test("role=table", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "table");
    expect(isTable(element)).toBe(true);
  });

  test("role=grid", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "grid");
    expect(isTable(element)).toBe(true);
  });

  test("role=treegrid", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "treegrid");
    expect(isTable(element)).toBe(true);
  });
});

describe("isTableCell", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isTableCell(element)).toBe(false);
  });

  ["td", "th"].forEach((tagName) => {
    test(tagName, () => {
      const element = document.createElement(tagName);
      expect(isTableCell(element)).toBe(true);
    });
  });

  test("role=cell", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "cell");
    expect(isTableCell(element)).toBe(true);
  });

  test("role=columnheader", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "columnheader");
    expect(isTableCell(element)).toBe(true);
  });

  test("role=rowheader", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "rowheader");
    expect(isTableCell(element)).toBe(true);
  });
});
