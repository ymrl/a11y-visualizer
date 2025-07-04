import { describe, test, expect, afterEach } from "vitest";
import { IdReference } from "./index";

describe("IdReference", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("validates for attribute with existing ID", () => {
    document.body.innerHTML = `
      <label for="test-input">Label</label>
      <input id="test-input" />
    `;
    const label = document.querySelector("label")!;
    const result = IdReference.evaluate(label, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("reports error for for attribute with non-existing ID", () => {
    document.body.innerHTML = `<label for="non-existent">Label</label>`;
    const label = document.querySelector("label")!;
    const result = IdReference.evaluate(label, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      type: "error",
      message: "Referenced IDs do not exist: {{ids}}",
      messageParams: {
        ids: "non-existent",
        attributes: "for",
      },
      ruleName: "id-reference",
    });
  });

  test("validates aria-labelledby with existing ID", () => {
    document.body.innerHTML = `
      <div id="title">Title</div>
      <div aria-labelledby="title">Content</div>
    `;
    const element = document.querySelector("div[aria-labelledby]")!;
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("reports error for aria-labelledby with non-existing ID", () => {
    document.body.innerHTML = `<div aria-labelledby="missing-id">Content</div>`;
    const element = document.querySelector("div")!;
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      type: "error",
      message: "Referenced IDs do not exist: {{ids}}",
      messageParams: {
        ids: "missing-id",
        attributes: "aria-labelledby",
      },
      ruleName: "id-reference",
    });
  });

  test("validates aria-labelledby with multiple existing IDs", () => {
    document.body.innerHTML = `
      <div id="title1">Title 1</div>
      <div id="title2">Title 2</div>
      <div aria-labelledby="title1 title2">Content</div>
    `;
    const element = document.querySelector("div[aria-labelledby]")!;
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("reports error for aria-labelledby with one non-existing ID in list", () => {
    document.body.innerHTML = `
      <div id="title1">Title 1</div>
      <div aria-labelledby="title1 missing-id">Content</div>
    `;
    const element = document.querySelector("div[aria-labelledby]")!;
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      type: "error",
      message: "Referenced IDs do not exist: {{ids}}",
      messageParams: {
        ids: "missing-id",
        attributes: "aria-labelledby",
      },
      ruleName: "id-reference",
    });
  });

  test("validates aria-activedescendant with existing ID", () => {
    document.body.innerHTML = `
      <div role="listbox" aria-activedescendant="option1">
        <div id="option1" role="option">Option 1</div>
      </div>
    `;
    const listbox = document.querySelector("div[role='listbox']")!;
    const result = IdReference.evaluate(
      listbox,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("reports error for aria-activedescendant with non-existing ID", () => {
    document.body.innerHTML = `
      <div role="listbox" aria-activedescendant="missing-option">
        <div id="option1" role="option">Option 1</div>
      </div>
    `;
    const listbox = document.querySelector("div[role='listbox']")!;
    const result = IdReference.evaluate(
      listbox,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      type: "error",
      message: "Referenced IDs do not exist: {{ids}}",
      messageParams: {
        ids: "missing-option",
        attributes: "aria-activedescendant",
      },
      ruleName: "id-reference",
    });
  });

  test("validates aria-describedby with multiple existing IDs", () => {
    document.body.innerHTML = `
      <div id="desc1">Description 1</div>
      <div id="desc2">Description 2</div>
      <button aria-describedby="desc1 desc2">Button</button>
    `;
    const button = document.querySelector("button")!;
    const result = IdReference.evaluate(button, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("reports consolidated error for multiple non-existing IDs", () => {
    document.body.innerHTML = `
      <div aria-labelledby="missing1 missing2">Content</div>
    `;
    const element = document.querySelector("div")!;
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      type: "error",
      message: "Referenced IDs do not exist: {{ids}}",
      messageParams: {
        ids: "missing1, missing2",
        attributes: "aria-labelledby",
      },
      ruleName: "id-reference",
    });
  });

  test("reports consolidated error for mixed attributes with missing IDs", () => {
    document.body.innerHTML = `
      <label for="missing-input" aria-describedby="missing-desc1 missing-desc2">Label</label>
    `;
    const label = document.querySelector("label")!;
    const result = IdReference.evaluate(label, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      type: "error",
      message: "Referenced IDs do not exist: {{ids}}",
      messageParams: {
        ids: "missing-input, missing-desc1, missing-desc2",
        attributes: "for, aria-describedby",
      },
      ruleName: "id-reference",
    });
  });

  test("ignores empty attribute values", () => {
    document.body.innerHTML = `<div aria-labelledby="">Content</div>`;
    const element = document.querySelector("div")!;
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("ignores whitespace-only attribute values", () => {
    document.body.innerHTML = `<div aria-labelledby="   ">Content</div>`;
    const element = document.querySelector("div")!;
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("returns undefined when disabled", () => {
    document.body.innerHTML = `<label for="non-existent">Label</label>`;
    const label = document.querySelector("label")!;
    const result = IdReference.evaluate(label, { enabled: false }, {});
    expect(result).toBeUndefined();
  });

  test("handles elements without ID reference attributes", () => {
    document.body.innerHTML = `<div>Content</div>`;
    const element = document.querySelector("div")!;
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("validates aria-controls with existing ID", () => {
    document.body.innerHTML = `
      <button aria-controls="panel">Toggle</button>
      <div id="panel">Panel content</div>
    `;
    const button = document.querySelector("button")!;
    const result = IdReference.evaluate(button, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("validates aria-details with existing ID", () => {
    document.body.innerHTML = `
      <div aria-details="detail-info">Content</div>
      <div id="detail-info">Detailed information</div>
    `;
    const element = document.querySelector("div[aria-details]")!;
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("validates aria-errormessage with existing ID", () => {
    document.body.innerHTML = `
      <input aria-errormessage="error-msg" />
      <div id="error-msg">Error message</div>
    `;
    const input = document.querySelector("input")!;
    const result = IdReference.evaluate(input, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("validates list attribute with existing datalist ID", () => {
    document.body.innerHTML = `
      <input list="browsers" />
      <datalist id="browsers">
        <option value="Chrome">
        <option value="Firefox">
      </datalist>
    `;
    const input = document.querySelector("input")!;
    const result = IdReference.evaluate(input, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("reports error for list attribute with non-existing ID", () => {
    document.body.innerHTML = `<input list="missing-datalist" />`;
    const input = document.querySelector("input")!;
    const result = IdReference.evaluate(input, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      type: "error",
      message: "Referenced IDs do not exist: {{ids}}",
      messageParams: {
        ids: "missing-datalist",
        attributes: "list",
      },
      ruleName: "id-reference",
    });
  });

  test("validates form attribute with existing form ID", () => {
    document.body.innerHTML = `
      <form id="my-form"></form>
      <input form="my-form" />
    `;
    const input = document.querySelector("input")!;
    const result = IdReference.evaluate(input, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("reports error for form attribute with non-existing ID", () => {
    document.body.innerHTML = `<input form="missing-form" />`;
    const input = document.querySelector("input")!;
    const result = IdReference.evaluate(input, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      type: "error",
      message: "Referenced IDs do not exist: {{ids}}",
      messageParams: {
        ids: "missing-form",
        attributes: "form",
      },
      ruleName: "id-reference",
    });
  });

  test("validates headers attribute with existing header IDs", () => {
    document.body.innerHTML = `
      <table>
        <tr>
          <th id="name">Name</th>
          <th id="age">Age</th>
        </tr>
        <tr>
          <td headers="name age">John Doe</td>
        </tr>
      </table>
    `;
    const td = document.querySelector("td")!;
    const result = IdReference.evaluate(td, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("reports error for headers attribute with non-existing ID", () => {
    document.body.innerHTML = `
      <table>
        <tr>
          <th id="name">Name</th>
        </tr>
        <tr>
          <td headers="name missing-header">John Doe</td>
        </tr>
      </table>
    `;
    const td = document.querySelector("td")!;
    const result = IdReference.evaluate(td, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      type: "error",
      message: "Referenced IDs do not exist: {{ids}}",
      messageParams: {
        ids: "missing-header",
        attributes: "headers",
      },
      ruleName: "id-reference",
    });
  });

  test("validates multiple headers with all existing IDs", () => {
    document.body.innerHTML = `
      <table>
        <tr>
          <th id="header1">Header 1</th>
          <th id="header2">Header 2</th>
          <th id="header3">Header 3</th>
        </tr>
        <tr>
          <td headers="header1 header2 header3">Data</td>
        </tr>
      </table>
    `;
    const td = document.querySelector("td")!;
    const result = IdReference.evaluate(td, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("validates contextmenu attribute with existing menu ID", () => {
    document.body.innerHTML = `
      <menu id="context-menu">
        <menuitem>Cut</menuitem>
        <menuitem>Copy</menuitem>
      </menu>
      <div contextmenu="context-menu">Right-click me</div>
    `;
    const div = document.querySelector("div")!;
    const result = IdReference.evaluate(div, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("reports error for contextmenu attribute with non-existing ID", () => {
    document.body.innerHTML = `<div contextmenu="missing-menu">Right-click me</div>`;
    const div = document.querySelector("div")!;
    const result = IdReference.evaluate(div, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      type: "error",
      message: "Referenced IDs do not exist: {{ids}}",
      messageParams: {
        ids: "missing-menu",
        attributes: "contextmenu",
      },
      ruleName: "id-reference",
    });
  });
});
