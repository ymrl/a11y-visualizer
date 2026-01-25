import { afterEach, describe, expect, test } from "vitest";
import { ListItem } from ".";

describe("ListItem", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  ["ul", "ol", "menu"].forEach((listTagName) => {
    test(`li in ${listTagName}`, () => {
      const list = document.createElement(listTagName);
      const element = document.createElement("li");
      list.appendChild(element);
      document.body.appendChild(list);
      const result = ListItem.evaluate(element, { enabled: true }, {});
      expect(result).toBeUndefined();
    });
  });

  test("li not in ul, ol, or menu", () => {
    const element = document.createElement("li");
    document.body.appendChild(element);
    const result = ListItem.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "tagName",
        ruleName: "list-item",
        content: "li",
      },
      {
        type: "error",
        ruleName: "list-item",
        message: "Not inside <ul>, <ol>, or <menu>",
      },
    ]);
  });
  test("li with role not in ul, ol, or menu", () => {
    const element = document.createElement("li");
    element.setAttribute("role", "listitem");
    document.body.appendChild(element);
    const result = ListItem.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "list-item",
        message: "Not inside <ul>, <ol>, or <menu>",
      },
    ]);
  });

  ["dt", "dd"].forEach((tagName) => {
    test(`${tagName} in dl`, () => {
      const dl = document.createElement("dl");
      const element = document.createElement(tagName);
      dl.appendChild(element);
      document.body.appendChild(dl);
      const result = ListItem.evaluate(element, { enabled: true }, {});
      expect(result).toBeUndefined();
    });

    test(`${tagName} in div in dl`, () => {
      const dl = document.createElement("dl");
      const div = document.createElement("div");
      const element = document.createElement(tagName);
      div.appendChild(element);
      dl.appendChild(div);
      document.body.appendChild(dl);
      const result = ListItem.evaluate(element, { enabled: true }, {});
      expect(result).toBeUndefined();
    });

    test(`${tagName} not in dl or div in dl`, () => {
      const element = document.createElement(tagName);
      document.body.appendChild(element);
      const result = ListItem.evaluate(element, { enabled: true }, {});
      expect(result).toEqual([
        {
          type: "tagName",
          ruleName: "list-item",
          content: tagName,
        },
        {
          type: "error",
          ruleName: "list-item",
          message: `Not inside <dl> or <div> within <dl>`,
        },
      ]);
    });

    test(`${tagName} with role not in dl or div in dl`, () => {
      const element = document.createElement(tagName);
      element.setAttribute("role", "listitem");
      document.body.appendChild(element);
      const result = ListItem.evaluate(element, { enabled: true }, {});
      expect(result).toEqual([
        {
          type: "error",
          ruleName: "list-item",
          message: `Not inside <dl> or <div> within <dl>`,
        },
      ]);
    });
  });

  test("li in dl", () => {
    const dl = document.createElement("dl");
    const element = document.createElement("li");
    dl.appendChild(element);
    document.body.appendChild(dl);
    const result = ListItem.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "tagName",
        ruleName: "list-item",
        content: "li",
      },
      {
        type: "error",
        ruleName: "list-item",
        message: "Not inside <ul>, <ol>, or <menu>",
      },
    ]);
  });

  ["menuitem", "menuitemcheckbox", "menuitemradio"].forEach((role) => {
    test(`role="${role}" in role=menu`, () => {
      const menu = document.createElement("div");
      menu.setAttribute("role", "menu");
      const element = document.createElement("div");
      element.setAttribute("role", role);
      menu.appendChild(element);
      document.body.appendChild(menu);
      const result = ListItem.evaluate(element, { enabled: true }, {});
      expect(result).toBeUndefined();
    });

    test(`role="${role}" not in role=menu`, () => {
      const element = document.createElement("div");
      element.setAttribute("role", role);
      document.body.appendChild(element);
      const result = ListItem.evaluate(element, { enabled: true }, {});
      expect(result).toEqual([
        {
          type: "error",
          ruleName: "list-item",
          message: `Not inside "menu" role`,
        },
      ]);
    });

    test(`role="${role}" in role=group`, () => {
      const group = document.createElement("div");
      group.setAttribute("role", "group");
      const element = document.createElement("div");
      element.setAttribute("role", role);
      group.appendChild(element);
      document.body.appendChild(group);
      const result = ListItem.evaluate(element, { enabled: true }, {});
      expect(result).toEqual([
        {
          type: "error",
          ruleName: "list-item",
          message: 'Not inside "menu" role',
        },
      ]);
    });

    test(`role="${role}" in role=group within role=menu`, () => {
      const menu = document.createElement("div");
      menu.setAttribute("role", "menu");
      const group = document.createElement("div");
      group.setAttribute("role", "group");
      const element = document.createElement("div");
      element.setAttribute("role", role);
      group.appendChild(element);
      menu.appendChild(group);
      document.body.appendChild(menu);
      const result = ListItem.evaluate(element, { enabled: true }, {});
      expect(result).toBeUndefined();
    });

    test(`role="${role}" in role=presentation within role=menu`, () => {
      const menu = document.createElement("div");
      menu.setAttribute("role", "menu");
      const presentation = document.createElement("div");
      presentation.setAttribute("role", "presentation");
      const element = document.createElement("div");
      element.setAttribute("role", role);
      presentation.appendChild(element);
      menu.appendChild(presentation);
      document.body.appendChild(menu);
      const result = ListItem.evaluate(element, { enabled: true }, {});
      expect(result).toBeUndefined();
    });

    test(`role="${role}" in <div> without any role within role=menu`, () => {
      const menu = document.createElement("div");
      menu.setAttribute("role", "menu");
      const div = document.createElement("div");
      const element = document.createElement("div");
      element.setAttribute("role", role);
      div.appendChild(element);
      menu.appendChild(div);
      document.body.appendChild(menu);
      const result = ListItem.evaluate(element, { enabled: true }, {});
      expect(result).toBeUndefined();
    });
  });

  test("role=listitem in role=list", () => {
    const list = document.createElement("div");
    list.setAttribute("role", "list");
    const element = document.createElement("div");
    element.setAttribute("role", "listitem");
    list.appendChild(element);
    document.body.appendChild(list);
    const result = ListItem.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("role=listitem not in role=list", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "listitem");
    document.body.appendChild(element);
    const result = ListItem.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "list-item",
        message: `Not inside "list" role`,
      },
    ]);
  });

  test("role=listitem in role=group within role=list", () => {
    const list = document.createElement("div");
    list.setAttribute("role", "list");
    const group = document.createElement("div");
    group.setAttribute("role", "group");
    const element = document.createElement("div");
    element.setAttribute("role", "listitem");
    group.appendChild(element);
    list.appendChild(group);
    document.body.appendChild(list);
    const result = ListItem.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "list-item",
        message: `Not inside "list" role`,
      },
    ]);
  });

  test("role=listitem in role=menu", () => {
    const menu = document.createElement("div");
    menu.setAttribute("role", "menu");
    const element = document.createElement("div");
    element.setAttribute("role", "listitem");
    menu.appendChild(element);
    document.body.appendChild(menu);
    const result = ListItem.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "list-item",
        message: `Not inside "list" role`,
      },
    ]);
  });

  test("role=listitem in role=presentation within role=list", () => {
    const list = document.createElement("div");
    list.setAttribute("role", "list");
    const presentation = document.createElement("div");
    presentation.setAttribute("role", "presentation");
    const element = document.createElement("div");
    element.setAttribute("role", "listitem");
    presentation.appendChild(element);
    list.appendChild(presentation);
    document.body.appendChild(list);
    const result = ListItem.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("role=listitem in <div> without any role within role=list", () => {
    const list = document.createElement("div");
    list.setAttribute("role", "list");
    const div = document.createElement("div");
    const element = document.createElement("div");
    element.setAttribute("role", "listitem");
    div.appendChild(element);
    list.appendChild(div);
    document.body.appendChild(list);
    const result = ListItem.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });
});
