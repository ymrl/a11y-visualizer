import { afterEach, describe, expect, test } from "vitest";
import { TableSize } from "./index";

describe("table-size", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("table", () => {
    const table = document.createElement("table");
    table.innerHTML = `
        <colgroup span="1"></colgroup>
        <colgroup span="2"></colgroup>
        <colgroup span="2"></colgroup>
        <thead>
          <tr>
            <th id="cell-0-0">0-0</th>
            <th id="cell-0-1" scope="colgroup">0-1</th>
            <th id="cell-0-2" scope="col">0-2</th>
            <th id="cell-0-3" colspan="2">0-3</th>
            <th id="cell-0-5" colspan="2">0-5</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" rowspan="2" id="cell-1-0">1-0</th>
            <td id="cell-1-1">1-1</td>
            <td id="cell-1-2">1-2</td>
            <td id="cell-1-3">1-3</td>
            <td id="cell-1-4">1-4</td>
            <td id="cell-1-5">1-5</td>
          </tr>
          <tr>
            <th id="cell-2-1" scope="row">2-1(0)</th>
            <td id="cell-2-2">2-2(1)</td>
            <td id="cell-2-3">2-3(2)</td>
            <td id="cell-2-4">2-4(3)</td>
            <td id="cell-2-5">2-5(4)</td>
          </tr>
        </tbody>
    `;
    document.body.appendChild(table);
    const result = TableSize.evaluate(table, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "tableSize",
        content: "7x3",
        contentLabel: "Table size",
        ruleName: "table-size",
      },
    ]);
  });

  ["table", "grid", "treegrid"].forEach((role) => {
    test(`table is role=${role}`, () => {
      const table = document.createElement("table");
      table.setAttribute("role", role);
      table.innerHTML = `
        <div role="row">
          <div id="0-0" role="columnheader">0-0</div>
          <div id="0-1" role="columnheader">0-1</div>
          <div id="0-2" role="columnheader">0-2</div>
        </div>
        <div role="row">
          <div id="1-0" role="rowheader">1-0</div>
          <div id="1-1" role="${role === "table" ? "cell" : "gridcell"}">1-1</div>
          <div id="1-2" role="${role === "table" ? "cell" : "gridcell"}">1-2</div>
        </div>
        <div role="row">
          <div id="2-0" role="rowheader">2-0</div>
          <div id="2-1" role="${role === "table" ? "cell" : "gridcell"}">2-1</div>
          <div id="2-2" role="${role === "table" ? "cell" : "gridcell"}">2-2</div>
        </div>
      `;
      document.body.appendChild(table);
      const result = TableSize.evaluate(table, { enabled: true }, {});
      expect(result).toEqual([
        {
          type: "tableSize",
          content: "3x3",
          contentLabel: "Table size",
          ruleName: "table-size",
        },
      ]);
    });
  });
});
