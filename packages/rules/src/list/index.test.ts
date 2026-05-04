import { getKnownRole } from "@a11y-visualizer/dom-utils";
import { afterEach, describe, expect, test } from "vitest";
import { getListItems, List } from ".";

describe("List", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("ul", () => {
    const element = document.createElement("ul");
    element.innerHTML = `
      <li>0</li>
      <li>1</li>
      <li role="presentation">2</li>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "listType",
        ruleName: "list",
        content: "listType.list",
      },
      {
        type: "list",
        ruleName: "list",
        content: "2",
        contentLabel: "List items",
      },
    ]);
  });

  test("ol", () => {
    const element = document.createElement("ol");
    element.innerHTML = `
      <li>0</li>
      <li>1</li>
      <li>2</li>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "listType",
        ruleName: "list",
        content: "listType.list",
      },
      {
        type: "list",
        ruleName: "list",
        content: "3",
        contentLabel: "List items",
      },
    ]);
  });

  test("dl", () => {
    const element = document.createElement("dl");
    element.innerHTML = `
      <dt>0</dt>
      <dd>1</dd>
      <div>
        <dt>2</dt>
        <dd>3</dd>
      </div>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "listType",
        ruleName: "list",
        content: "listType.definitionList",
      },
      {
        type: "list",
        ruleName: "list",
        content: "4",
        contentLabel: "List items",
      },
    ]);
  });

  test("ul has invalid <div>", () => {
    const element = document.createElement("ul");
    element.innerHTML = `
      <li>0</li>
      <li>1</li>
      <div>2</div>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "list",
        message: "Must only contain <li>",
      },
      {
        type: "listType",
        ruleName: "list",
        content: "listType.list",
      },
      {
        type: "list",
        ruleName: "list",
        content: "2",
        contentLabel: "List items",
      },
    ]);
  });

  test("ol has invalid <div>", () => {
    const element = document.createElement("ol");
    element.innerHTML = `
      <li>0</li>
      <li>1</li>
      <div>2</div>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "list",
        message: "Must only contain <li>",
      },
      {
        type: "listType",
        ruleName: "list",
        content: "listType.list",
      },
      {
        type: "list",
        ruleName: "list",
        content: "2",
        contentLabel: "List items",
      },
    ]);
  });

  test("menu has invalid <div>", () => {
    const element = document.createElement("menu");
    element.innerHTML = `
      <li>0</li>
      <li>1</li>
      <div>2</div>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "list",
        message: "Must only contain <li>",
      },
      {
        type: "listType",
        ruleName: "list",
        content: "listType.list",
      },
      {
        type: "list",
        ruleName: "list",
        content: "2",
        contentLabel: "List items",
      },
    ]);
  });

  test("dl has empty <div>", () => {
    const element = document.createElement("dl");
    element.innerHTML = `
      <dt>0</dt>
      <dd>1</dd>
      <div></div>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "listType",
        ruleName: "list",
        content: "listType.definitionList",
      },
      {
        type: "list",
        ruleName: "list",
        content: "2",
        contentLabel: "List items",
      },
    ]);
  });

  test("dl has <div> with text", () => {
    const element = document.createElement("dl");
    element.innerHTML = `
      <dt>0</dt>
      <dd>1</dd>
      <div>2</div>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "list",
        message: "Must only contain <dt>, <dd>, or them within a <div>",
      },
      {
        type: "listType",
        ruleName: "list",
        content: "listType.definitionList",
      },
      {
        type: "list",
        ruleName: "list",
        content: "2",
        contentLabel: "List items",
      },
    ]);
  });

  test("dl has invalid <div>", () => {
    const element = document.createElement("dl");
    element.innerHTML = `
      <dt>0</dt>
      <dd>1</dd>
      <div>
        <dt>2</dt>
        <dd>3</dd>
        <div>4</div>
      </div>
      <div>5</div>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "list",
        message: "Must only contain <dt>, <dd>, or them within a <div>",
      },
      {
        type: "listType",
        ruleName: "list",
        content: "listType.definitionList",
      },
      {
        type: "list",
        ruleName: "list",
        content: "4",
        contentLabel: "List items",
      },
    ]);
  });

  test("role=menu", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "menu");
    element.innerHTML = `
      <div role="menuitem">0</div>
      <div role="group">
        <div role="menuitemcheckbox">1</div>
        <div role="menuitemradio">2</div>
      </div>
      <div role="listitem">3</div>
      <div>4</div>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "listType",
        ruleName: "list",
        content: "listType.menu",
      },
      {
        type: "list",
        ruleName: "list",
        content: "3",
        contentLabel: "List items",
      },
    ]);
  });

  test("menu element with li role=menuitem", () => {
    const element = document.createElement("menu");
    element.innerHTML = `
      <li role="menuitem">0</li>
      <li role="menuitem">1</li>
      <li role="menuitem">2</li>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    const listResult = result?.find((r) => r.type === "list");
    expect(listResult).toEqual({
      type: "list",
      ruleName: "list",
      content: "3",
      contentLabel: "List items",
    });
  });

  test("ul role=menu with li role=menuitem", () => {
    const element = document.createElement("ul");
    element.setAttribute("role", "menu");
    element.innerHTML = `
      <li role="menuitem">0</li>
      <li role="menuitem">1</li>
      <li role="menuitem">2</li>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "listType",
        ruleName: "list",
        content: "listType.menu",
      },
      {
        type: "list",
        ruleName: "list",
        content: "3",
        contentLabel: "List items",
      },
    ]);
  });

  test("ul role=menu with li role=none wrapping menuitem", () => {
    const element = document.createElement("ul");
    element.setAttribute("role", "menu");
    element.innerHTML = `
      <li role="none">
        <button role="menuitem">0</button>
      </li>
      <li role="none">
        <button role="menuitem">1</button>
      </li>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "listType",
        ruleName: "list",
        content: "listType.menu",
      },
      {
        type: "list",
        ruleName: "list",
        content: "2",
        contentLabel: "List items",
      },
    ]);
  });

  test("ul role=menu with li without explicit role", () => {
    const element = document.createElement("ul");
    element.setAttribute("role", "menu");
    element.innerHTML = `
      <li>0</li>
      <li>1</li>
      <li>2</li>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "listType",
        ruleName: "list",
        content: "listType.menu",
      },
      {
        type: "list",
        ruleName: "list",
        content: "3",
        contentLabel: "List items",
      },
    ]);
  });

  test("ul role=tablist does not show item count", () => {
    const element = document.createElement("ul");
    element.setAttribute("role", "tablist");
    element.innerHTML = `
      <li role="tab">0</li>
      <li role="tab">1</li>
      <li role="tab">2</li>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result?.find((r) => r.type === "list")).toBeUndefined();
  });

  test("ul role=navigation does not show item count", () => {
    const element = document.createElement("ul");
    element.setAttribute("role", "navigation");
    element.innerHTML = `
      <li>0</li>
      <li>1</li>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result?.find((r) => r.type === "list")).toBeUndefined();
  });

  test("ol role=tablist does not show item count", () => {
    const element = document.createElement("ol");
    element.setAttribute("role", "tablist");
    element.innerHTML = `
      <li role="tab">0</li>
      <li role="tab">1</li>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result?.find((r) => r.type === "list")).toBeUndefined();
  });

  test("ul role=menubar with li role=menuitem", () => {
    const element = document.createElement("ul");
    element.setAttribute("role", "menubar");
    element.innerHTML = `
      <li role="menuitem">0</li>
      <li role="menuitem">1</li>
    `;
    document.body.appendChild(element);
    const result = List.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "listType",
        ruleName: "list",
        content: "listType.menubar",
      },
      {
        type: "list",
        ruleName: "list",
        content: "2",
        contentLabel: "List items",
      },
    ]);
  });
});

describe("getListItems", () => {
  test("ul", () => {
    const element = document.createElement("ul");
    element.innerHTML = `
      <li>0</li>
      <li>1</li>
    `;
    expect(getListItems(element, "ul", getKnownRole(element))).toEqual([
      element.children[0],
      element.children[1],
    ]);
  });
  test("ol", () => {
    const element = document.createElement("ol");
    element.innerHTML = `
      <li>0</li>
      <li>1</li>
      <li>2</li>
    `;
    expect(getListItems(element, "ol", getKnownRole(element))).toEqual([
      element.children[0],
      element.children[1],
      element.children[2],
    ]);
  });

  ["ul", "ol"].forEach((tagName) => {
    test(`${tagName} has presentational children`, () => {
      const element = document.createElement(tagName);
      element.innerHTML = `
        <li>0</li>
        <li role="presentation">1</li>
        <li role="none">2</li>
        <li role="presentation">
          <div>3-0</div>
          <div role="listitem">3-1</div>
          <div role="menuitem">3-2</div>
        </li>
        <li role="listitem">4</li>
        <li role="presentation">
          <ul role="presentation">
            <li>5-0</li>
            <li role="listitem">5-1</li>
          </ul>
        </li>
        <div role="listitem">6</div>
      `;
      expect(getListItems(element, tagName, getKnownRole(element))).toEqual([
        element.children[0],
        element.children[3].children[1],
        element.children[4],
        element.children[5].children[0].children[1],
      ]);
    });
  });

  test("menu has presentational children", () => {
    const element = document.createElement("menu");
    element.innerHTML = `
      <li>0</li>
      <li role="presentation">1</li>
      <li role="none">2</li>
      <li role="presentation">
        <div>3-0</div>
        <div role="listitem">3-1</div>
        <div role="menuitem">3-2</div>
      </li>
      <li role="listitem">4</li>
      <li role="menuitem">5</li>
      <li role="presentation">
        <ul role="presentation">
          <li>6-0</li>
          <li role="listitem">6-1</li>
        </ul>
      </li>
      <div role="listitem">7</div>
    `;
    expect(getListItems(element, "menu", getKnownRole(element))).toEqual([
      element.children[0],
      element.children[3].children[1],
      element.children[3].children[2],
      element.children[4],
      element.children[5],
      element.children[6].children[0].children[1],
    ]);
  });

  ["list", "directory"].forEach((listRole) => {
    test(`div ${listRole}`, () => {
      const element = document.createElement("div");
      element.setAttribute("role", listRole);
      element.innerHTML = `
        <div role="listitem">0</div>
        <div role="listitem">1</div>
        <div role="presentation">2</div>
        <div role="none">3</div>
        <div>4</div>
        <div role="menuitem">5</div>
        <div role="presentation">
          <div>6-0</div>
          <div role="listitem">6-1</div>
          <div role="menuitem">6-2</div>
          <div role="presentation">
            <div>6-3-0</div>
            <div role="presentation">6-3-1</div>
            <div role="listitem">6-3-2</div>
          </div>
        </div>
        <div>
          <div role="listitem">7-0</div>
          <div role="listitem">7-1</div>
        </div>
      `;
      expect(getListItems(element, "div", getKnownRole(element))).toEqual([
        element.children[0],
        element.children[1],
        element.children[6].children[1],
        element.children[6].children[3].children[2],
        element.children[7].children[0],
        element.children[7].children[1],
      ]);
    });
  });

  test("dl", () => {
    const element = document.createElement("dl");
    element.innerHTML = `
      <dt>0</dt>
      <dd>1</dd>
      <div>
        <dt>2-0</dt>
        <dd>2-1</dd>
        <dt>2-2</dt>
        <dd>2-3</dd>
        <div>2-4</div>
        <div role="listitem">2-5</div>
        <div role="menuitem">2-6</div>
      </div>
      <dt role="presentation">3</dt>
      <dd role="none">4</dd>
      <div role="presentation">
        <dt>5-0</dt>
        <dd>5-1</dd>
      </div>
      <div role="presentation">
        <div>
          <dt>6-0</dt>
          <dd>6-1</dd>
        </div>
      </div>
    `;
    expect(getListItems(element, "dl", getKnownRole(element))).toEqual([
      element.children[0],
      element.children[1],
      element.children[2].children[0],
      element.children[2].children[1],
      element.children[2].children[2],
      element.children[2].children[3],
      element.children[5].children[0],
      element.children[5].children[1],
    ]);
  });

  test("ul role=menu with li role=menuitem", () => {
    const element = document.createElement("ul");
    element.setAttribute("role", "menu");
    element.innerHTML = `
      <li role="menuitem">0</li>
      <li role="menuitem">1</li>
      <li role="menuitemcheckbox">2</li>
    `;
    document.body.appendChild(element);
    expect(getListItems(element, "ul", "menu")).toEqual([
      element.children[0],
      element.children[1],
      element.children[2],
    ]);
  });

  test("ul role=menu with li role=none wrapping menuitem", () => {
    const element = document.createElement("ul");
    element.setAttribute("role", "menu");
    element.innerHTML = `
      <li role="none">
        <button role="menuitem">0</button>
      </li>
      <li role="none">
        <button role="menuitem">1</button>
      </li>
    `;
    document.body.appendChild(element);
    expect(getListItems(element, "ul", "menu")).toEqual([
      element.children[0].children[0],
      element.children[1].children[0],
    ]);
  });

  test("ul role=menu with li role=group", () => {
    const element = document.createElement("ul");
    element.setAttribute("role", "menu");
    element.innerHTML = `
      <li role="menuitem">0</li>
      <li role="group">
        <ul role="group">
          <li role="menuitemcheckbox">1-0</li>
          <li role="menuitemradio">1-1</li>
        </ul>
      </li>
    `;
    document.body.appendChild(element);
    expect(getListItems(element, "ul", "menu")).toEqual([
      element.children[0],
      element.children[1].children[0].children[0],
      element.children[1].children[0].children[1],
    ]);
  });

  ["menu", "menubar"].forEach((menuRole) => {
    test(`div role=${menuRole} with menuitem children`, () => {
      const element = document.createElement("div");
      element.setAttribute("role", menuRole);
      element.innerHTML = `
        <div role="menuitem">0</div>
        <div role="menuitemcheckbox">1</div>
        <div role="menuitemradio">2</div>
        <div role="group">
          <div role="menuitem">3-0</div>
          <div role="menuitem">3-1</div>
        </div>
      `;
      document.body.appendChild(element);
      expect(getListItems(element, "div", menuRole)).toEqual([
        element.children[0],
        element.children[1],
        element.children[2],
        element.children[3].children[0],
        element.children[3].children[1],
      ]);
    });
  });
});
