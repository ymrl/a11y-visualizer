import { afterEach, describe, expect, test } from "vitest";
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
    const label = document.querySelector("label");
    if (!label) {
      throw new Error("Label element not found");
    }
    const result = IdReference.evaluate(label, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("reports warning for for attribute with non-existing ID", () => {
    document.body.innerHTML = `<label for="non-existent">Label</label>`;
    const label = document.querySelector("label");
    if (!label) {
      throw new Error("Label element not found");
    }
    const result = IdReference.evaluate(label, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Referenced IDs do not exist: {{idsWithAttributes}}",
      messageParams: {
        idsWithAttributes: "non-existent (for)",
      },
      ruleName: "id-reference",
    });
  });

  test("validates aria-labelledby with existing ID", () => {
    document.body.innerHTML = `
      <div id="title">Title</div>
      <div aria-labelledby="title">Content</div>
    `;
    const element = document.querySelector("div[aria-labelledby]");
    if (!element) {
      throw new Error("Element with aria-labelledby not found");
    }
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("reports warning for aria-labelledby with non-existing ID", () => {
    document.body.innerHTML = `<div aria-labelledby="missing-id">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element with aria-labelledby not found");
    }
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Referenced IDs do not exist: {{idsWithAttributes}}",
      messageParams: {
        idsWithAttributes: "missing-id (aria-labelledby)",
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
    const element = document.querySelector("div[aria-labelledby]");
    if (!element) {
      throw new Error("Element with aria-labelledby not found");
    }
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("reports warning for aria-labelledby with one non-existing ID in list", () => {
    document.body.innerHTML = `
      <div id="title1">Title 1</div>
      <div aria-labelledby="title1 missing-id">Content</div>
    `;
    const element = document.querySelector("div[aria-labelledby]");
    if (!element) {
      throw new Error("Element with aria-labelledby not found");
    }
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Referenced IDs do not exist: {{idsWithAttributes}}",
      messageParams: {
        idsWithAttributes: "missing-id (aria-labelledby)",
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
    const listbox = document.querySelector("div[role='listbox']");
    if (!listbox) {
      throw new Error("Listbox element not found");
    }
    const result = IdReference.evaluate(
      listbox,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("reports warning for aria-activedescendant with non-existing ID", () => {
    document.body.innerHTML = `
      <div role="listbox" aria-activedescendant="missing-option">
        <div id="option1" role="option">Option 1</div>
      </div>
    `;
    const listbox = document.querySelector("div[role='listbox']");
    if (!listbox) {
      throw new Error("Listbox element not found");
    }
    const result = IdReference.evaluate(
      listbox,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Referenced IDs do not exist: {{idsWithAttributes}}",
      messageParams: {
        idsWithAttributes: "missing-option (aria-activedescendant)",
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
    const button = document.querySelector("button");
    if (!button) {
      throw new Error("Button element not found");
    }
    const result = IdReference.evaluate(button, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("reports consolidated warning for multiple non-existing IDs", () => {
    document.body.innerHTML = `
      <div aria-labelledby="missing1 missing2">Content</div>
    `;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element with aria-labelledby not found");
    }
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Referenced IDs do not exist: {{idsWithAttributes}}",
      messageParams: {
        idsWithAttributes: "missing1, missing2 (aria-labelledby)",
      },
      ruleName: "id-reference",
    });
  });

  test("reports consolidated warning for mixed attributes with missing IDs", () => {
    document.body.innerHTML = `
      <label for="missing-input" aria-describedby="missing-desc1 missing-desc2">Label</label>
    `;
    const label = document.querySelector("label");
    if (!label) {
      throw new Error("Label element not found");
    }
    const result = IdReference.evaluate(label, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Referenced IDs do not exist: {{idsWithAttributes}}",
      messageParams: {
        idsWithAttributes:
          "missing-input (for); missing-desc1, missing-desc2 (aria-describedby)",
      },
      ruleName: "id-reference",
    });
  });

  test("reports warning for multiple single ID attributes with missing IDs", () => {
    document.body.innerHTML = `
      <input form="missing-form" list="missing-datalist" aria-activedescendant="missing-active" />
    `;
    const input = document.querySelector("input");
    if (!input) {
      throw new Error("Input element not found");
    }
    const result = IdReference.evaluate(input, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Referenced IDs do not exist: {{idsWithAttributes}}",
      messageParams: {
        idsWithAttributes:
          "missing-active (aria-activedescendant); missing-datalist (list); missing-form (form)",
      },
      ruleName: "id-reference",
    });
  });

  test("reports warning for multiple list attributes with missing IDs", () => {
    document.body.innerHTML = `
      <div aria-labelledby="missing-label1 missing-label2" aria-describedby="missing-desc1 missing-desc2" aria-controls="missing-control1 missing-control2">
        Content
      </div>
    `;
    const div = document.querySelector("div");
    if (!div) {
      throw new Error("Div element not found");
    }
    const result = IdReference.evaluate(div, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Referenced IDs do not exist: {{idsWithAttributes}}",
      messageParams: {
        idsWithAttributes:
          "missing-desc1, missing-desc2 (aria-describedby); missing-label1, missing-label2 (aria-labelledby); missing-control1, missing-control2 (aria-controls)",
      },
      ruleName: "id-reference",
    });
  });

  test("iframe: resolves IDs within iframe document (valid)", () => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) throw new Error("no contentDocument");
    iframeDoc.open();
    iframeDoc.write(
      "<!doctype html><html><body>\n" +
        '  <span id="label">Label</span>\n' +
        '  <input id="field" aria-labelledby="label">\n' +
        "</body></html>",
    );
    iframeDoc.close();
    const el = iframeDoc.getElementById("field");
    if (!el) throw new Error("missing field");

    const result = IdReference.evaluate(el, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("iframe: reports missing IDs within iframe document (invalid)", () => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) throw new Error("no contentDocument");
    iframeDoc.open();
    iframeDoc.write(
      "<!doctype html><html><body>\n" +
        '  <input id="field" aria-labelledby="missing">\n' +
        "</body></html>",
    );
    iframeDoc.close();
    const el = iframeDoc.getElementById("field");
    if (!el) throw new Error("missing field");

    const result = IdReference.evaluate(el, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "warning",
        ruleName: "id-reference",
        message: "Referenced IDs do not exist: {{idsWithAttributes}}",
        messageParams: { idsWithAttributes: "missing (aria-labelledby)" },
      },
    ]);
  });

  test("reports warning for mixed single and list attributes with partial missing IDs", () => {
    document.body.innerHTML = `
      <div id="existing-label">Label</div>
      <div id="existing-desc">Description</div>
      <button 
        aria-labelledby="existing-label missing-label2" 
        aria-describedby="existing-desc missing-desc2 missing-desc3" 
        aria-activedescendant="missing-active"
      >
        Button
      </button>
    `;
    const button = document.querySelector("button");
    if (!button) {
      throw new Error("Button element not found");
    }
    const result = IdReference.evaluate(button, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Referenced IDs do not exist: {{idsWithAttributes}}",
      messageParams: {
        idsWithAttributes:
          "missing-active (aria-activedescendant); missing-desc2, missing-desc3 (aria-describedby); missing-label2 (aria-labelledby)",
      },
      ruleName: "id-reference",
    });
  });

  test("reports warning for table cell with multiple missing headers", () => {
    document.body.innerHTML = `
      <table>
        <tr>
          <th id="existing-header1">Header 1</th>
        </tr>
        <tr>
          <td headers="existing-header1 missing-header2 missing-header3" aria-describedby="missing-desc1">
            Cell content
          </td>
        </tr>
      </table>
    `;
    const td = document.querySelector("td");
    if (!td) {
      throw new Error("Table cell (td) element not found");
    }
    const result = IdReference.evaluate(td, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Referenced IDs do not exist: {{idsWithAttributes}}",
      messageParams: {
        idsWithAttributes:
          "missing-desc1 (aria-describedby); missing-header2, missing-header3 (headers)",
      },
      ruleName: "id-reference",
    });
  });

  test("ignores empty attribute values", () => {
    document.body.innerHTML = `<div aria-labelledby="">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element with aria-labelledby not found");
    }
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("ignores whitespace-only attribute values", () => {
    document.body.innerHTML = `<div aria-labelledby="   ">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element with aria-labelledby not found");
    }
    const result = IdReference.evaluate(
      element,
      IdReference.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("returns undefined when disabled", () => {
    document.body.innerHTML = `<label for="non-existent">Label</label>`;
    const label = document.querySelector("label");
    if (!label) {
      throw new Error("Label element not found");
    }
    const result = IdReference.evaluate(label, { enabled: false }, {});
    expect(result).toBeUndefined();
  });

  test("handles elements without ID reference attributes", () => {
    document.body.innerHTML = `<div>Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Div element not found");
    }
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
    const button = document.querySelector("button");
    if (!button) {
      throw new Error("Button element not found");
    }
    const result = IdReference.evaluate(button, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("validates aria-details with existing ID", () => {
    document.body.innerHTML = `
      <div aria-details="detail-info">Content</div>
      <div id="detail-info">Detailed information</div>
    `;
    const element = document.querySelector("div[aria-details]");
    if (!element) {
      throw new Error("Element with aria-details not found");
    }
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
    const input = document.querySelector("input");
    if (!input) {
      throw new Error("Input element not found");
    }
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
    const input = document.querySelector("input");
    if (!input) {
      throw new Error("Input element not found");
    }
    const result = IdReference.evaluate(input, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("reports warning for list attribute with non-existing ID", () => {
    document.body.innerHTML = `<input list="missing-datalist" />`;
    const input = document.querySelector("input");
    if (!input) {
      throw new Error("Input element not found");
    }
    const result = IdReference.evaluate(input, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Referenced IDs do not exist: {{idsWithAttributes}}",
      messageParams: {
        idsWithAttributes: "missing-datalist (list)",
      },
      ruleName: "id-reference",
    });
  });

  test("validates form attribute with existing form ID", () => {
    document.body.innerHTML = `
      <form id="my-form"></form>
      <input form="my-form" />
    `;
    const input = document.querySelector("input");
    if (!input) {
      throw new Error("Input element not found");
    }
    const result = IdReference.evaluate(input, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("reports warning for form attribute with non-existing ID", () => {
    document.body.innerHTML = `<input form="missing-form" />`;
    const input = document.querySelector("input");
    if (!input) {
      throw new Error("Input element not found");
    }
    const result = IdReference.evaluate(input, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Referenced IDs do not exist: {{idsWithAttributes}}",
      messageParams: {
        idsWithAttributes: "missing-form (form)",
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
    const td = document.querySelector("td");
    if (!td) {
      throw new Error("Table cell (td) element not found");
    }
    const result = IdReference.evaluate(td, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("reports warning for headers attribute with non-existing ID", () => {
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
    const td = document.querySelector("td");
    if (!td) {
      throw new Error("Table cell (td) element not found");
    }
    const result = IdReference.evaluate(td, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Referenced IDs do not exist: {{idsWithAttributes}}",
      messageParams: {
        idsWithAttributes: "missing-header (headers)",
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
    const td = document.querySelector("td");
    if (!td) {
      throw new Error("Table cell (td) element not found");
    }
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
    const div = document.querySelector("div");
    if (!div) {
      throw new Error("Div element not found");
    }
    const result = IdReference.evaluate(div, IdReference.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("reports warning for contextmenu attribute with non-existing ID", () => {
    document.body.innerHTML = `<div contextmenu="missing-menu">Right-click me</div>`;
    const div = document.querySelector("div");
    if (!div) {
      throw new Error("Div element not found");
    }
    const result = IdReference.evaluate(div, IdReference.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Referenced IDs do not exist: {{idsWithAttributes}}",
      messageParams: {
        idsWithAttributes: "missing-menu (contextmenu)",
      },
      ruleName: "id-reference",
    });
  });

  describe("Exception conditions", () => {
    test("ignores aria-controls when aria-expanded='false'", () => {
      document.body.innerHTML = `
        <button aria-controls="missing-panel" aria-expanded="false">Toggle</button>
      `;
      const button = document.querySelector("button");
      if (!button) {
        throw new Error("Button element not found");
      }
      const result = IdReference.evaluate(
        button,
        IdReference.defaultOptions,
        {},
      );
      expect(result).toBeUndefined();
    });

    test("reports warning for aria-controls when aria-expanded='true' with missing ID", () => {
      document.body.innerHTML = `
        <button aria-controls="missing-panel" aria-expanded="true">Toggle</button>
      `;
      const button = document.querySelector("button");
      if (!button) {
        throw new Error("Button element not found");
      }
      const result = IdReference.evaluate(
        button,
        IdReference.defaultOptions,
        {},
      );
      expect(result).toHaveLength(1);
      expect(result?.[0]).toEqual({
        type: "warning",
        message: "Referenced IDs do not exist: {{idsWithAttributes}}",
        messageParams: {
          idsWithAttributes: "missing-panel (aria-controls)",
        },
        ruleName: "id-reference",
      });
    });

    test("ignores aria-controls when role='tab' and aria-selected='false'", () => {
      document.body.innerHTML = `
        <div role="tab" aria-controls="missing-tabpanel" aria-selected="false">Tab</div>
      `;
      const tab = document.querySelector("div");
      if (!tab) {
        throw new Error("Tab element not found");
      }
      const result = IdReference.evaluate(tab, IdReference.defaultOptions, {});
      expect(result).toBeUndefined();
    });

    test("reports warning for aria-controls when role='tab' and aria-selected='true' with missing ID", () => {
      document.body.innerHTML = `
        <div role="tab" aria-controls="missing-tabpanel" aria-selected="true">Tab</div>
      `;
      const tab = document.querySelector("div");
      if (!tab) {
        throw new Error("Tab element not found");
      }
      const result = IdReference.evaluate(tab, IdReference.defaultOptions, {});
      expect(result).toHaveLength(1);
      expect(result?.[0]).toEqual({
        type: "warning",
        message: "Referenced IDs do not exist: {{idsWithAttributes}}",
        messageParams: {
          idsWithAttributes: "missing-tabpanel (aria-controls)",
        },
        ruleName: "id-reference",
      });
    });

    test("reports warning for aria-controls when role='tab' but no aria-selected attribute", () => {
      document.body.innerHTML = `
        <div role="tab" aria-controls="missing-tabpanel">Tab</div>
      `;
      const tab = document.querySelector("div");
      if (!tab) {
        throw new Error("Tab element not found");
      }
      const result = IdReference.evaluate(tab, IdReference.defaultOptions, {});
      expect(result).toHaveLength(1);
      expect(result?.[0]).toEqual({
        type: "warning",
        message: "Referenced IDs do not exist: {{idsWithAttributes}}",
        messageParams: {
          idsWithAttributes: "missing-tabpanel (aria-controls)",
        },
        ruleName: "id-reference",
      });
    });

    test("reports warning for other attributes even when aria-expanded='false'", () => {
      document.body.innerHTML = `
        <button aria-controls="missing-panel" aria-describedby="missing-desc" aria-expanded="false">Toggle</button>
      `;
      const button = document.querySelector("button");
      if (!button) {
        throw new Error("Button element not found");
      }
      const result = IdReference.evaluate(
        button,
        IdReference.defaultOptions,
        {},
      );
      expect(result).toHaveLength(1);
      expect(result?.[0]).toEqual({
        type: "warning",
        message: "Referenced IDs do not exist: {{idsWithAttributes}}",
        messageParams: {
          idsWithAttributes: "missing-desc (aria-describedby)",
        },
        ruleName: "id-reference",
      });
    });

    test("handles combined exception conditions correctly", () => {
      document.body.innerHTML = `
        <div role="tab" aria-controls="missing-tabpanel" aria-selected="false" aria-labelledby="missing-label">
          Tab
        </div>
      `;
      const tab = document.querySelector("div");
      if (!tab) {
        throw new Error("Tab element not found");
      }
      const result = IdReference.evaluate(tab, IdReference.defaultOptions, {});
      expect(result).toHaveLength(1);
      expect(result?.[0]).toEqual({
        type: "warning",
        message: "Referenced IDs do not exist: {{idsWithAttributes}}",
        messageParams: {
          idsWithAttributes: "missing-label (aria-labelledby)",
        },
        ruleName: "id-reference",
      });
    });
  });
});
