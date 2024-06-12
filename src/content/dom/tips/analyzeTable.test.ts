import { describe, test, expect, afterEach } from "vitest";
import { analyzeTable } from "./analyzeTable";

describe("analyzeTable", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("basic table", () => {
    const table = document.createElement("table");
    table.innerHTML = `
    <thead>
    <tr>
    <th>Header 1</th>
    <th>Header 2</th>
    <th>Header 3</th>
    </thead>
    <tbody>
    <tr>
    <td>Cell 1</td>
    <td>Cell 2</td>
    <td>Cell 3</td>
    </tr>
    <tr>
    <td>Cell 1</td>
    <td>Cell 2</td>
    <td>Cell 3</td>
    </tr>
    </tbody>
    `;
    document.body.appendChild(table);
    const result = analyzeTable(table);
    expect(result.cells).toHaveLength(3);
    expect(result.cells[0]).toHaveLength(3);
    expect(result.cells[1]).toHaveLength(3);
    expect(result.cells[2]).toHaveLength(3);
    for (let x = 0; x < 3; x++) {
      expect(result.cells[0][x].header).toBeTruthy();
      expect(result.cells[1][x].header).toBeFalsy();
      expect(result.cells[2][x].header).toBeFalsy();
      expect(result.cells[0][x].positionY).toBe(0);
      expect(result.cells[1][x].positionY).toBe(1);
      expect(result.cells[2][x].positionY).toBe(2);
      for (let y = 0; y < 3; y++) {
        expect(result.cells[y][x].positionY).toBe(y);
        expect(result.cells[y][x].positionX).toBe(x);
        expect(result.cells[y][x].sizeY).toBe(1);
        expect(result.cells[y][x].sizeX).toBe(1);
      }
      expect(result.cells[0][x].headers).toHaveLength(0);
      for (let y = 1; y < 3; y++) {
        expect(result.cells[y][x].headers).toHaveLength(1);
        expect(result.cells[y][x].headers[0]).toBe(result.cells[0][x].element);
      }
    }
    expect(result.rowGroups).toHaveLength(2);
    expect(result.rowGroups[0].positionY).toBe(0);
    expect(result.rowGroups[0].sizeY).toBe(1);
    expect(result.rowGroups[1].positionY).toBe(1);
    expect(result.rowGroups[1].sizeY).toBe(2);
    expect(result.colGroups).toHaveLength(1);
    expect(result.colGroups[0].positionX).toBe(0);
    expect(result.colGroups[0].sizeX).toBe(3);
  });

  test("rowspan", () => {
    const table = document.createElement("table");
    table.innerHTML = `
    <thead>
    <tr>
    <th>Header 1</th>
    <th>Header 2</th>
    <th>Header 3</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td rowSpan="2">Cell 1</td>
    <td>Cell 2</td>
    <td>Cell 3</td>
    </tr>
    <tr>
    <td>Cell 2</td>
    <td>Cell 3</td>
    </tr>
    <tr>
    <td>Cell 1</td>
    <td>Cell 2</td>
    <td>Cell 3</td>
    </tr>
    </tbody>
    `;
    document.body.appendChild(table);
    const result = analyzeTable(table);
    expect(result.cells).toHaveLength(4);
    expect(result.cells[0]).toHaveLength(3);
    expect(result.cells[1]).toHaveLength(3);
    expect(result.cells[2]).toHaveLength(2);
    expect(result.cells[3]).toHaveLength(3);
    for (let x = 0; x < 3; x++) {
      expect(result.cells[0][x].positionY).toBe(0);
      expect(result.cells[0][x].positionX).toBe(x);
      expect(result.cells[0][x].sizeY).toBe(1);
      expect(result.cells[0][x].sizeX).toBe(1);
      expect(result.cells[0][x].headers).toHaveLength(0);
    }
    expect(result.cells[1][0].sizeY).toBe(2);
    expect(result.cells[1][1].sizeY).toBe(1);
    expect(result.cells[1][2].sizeY).toBe(1);
    for (let x = 0; x < 3; x++) {
      expect(result.cells[1][x].positionY).toBe(1);
      expect(result.cells[1][x].positionX).toBe(x);
      expect(result.cells[1][x].sizeX).toBe(1);
      expect(result.cells[1][x].headers).toHaveLength(1);
      expect(result.cells[1][x].headers[0]).toBe(result.cells[0][x].element);
    }
    expect(result.cells[2][0].positionY).toBe(2);
    expect(result.cells[2][0].positionX).toBe(1);
    expect(result.cells[2][0].sizeY).toBe(1);
    expect(result.cells[2][0].sizeX).toBe(1);
    expect(result.cells[2][0].headers).toHaveLength(1);
    expect(result.cells[2][0].headers[0]).toBe(result.cells[0][1].element);
    expect(result.cells[2][1].positionY).toBe(2);
    expect(result.cells[2][1].positionX).toBe(2);
    expect(result.cells[2][1].sizeY).toBe(1);
    expect(result.cells[2][1].sizeX).toBe(1);
    expect(result.cells[2][1].headers).toHaveLength(1);
    expect(result.cells[2][1].headers[0]).toBe(result.cells[0][2].element);
    for (let x = 0; x < 3; x++) {
      expect(result.cells[3][x].positionY).toBe(3);
      expect(result.cells[3][x].positionX).toBe(x);
      expect(result.cells[3][x].sizeX).toBe(1);
      expect(result.cells[3][x].sizeY).toBe(1);
      expect(result.cells[3][x].headers).toHaveLength(1);
      expect(result.cells[3][x].headers[0]).toBe(result.cells[0][x].element);
    }
    expect(result.rowGroups).toHaveLength(2);
    expect(result.rowGroups[0].positionY).toBe(0);
    expect(result.rowGroups[0].sizeY).toBe(1);
    expect(result.rowGroups[1].positionY).toBe(1);
    expect(result.rowGroups[1].sizeY).toBe(3);
  });
  test("colspan", () => {
    const table = document.createElement("table");
    table.innerHTML = `
    <thead>
    <tr>
    <th>Header 1</th>
    <th>Header 2</th>
    <th>Header 3</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td colSpan="2">Cell 1</td>
    <td>Cell 2</td>
    </tr>
    <tr>
    <td>Cell 1</td>
    <td>Cell 2</td>
    <td>Cell 3</td>
    </tr>
    </tbody>
    `;
    document.body.appendChild(table);
    const result = analyzeTable(table);
    expect(result.cells).toHaveLength(3);
    expect(result.cells[0]).toHaveLength(3);
    expect(result.cells[1]).toHaveLength(2);
    expect(result.cells[2]).toHaveLength(3);
    for (let x = 0; x < 3; x++) {
      expect(result.cells[0][x].positionY).toBe(0);
      expect(result.cells[0][x].positionX).toBe(x);
      expect(result.cells[0][x].sizeY).toBe(1);
      expect(result.cells[0][x].sizeX).toBe(1);
      expect(result.cells[0][x].headers).toHaveLength(0);
      expect(result.cells[2][x].positionY).toBe(2);
      expect(result.cells[2][x].positionX).toBe(x);
      expect(result.cells[2][x].sizeY).toBe(1);
      expect(result.cells[2][x].sizeX).toBe(1);
      expect(result.cells[2][x].headers).toHaveLength(1);
      expect(result.cells[2][x].headers[0]).toBe(result.cells[0][x].element);
    }
    expect(result.cells[1][0].sizeX).toBe(2);
    expect(result.cells[1][0].sizeY).toBe(1);
    expect(result.cells[1][0].positionX).toBe(0);
    expect(result.cells[1][0].positionY).toBe(1);
    expect(result.cells[1][0].headers).toHaveLength(2);

    expect(result.cells[1][1].sizeX).toBe(1);
    expect(result.cells[1][1].sizeY).toBe(1);
    expect(result.cells[1][1].positionX).toBe(2);
    expect(result.cells[1][1].positionY).toBe(1);
    expect(result.rowGroups).toHaveLength(2);
    expect(result.rowGroups[0].positionY).toBe(0);
    expect(result.rowGroups[0].sizeY).toBe(1);
    expect(result.rowGroups[1].positionY).toBe(1);
    expect(result.rowGroups[1].sizeY).toBe(2);
  });

  test("rowGroups", () => {
    const table = document.createElement("table");
    table.innerHTML = `
    <thead>
      <tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr>
    </thead>
    <tbody>
      <tr><td>Cell 1</th><td>Cell 2</th><td>Cell 3</th></tr>
      <tr><td>Cell 1</th><td>Cell 2</th><td>Cell 3</th></tr>
      <tr><td>Cell 1</th><td>Cell 2</th><td>Cell 3</th></tr>
    </tbody>
    <tbody>
      <tr><td>Cell 1</th><td>Cell 2</th><td>Cell 3</th></tr>
    </tbody>
    <tfoot>
      <tr><td>Cell 1</th><td>Cell 2</th><td>Cell 3</th></tr>
      <tr><td>Cell 1</th><td>Cell 2</th><td>Cell 3</th></tr>
    </tfoot>
    `;
    document.body.appendChild(table);
    const result = analyzeTable(table);
    expect(result.rowGroups).toHaveLength(4);
    expect(result.rowGroups[0].positionY).toBe(0);
    expect(result.rowGroups[0].sizeY).toBe(1);
    expect(result.rowGroups[1].positionY).toBe(1);
    expect(result.rowGroups[1].sizeY).toBe(3);
    expect(result.rowGroups[2].positionY).toBe(4);
    expect(result.rowGroups[2].sizeY).toBe(1);
    expect(result.rowGroups[3].positionY).toBe(5);
    expect(result.rowGroups[3].sizeY).toBe(2);
    expect(result.colGroups).toHaveLength(1);
    expect(result.colGroups[0].positionX).toBe(0);
    expect(result.colGroups[0].sizeX).toBe(3);
  });

  test("colGroups", () => {
    const table = document.createElement("table");
    table.innerHTML = `
      <colgroup>
        <col>
      </colgroup>
      <colgroup>
        <col span="2">
        <col>
      </colgroup>
      <colgroup span="2">
      <tbody>
      <tr>
        <td>Cell 1</td>
        <td>Cell 2</td>
        <td>Cell 3</td>
        <td>Cell 4</td>
        <td>Cell 5</td>
        <td>Cell 6</td>
      </tr>
      </tbody>
    `;
    document.body.appendChild(table);
    const result = analyzeTable(table);
    expect(result.rowGroups).toHaveLength(1);
    expect(result.rowGroups[0].positionY).toBe(0);
    expect(result.rowGroups[0].sizeY).toBe(1);
    expect(result.colGroups).toHaveLength(3);
    expect(result.colGroups[0].positionX).toBe(0);
    expect(result.colGroups[0].sizeX).toBe(1);
    expect(result.colGroups[1].positionX).toBe(1);
    expect(result.colGroups[1].sizeX).toBe(3);
    expect(result.colGroups[2].positionX).toBe(4);
    expect(result.colGroups[2].sizeX).toBe(2);
  });
});
