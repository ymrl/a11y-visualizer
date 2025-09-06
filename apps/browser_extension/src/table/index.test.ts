import { describe, expect, test } from "vitest";
import {
  getCellElements,
  getRowElements,
  getRowGroupElements,
  isEmptyCellElement,
  Table,
} from ".";

describe("Table", () => {
  test("table (will be automatically inserted tbody)", () => {
    const table = document.createElement("table");
    table.innerHTML = `
      <caption>caption</caption>
      <tr><td>0-0</td><td>0-1</td></tr>
      <tr><td>1-0</td><td>1-1</td></tr>
    `;
    const result = new Table(table);
    const { rowGroups, cells, rowCount, colCount } = result;
    expect(rowGroups[0].positionY).toBe(0);
    expect(rowGroups[0].sizeY).toBe(2);
    expect(rowGroups[0].element?.tagName.toLowerCase()).toBe("tbody");
    expect(rowGroups).toHaveLength(1);
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 2; x++) {
        expect(cells[y][x].positionX).toBe(x);
        expect(cells[y][x].positionY).toBe(y);
        expect(cells[y][x].sizeX).toBe(1);
        expect(cells[y][x].sizeY).toBe(1);
        expect(cells[y][x].element.tagName.toLowerCase()).toBe("td");
        expect(cells[y][x].headerScope).toBe("none");
      }
      expect(cells[y]).toHaveLength(2);
    }
    expect(cells).toHaveLength(2);
    expect(rowCount).toBe(2);
    expect(colCount).toBe(2);
  });

  test("table has thead, tbody, tfoot", () => {
    const table = document.createElement("table");
    table.innerHTML = `
      <caption>caption</caption>
      <thead>
        <tr><th>0-0</th></tr>
      </thead>
      <tbody>
        <tr><td>1-0</td></tr>
        <tr><td>2-0</td></tr>
      </tbody>
      <tbody>
        <tr><td>3-0</td></tr>
      </tbody>
      <tfoot>
        <tr><td>4-0</td></tr>
      </tfoot>
    `;
    const result = new Table(table);
    const { rowGroups } = result;
    expect(rowGroups[0].positionY).toBe(0);
    expect(rowGroups[0].sizeY).toBe(1);
    expect(rowGroups[0].element?.tagName.toLowerCase()).toBe("thead");
    expect(rowGroups[1].positionY).toBe(1);
    expect(rowGroups[1].sizeY).toBe(2);
    expect(rowGroups[1].element?.tagName.toLowerCase()).toBe("tbody");
    expect(rowGroups[2].positionY).toBe(3);
    expect(rowGroups[2].sizeY).toBe(1);
    expect(rowGroups[2].element?.tagName.toLowerCase()).toBe("tbody");
    expect(rowGroups[3].positionY).toBe(4);
    expect(rowGroups[3].sizeY).toBe(1);
    expect(rowGroups[3].element?.tagName.toLowerCase()).toBe("tfoot");
    expect(rowGroups).toHaveLength(4);
  });
  test("table has directly added tr", () => {
    const table = document.createElement("table");
    table.appendChild(document.createElement("tr"));
    table.appendChild(document.createElement("tr"));
    table.appendChild(document.createElement("tr"));
    const result = new Table(table);
    const { rowGroups, cells } = result;
    expect(rowGroups).toHaveLength(0);
    expect(cells).toHaveLength(3);
  });

  test("wrong tfoot position", () => {
    const table = document.createElement("table");
    table.innerHTML = `
      <caption>caption</caption>
      <tfoot>
        <tr><td id="cell-2-0">2-0</td></tr>
      </tfoot>
      <tbody>
        <tr><td id="cell-0-0">0-0</td></tr>
        <tr><td id="cell-1-0">1-0</td></tr>
      </tbody>
    `;
    const result = new Table(table);
    const { cells } = result;
    expect(cells).toHaveLength(3);
    expect(cells[0][0].element.id).toBe("cell-0-0");
    expect(cells[1][0].element.id).toBe("cell-1-0");
    expect(cells[2][0].element.id).toBe("cell-2-0");
  });

  test("colgroups", () => {
    const table = document.createElement("table");
    table.innerHTML = `
    <caption>caption</caption>
    <colgroup id="0-0" span="1"></colgroup>
    <colgroup id="1-123" span="3"></colgroup>
    <colgroup id="2-4567">
      <col span="2"></col>
      <col></col>
      <col></col>
    </colgroup>
    <colgroup id="3-8"></colgroup>
    <tbody>
      <tr>
        <td>0</td><td>1</td><td>2</td><td>3</td><td>4</td>
        <td>5</td><td>6</td><td>7</td><td>8</td>
      </tr>
      <tr>
        <td>0</td><td>1</td><td>2</td><td>3</td><td>4</td>
        <td>5</td><td>6</td><td>7</td><td>8</td><td>9</td>
      </tr>
    </tbody>
    `;
    const result = new Table(table);
    const { colGroups, colCount } = result;
    expect(colCount).toBe(10);
    expect(colGroups[0].positionX).toBe(0);
    expect(colGroups[0].sizeX).toBe(1);
    expect(colGroups[1].positionX).toBe(1);
    expect(colGroups[1].sizeX).toBe(3);
    expect(colGroups[2].positionX).toBe(4);
    expect(colGroups[2].sizeX).toBe(4);
    expect(colGroups[3].positionX).toBe(8);
    expect(colGroups[3].sizeX).toBe(1);
    expect(colGroups).toHaveLength(4);
  });

  test("rowspan", () => {
    const table = document.createElement("table");
    table.innerHTML = `
    <thead>
      <tr>
        <th id="cell-0-0">0-0</th>
        <th id="cell-0-1">0-1</th>
        <th id="cell-0-2">0-2</th>
        <th id="cell-0-3">0-3</th>
        <th id="cell-0-4">0-4</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td id="cell-1-0">1-0</td>
        <td id="cell-1-1">1-1</td>
        <td id="cell-1-2" rowspan="5">1-2</td>
        <td id="cell-1-3">1-3</td>
        <td id="cell-1-3">1-4</td>
      </tr>
      <tr>
        <td id="cell-2-0" rowspan="2">2-0</td>
        <td id="cell-2-1" rowspan="3">2-1</td>
        <td id="cell-2-3">2-3</td>
        <td id="cell-2-4">2-4</td>
      </tr>
      <tr>
        <td id="cell-3-3">3-3(0)</td>
        <td id="cell-3-4">3-4(1)</td>
      </tr>
      <tr>
        <td id="cell-4-0">4-0(0)</td>
        <td id="cell-4-3">4-3(1)</td>
        <td id="cell-4-4">4-4(2)</td>
      </tr>
      <tr>
        <td id="cell-5-0">5-0(0)</td>
        <td id="cell-5-1">5-1(1)</td>
        <td id="cell-5-2">5-3(2)</td>
        <td id="cell-5-4">5-4(3)</td>
      </tr>
      <tr>
        <td id="cell-6-0">6-0</td>
        <td id="cell-6-1">6-1</td>
        <td id="cell-6-2">6-2</td>
        <td id="cell-6-3">6-3</td>
        <td id="cell-6-4">6-4</td>
      </tr>
    </tbody>
    `;
    const result = new Table(table);
    const { cells } = result;
    expect(cells[2][0].positionX).toBe(0);
    expect(cells[2][1].positionX).toBe(1);
    expect(cells[2][2].positionX).toBe(3);
    expect(cells[2][3].positionX).toBe(4);

    expect(cells[3][0].positionX).toBe(3);
    expect(cells[4][0].positionX).toBe(0);
    expect(cells[4][1].positionX).toBe(3);
    expect(cells[5][0].positionX).toBe(0);
    expect(cells[5][1].positionX).toBe(1);
    expect(cells[5][2].positionX).toBe(3);
    expect(cells[5][3].positionX).toBe(4);
    for (let i = 0; i < 5; i++) {
      expect(cells[6][i].positionX).toBe(i);
    }
  });

  test("complex table", () => {
    const table = document.createElement("table");
    table.innerHTML = `
      <caption>caption</caption>
      <colgroup></colgroup>
      <colgroup span="3"></colgroup>
      <colgroup></colgroup>
      <thead>
        <tr><th>0-0</th><th>0-1</th><th>0-2</th><th>0-3</th><th>0-4</th></tr>
      </thead>
      <tbody>
        <tr><td>1-0</td><td colspan="3">1,1-3</td><td>1-4</td></tr>
        <tr><th scope="row" rowspan="2">2,3-0</th><td>2-1</td><td>2-2</td><td>2-3</td><td>2-4</td></tr>
        <tr><th scope="row">3-1</th><td>3-2</td><td>3-3</td><td>3-4</td></tr>
        <tr><td>4-0</td><td>4-1</td><td>4-2</td><td>4-3</td><td>4-4</td></tr>
      </tbody>
      <tfoot>
        <tr><td>5-0</td><td>5-1</td><td>5-2</td><td>5-3</td><td>5-4</td></tr>
      </tfoot>
    `;
    const result = new Table(table);
    const { rowGroups, cells, rowCount, colCount } = result;
    expect(rowGroups[0].positionY).toBe(0);
    expect(rowGroups[0].sizeY).toBe(1);
    expect(rowGroups[0].element?.tagName.toLowerCase()).toBe("thead");
    expect(rowGroups[1].positionY).toBe(1);
    expect(rowGroups[1].sizeY).toBe(4);
    expect(rowGroups[1].element?.tagName.toLowerCase()).toBe("tbody");
    expect(rowGroups[2].positionY).toBe(5);
    expect(rowGroups[2].sizeY).toBe(1);
    expect(rowGroups[2].element?.tagName.toLowerCase()).toBe("tfoot");
    expect(rowGroups).toHaveLength(3);
    for (let x = 0; x < 5; x++) {
      expect(cells[0][x].positionX).toBe(x);
      expect(cells[0][x].positionY).toBe(0);
      expect(cells[0][x].sizeX).toBe(1);
      expect(cells[0][x].sizeY).toBe(1);
      expect(cells[0][x].element.tagName.toLowerCase()).toBe("th");
      expect(cells[0][x].headerScope).toBe("auto");
    }
    expect(cells[1][1].positionX).toBe(1);
    expect(cells[1][1].positionY).toBe(1);
    expect(cells[1][1].sizeX).toBe(3);
    expect(cells[1][1].sizeY).toBe(1);
    expect(cells[1][2].positionX).toBe(4);
    expect(cells[1][2].positionY).toBe(1);
    expect(cells[1][2].sizeX).toBe(1);
    expect(cells[1][2].sizeY).toBe(1);
    expect(cells[2][0].positionX).toBe(0);
    expect(cells[2][0].positionY).toBe(2);
    expect(cells[2][0].sizeX).toBe(1);
    expect(cells[2][0].sizeY).toBe(2);
    expect(cells[2][1].positionX).toBe(1);
    expect(cells[2][1].positionY).toBe(2);
    expect(cells[2][1].sizeX).toBe(1);
    expect(cells[2][1].sizeY).toBe(1);
    expect(cells[3][0].positionX).toBe(1);
    expect(cells[3][0].positionY).toBe(3);
    expect(cells[3][0].sizeX).toBe(1);
    expect(cells[3][0].sizeY).toBe(1);
    expect(cells[4][0].positionX).toBe(0);
    expect(cells[4][0].positionY).toBe(4);
    expect(cells[4][0].sizeX).toBe(1);
    expect(cells[4][0].sizeY).toBe(1);
    expect(rowCount).toBe(6);
    expect(colCount).toBe(5);
  });

  test("complex div table", () => {
    const div = document.createElement("div");
    div.setAttribute("role", "table");
    div.setAttribute("aria-rowcount", "9");
    div.setAttribute("aria-colcount", "5");
    div.innerHTML = `
      <div role="rowgroup">
        <div role="row" aria-rowindex="1">
          <div role="columnheader">0-0</div>
          <div role="columnheader">0-1</div>
          <div role="presentation">
            <div role="columnheader">0-2</div>
            <div role="columnheader">0-3</div>
          </div>
          <div role="columnheader">0-4</div>
        </div>
      </div>
      <div role="rowgroup">
        <div role="row" aria-rowindex="4">
          <div role="rowheader">3(1)-0</div>
          <div role="cell">3(1)-1</div>
          <div role="cell">3(1)-2</div>
          <div role="cell">3(1)-3</div>
          <div role="cell">3(1)-4</div>
        </div>
        <div role="row" aria-rowindex="5">
          <div role="rowheader">4(2)-0</div>
          <div role="cell" aria-colspan="3">4(2)-1</div>
          <div role="cell">4(2)-4</div>
        </div>
        <div role="row">
          <div role="rowheader" aria-rowspan="2">5(3)-0</div>
          <div role="cell">5(3)-1</div>
          <div role="cell">5(3)-2</div>
          <div role="cell">5(3)-3</div>
          <div role="cell">5(3)-4</div>
        </div>
        <div role="row" aria-rowindex="7">
          <div role="cell">6(4)-1</div>
          <div role="cell">6(4)-2</div>
          <div role="cell">6(4)-3</div>
          <div role="cell">6(4)-4</div>
        </div>
        <div role="row" aria-rowindex="8">
          <div role="rowheader">7(5)-0</div>
          <div role="cell">7(5)-1</div>
          <div role="cell">7(5)-2</div>
          <div role="cell">7(5)-3</div>
          <div role="cell">7(5)-4</div>
        </div>
        <div role="row" aria-rowindex="9">
          <div role="cell" aria-colindex="4">8(6)-3</div>
        </div>
      </div>
    `;
    const result = new Table(div);
    const { cells, rowCount, colCount } = result;
    expect(cells).toHaveLength(7);
    for (let x = 0; x < 5; x++) {
      expect(cells[0][x].positionX).toBe(x);
      expect(cells[0][x].positionY).toBe(0);
      expect(cells[0][x].sizeX).toBe(1);
      expect(cells[0][x].sizeY).toBe(1);
      expect(cells[0][x].element.tagName.toLowerCase()).toBe("div");
      expect(cells[0][x].headerScope).toBe("col");
    }
    for (let x = 0; x < 5; x++) {
      expect(cells[1][x].positionX).toBe(x);
      expect(cells[1][x].positionY).toBe(3);
      expect(cells[1][x].sizeX).toBe(1);
      expect(cells[1][x].sizeY).toBe(1);
      expect(cells[1][x].element.tagName.toLowerCase()).toBe("div");
      expect(cells[1][x].headerScope).toBe(x === 0 ? "row" : "none");
    }
    expect(cells[2][1].positionX).toBe(1);
    expect(cells[2][1].positionY).toBe(4);
    expect(cells[2][1].sizeX).toBe(3);
    expect(cells[2][1].sizeY).toBe(1);
    expect(cells[2][2].positionX).toBe(4);
    expect(cells[2][2].positionY).toBe(4);
    expect(cells[2][2].sizeX).toBe(1);
    expect(cells[2][2].sizeY).toBe(1);
    expect(cells[3][0].positionX).toBe(0);
    expect(cells[3][0].positionY).toBe(5);
    expect(cells[3][0].sizeX).toBe(1);
    expect(cells[3][0].sizeY).toBe(2);
    expect(cells[3][1].positionX).toBe(1);
    expect(cells[3][1].positionY).toBe(5);
    expect(cells[3][1].sizeX).toBe(1);
    expect(cells[3][1].sizeY).toBe(1);
    expect(cells[4][0].positionX).toBe(1);
    expect(cells[4][0].positionY).toBe(6);
    expect(cells[4][0].sizeX).toBe(1);
    expect(cells[4][0].sizeY).toBe(1);
    expect(cells[5][0].positionX).toBe(0);
    expect(cells[5][0].positionY).toBe(7);
    expect(cells[5][0].sizeX).toBe(1);
    expect(cells[5][0].sizeY).toBe(1);
    expect(cells[5][1].positionX).toBe(1);
    expect(cells[5][1].positionY).toBe(7);
    expect(cells[5][1].sizeX).toBe(1);
    expect(cells[5][1].sizeY).toBe(1);
    expect(cells[6][0].positionX).toBe(3);
    expect(cells[6][0].positionY).toBe(8);
    expect(cells[6][0].sizeX).toBe(1);
    expect(cells[6][0].sizeY).toBe(1);
    expect(rowCount).toBe(9);
    expect(colCount).toBe(5);
  });

  describe("getSlotCells", () => {
    test("table", () => {
      const table = document.createElement("table");
      table.innerHTML = `
      <tr>
        <th id="cell-0-0">0-0</th>
        <td id="cell-0-1" rowspan="2" colspan="2">0-1</td>
      </tr>
      <tr>
        <th id="cell-1-0" colspan="3">1-0</th>
      </tr>
      <tr>
        <th id="cell-2-0">2-0</th>
        <td id="cell-2-1">2-1</td>
        <td id="cell-2-2">2-2</td>
      </tr>
      `;
      const result = new Table(table);
      const cell_2_1 = result.getSlotCells(1, 2);
      expect(cell_2_1).toHaveLength(1);
      expect(cell_2_1[0].element.id).toBe("cell-2-1");
      const cell_1_1 = result.getSlotCells(1, 1);
      expect(cell_1_1).toHaveLength(2);
      expect(cell_1_1.find((c) => c.element.id === "cell-0-1")).toBeDefined();
      expect(cell_1_1.find((c) => c.element.id === "cell-1-0")).toBeDefined();
    });
  });
  describe("getCell", () => {
    test("table", () => {
      const table = document.createElement("table");
      table.innerHTML = `
      <tr>
        <th id="cell-0-0">0-0</th>
        <td id="cell-0-1">0-1</td>
        <td id="cell-0-2">0-2</td>
      </tr>
      <tr>
        <th id="cell-1-0">1-0</th>
        <td id="cell-1-1">1-1</td>
        <td id="cell-1-2">1-2</td>
      </tr>
      <tr>
        <th id="cell-2-0">2-0</th>
        <td id="cell-2-1">2-1</td>
        <td id="cell-2-2">2-2</td>
      </tr>
      `;
      const result = new Table(table);
      const el = table.querySelector("#cell-1-2");
      expect(el).toBeDefined();
      if (!el) return;
      const cell = result.getCell(el);
      expect(cell).toBeDefined();
      if (!cell) return;
      expect(cell.element).toBe(el);
      expect(cell.positionX).toBe(2);
      expect(cell.positionY).toBe(1);
      expect(cell.sizeX).toBe(1);
      expect(cell.sizeY).toBe(1);
    });
  });

  describe("getHeaderElements", () => {
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
            <td id="cell-2-4" rowspan="2">2-4(3)</td>
            <td id="cell-2-5">2-5(4)</td>
          </tr>
          <tr>
            <th id="cell-3-0" scope="row">3-0</th>
            <td id="cell-3-1">3-1</td>
            <td id="cell-3-2">3-2</td>
            <td id="cell-3-3">3-3</td>
            <td id="cell-3-5">3-5(4)</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th id="cell-4-0" scope="rowgroup">4-0</th>
            <td id="cell-4-1">4-1</td>
            <td id="cell-4-2" headers="cell-4-0 cell-0-1 cell-0-2">4-2</td>
            <td id="cell-4-3">4-3</td>
            <td id="cell-4-4">4-4</td>
          </tr>
          <tr>
            <th id="cell-5-0" scope="row">5-0</th>
            <td id="cell-5-1">5-1</td>
            <td id="cell-5-2">5-2</td>
            <td id="cell-5-3">5-3</td>
            <td id="cell-5-4" headers="cell-0-0 cell-0-1">5-4</td>
          </tr>
        </tbody>
      `;
      const result = new Table(table);
      const { cells } = result;
      const headers_1_2 = result.getHeaderElements(cells[1][2]);
      expect(headers_1_2.find((e) => e.id === "cell-1-0")).toBeDefined();
      expect(headers_1_2.find((e) => e.id === "cell-0-1")).toBeDefined();
      expect(headers_1_2.find((e) => e.id === "cell-0-2")).toBeDefined();
      expect(headers_1_2).toHaveLength(3);
      const headers_2_4 = result.getHeaderElements(cells[2][3]);
      expect(headers_2_4.find((e) => e.id === "cell-2-1")).toBeDefined();
      expect(headers_2_4.find((e) => e.id === "cell-1-0")).toBeDefined();
      expect(headers_2_4.find((e) => e.id === "cell-0-3")).toBeDefined();
      expect(headers_2_4.find((e) => e.id === "cell-3-0")).toBeDefined();
      expect(headers_2_4).toHaveLength(4);
      const headers_3_5 = result.getHeaderElements(cells[3][4]);
      expect(headers_3_5.find((e) => e.id === "cell-3-0")).toBeDefined();
      expect(headers_3_5.find((e) => e.id === "cell-0-5")).toBeDefined();
      expect(headers_3_5).toHaveLength(2);
      const headers_3_0 = result.getHeaderElements(cells[3][0]);
      expect(headers_3_0.find((e) => e.id === "cell-0-0")).toBeDefined();
      expect(headers_3_0).toHaveLength(1);
      const headers_4_2 = result.getHeaderElements(cells[4][2]);
      expect(headers_4_2.find((e) => e.id === "cell-4-0")).toBeDefined();
      expect(headers_4_2.find((e) => e.id === "cell-0-1")).toBeDefined();
      expect(headers_4_2.find((e) => e.id === "cell-0-2")).toBeDefined();
      expect(headers_4_2).toHaveLength(3);
      const headers_5_2 = result.getHeaderElements(cells[5][2]);
      expect(headers_5_2.find((e) => e.id === "cell-4-0")).toBeDefined();
      expect(headers_5_2.find((e) => e.id === "cell-5-0")).toBeDefined();
      expect(headers_5_2.find((e) => e.id === "cell-0-1")).toBeDefined();
      expect(headers_5_2.find((e) => e.id === "cell-0-2")).toBeDefined();
      expect(headers_5_2).toHaveLength(4);
      const headers_5_4 = result.getHeaderElements(cells[5][4]);
      expect(headers_5_4.find((e) => e.id === "cell-0-0")).toBeDefined();
      expect(headers_5_4.find((e) => e.id === "cell-0-1")).toBeDefined();
      expect(headers_5_4).toHaveLength(2);
    });

    test("rowspan", () => {
      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr>
            <th id="cell-0-0">0-0</th>
            <th id="cell-0-1">0-1</th>
            <th id="cell-0-2">0-2</th>
            <th id="cell-0-3">0-3</th>
            <th id="cell-0-4">0-4</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td id="cell-1-0">1-0</td>
            <td id="cell-1-1">1-1</td>
            <td id="cell-1-2" rowspan="5">1-2</td>
            <td id="cell-1-3">1-3</td>
            <td id="cell-1-3">1-4</td>
          </tr>
          <tr>
            <td id="cell-2-0" rowspan="2">2-0</td>
            <td id="cell-2-1" rowspan="3">2-1</td>
            <td id="cell-2-3">2-3(2)</td>
            <td id="cell-2-4">2-4(3)</td>
          </tr>
          <tr>
            <td id="cell-3-3">3-3(0)</td>
            <td id="cell-3-4">3-4(1)</td>
          </tr>
          <tr>
            <td id="cell-4-0">4-0(0)</td>
            <td id="cell-4-3">4-3(1)</td>
            <td id="cell-4-4">4-4(2)</td>
          </tr>
          <tr>
            <td id="cell-5-0">5-0(0)</td>
            <td id="cell-5-1">5-1(1)</td>
            <td id="cell-5-2">5-3(2)</td>
            <td id="cell-5-4">5-4(3)</td>
          </tr>
          <tr>
            <td id="cell-6-0">6-0</td>
            <td id="cell-6-1">6-1</td>
            <td id="cell-6-2">6-2</td>
            <td id="cell-6-3">6-3</td>
            <td id="cell-6-4">6-4</td>
          </tr>
        </tbody>
      `;
      const result = new Table(table);
      const { cells } = result;
      const headers_2_3 = result.getHeaderElements(cells[2][2]);
      expect(headers_2_3.find((c) => c.id === "cell-0-3")).toBeDefined();
      expect(headers_2_3).toHaveLength(1);
      const headers_3_3 = result.getHeaderElements(cells[3][0]);
      expect(headers_3_3.find((c) => c.id === "cell-0-3")).toBeDefined();
      expect(headers_3_3).toHaveLength(1);
      const headers_4_0 = result.getHeaderElements(cells[4][0]);
      expect(headers_4_0.find((c) => c.id === "cell-0-0")).toBeDefined();
      expect(headers_4_0).toHaveLength(1);
      const headers_5_1 = result.getHeaderElements(cells[5][1]);
      expect(headers_5_1.find((c) => c.id === "cell-0-1")).toBeDefined();
      expect(headers_5_1).toHaveLength(1);
    });
  });
});

describe("getRowElements", () => {
  test("table (will be automatically inserted tbody)", () => {
    const table = document.createElement("table");
    table.innerHTML = `
      <caption>caption</caption>
      <tr><td>row 0</td></tr>
      <tr><td>row 1</td></tr>
    `;
    const result = getRowElements(table);
    result.forEach((row) => {
      expect(row.tagName.toLowerCase()).toBe("tr");
    });
    expect(result).toHaveLength(2);
  });

  test("table has thead, tbody, tfoot", () => {
    const table = document.createElement("table");
    table.innerHTML = `
      <caption>caption</caption>
      <thead>
        <tr id="row-0"><td>thead row 0</td></tr>
      </thead>
      <tbody>
        <tr id="row-1"><td>tbody0 row 0</td></tr>
        <tr id="row-2"><td>tbody0 row 1</td></tr>
      </tbody>
      <tbody>
        <tr id="row-3"><td>tbody1 row 0</td></tr>
      </tbody>
      <tfoot>
        <tr id="row-4"><td>tfoot row 0</td></tr>
      </tfoot>
    `;
    const result = getRowElements(table);
    result.forEach((row, i) => {
      expect(row.tagName.toLowerCase()).toBe("tr");
      expect(row.id).toBe(`row-${i}`);
    });
    expect(result).toHaveLength(5);
  });

  test("wrong tfoot position", () => {
    const table = document.createElement("table");
    table.innerHTML = `
      <caption>caption</caption>
      <tfoot>
        <tr id="row-2"><td id="cell-2-0">2-0</td></tr>
      </tfoot>
      <tbody>
        <tr id="row-0"><td>0-0</td></tr>
        <tr id="row-1"><td>1-0</td></tr>
      </tbody>
      <tfoot>
        <tr id="row-3"><td>3-0</td></tr>
      </tfoot>
    `;
    const result = getRowElements(table);
    result.forEach((row, i) => {
      expect(row.tagName.toLowerCase()).toBe("tr");
      expect(row.id).toBe(`row-${i}`);
    });
    expect(result).toHaveLength(4);
  });

  test("table has directly added tr", () => {
    const table = document.createElement("table");
    table.appendChild(document.createElement("tr"));
    table.appendChild(document.createElement("tr"));
    table.appendChild(document.createElement("tr"));
    const result = getRowElements(table);
    result.forEach((row) => {
      expect(row.tagName.toLowerCase()).toBe("tr");
    });
    expect(result).toHaveLength(3);
  });

  test("div", () => {
    const div = document.createElement("div");
    const result = getRowElements(div);
    expect(result).toHaveLength(0);
  });

  test("div with tr", () => {
    const div = document.createElement("div");
    div.innerHTML = "<tr><td>row 0</td></tr>";
    const result = getRowElements(div);
    expect(result).toHaveLength(0);
  });

  test("div role=table", () => {
    const div = document.createElement("div");
    div.setAttribute("role", "table");
    div.innerHTML = `
      <div role="rowgroup">
        <div role="row"><div role="cell">row 0</div></div>
        <div role="row"><div role="cell">row 1</div></div>
      </div>
      <div role="row"><div role="cell">row 2</div></div>
      <div role="presentation">
        <div role="row"><div role="cell">row 3</div></div>
        <div role="rowgroup">
          <div role="row"><div role="cell">row 4</div></div>
        </div>
      </div>
      <div role="none">
        <div role="row"><div role="cell">row 5</div></div>
        <div role="rowgroup">
          <div role="row"><div role="cell">row 6</div></div>
        </div>
      </div>
      `;
    const result = getRowElements(div);
    result.forEach((row) => {
      expect(row.tagName.toLowerCase()).toBe("div");
      expect(row.getAttribute("role")).toBe("row");
    });
    expect(result).toHaveLength(7);
  });
});

describe("getRowGroupElements", () => {
  test("table (will be automatically inserted tbody)", () => {
    const table = document.createElement("table");
    table.innerHTML = `
      <caption>caption</caption>
      <tr><td>row 0</td></tr>
      <tr><td>row 1</td></tr>
    `;
    const result = getRowGroupElements(table);
    expect(result).toHaveLength(1);
    expect(result[0].tagName.toLowerCase()).toBe("tbody");
  });

  test("table has thead, tbody, tfoot", () => {
    const table = document.createElement("table");
    table.innerHTML = `
      <caption>caption</caption>
      <thead>
        <tr><td>thead row 0</td></tr>
      </thead>
      <tbody>
        <tr><td>tbody0 row 0</td></tr>
        <tr><td>tbody0 row 1</td></tr>
      </tbody>
      <tbody>
        <tr><td>tbody1 row 0</td></tr>
      </tbody>
      <tfoot>
        <tr><td>tfoot row 0</td></tr>
      </tfoot>
    `;
    const result = getRowGroupElements(table);
    expect(result[0].tagName.toLowerCase()).toBe("thead");
    expect(result[1].tagName.toLowerCase()).toBe("tbody");
    expect(result[2].tagName.toLowerCase()).toBe("tbody");
    expect(result[3].tagName.toLowerCase()).toBe("tfoot");
    expect(result).toHaveLength(4);
  });

  test("wrong tfoot position", () => {
    const table = document.createElement("table");
    table.innerHTML = `
      <caption>caption</caption>
      <tfoot id="group-2">
        <tr><td>2-0</td></tr>
      </tfoot>
      <thead id="group-0">
        <tr><td>0-0</td></tr>
      </thead>
      <tbody id="group-1">
        <tr><td>1-0</td></tr>
      </tbody>
      <tfoot id="group-3">
        <tr><td>3-0</td></tr>
      </tfoot>
    `;
    const result = getRowGroupElements(table);
    expect(result[0].tagName.toLowerCase()).toBe("thead");
    expect(result[1].tagName.toLowerCase()).toBe("tbody");
    expect(result[2].tagName.toLowerCase()).toBe("tfoot");
    expect(result[3].tagName.toLowerCase()).toBe("tfoot");
    expect(result).toHaveLength(4);
  });

  test("table has directly added tr", () => {
    const table = document.createElement("table");
    table.appendChild(document.createElement("tr"));
    table.appendChild(document.createElement("tr"));
    table.appendChild(document.createElement("tr"));
    const result = getRowGroupElements(table);
    expect(result).toHaveLength(0);
  });

  test("div", () => {
    const div = document.createElement("div");
    const result = getRowGroupElements(div);
    expect(result).toHaveLength(0);
  });

  test("div with tbody", () => {
    const div = document.createElement("div");
    div.innerHTML = "<tbody><tr><td>row 0</td></tr></tbody>";
    const result = getRowGroupElements(div);
    expect(result).toHaveLength(0);
  });

  test("div role=table", () => {
    const div = document.createElement("div");
    div.setAttribute("role", "table");
    div.innerHTML = `
      <div role="rowgroup" id="rowgroup0">
        <div role="row"><div role="cell">row 0</div></div>
        <div role="row"><div role="cell">row 1</div></div>
      </div>
      <div role="row"><div role="cell">row 2</div></div>
      <div role="presentation">
        <div role="row"><div role="cell">row 3</div></div>
        <div role="rowgroup" id="rowgroup1">
          <div role="row"><div role="cell">row 4</div></div>
        </div>
      </div>
      <div role="none">
        <div role="row"><div role="cell">row 3</div></div>
        <div role="rowgroup" id="rowgroup2">
          <div role="row"><div role="cell">row 4</div></div>
        </div>
      </div>
      `;
    const result = getRowGroupElements(div);
    result.forEach((row) => {
      expect(row.tagName.toLowerCase()).toBe("div");
      expect(row.getAttribute("role")).toBe("rowgroup");
    });
    expect(result).toHaveLength(3);
  });
});

describe("getCellElements", () => {
  test("tr", () => {
    const tr = document.createElement("tr");
    tr.innerHTML = "<th>cell 0</th><td>cell 1</td><td>cell 2</td>";
    const result = getCellElements(tr);
    expect(result[0].tagName.toLowerCase()).toBe("th");
    expect(result[1].tagName.toLowerCase()).toBe("td");
    expect(result[2].tagName.toLowerCase()).toBe("td");
    expect(result).toHaveLength(3);
  });

  test("div role=row", () => {
    const div = document.createElement("div");
    div.setAttribute("role", "row");
    div.innerHTML = `
      <div role='columnheader'>cell 0</div>
      <div role='rowheader'>cell 1</div>";
      <div role='cell'>cell 2</div>";
      <div role='gridcell'>cell 3</div>";
      <div role='presentation'>
        <div role='columnheader'>cell 4</div>
        <div role='rowheader'>cell 5</div>";
        <div role='cell'>cell 6</div>";
        <div role='gridcell'>cell 7</div>";
      </div>
      <div role='none'>
        <div role='columnheader'>cell 8</div>
        <div role='rowheader'>cell 9</div>";
        <div role='cell'>cell 10</div>";
        <div role='gridcell'>cell 11</div>";
      </div>
    `;
    const result = getCellElements(div);
    result.forEach((cell) => {
      expect(cell.tagName.toLowerCase()).toBe("div");
    });
    for (let i = 0; i < 3; i++) {
      expect(result[i * 4].getAttribute("role")).toBe("columnheader");
      expect(result[i * 4 + 1].getAttribute("role")).toBe("rowheader");
      expect(result[i * 4 + 2].getAttribute("role")).toBe("cell");
      expect(result[i * 4 + 3].getAttribute("role")).toBe("gridcell");
    }
    expect(result).toHaveLength(12);
  });
});

describe("isEmptyCellElement", () => {
  test("empty cell", () => {
    const cell = document.createElement("td");
    expect(isEmptyCellElement(cell)).toBe(true);
  });
  test("cell with text", () => {
    const cell = document.createElement("td");
    cell.textContent = "text";
    expect(isEmptyCellElement(cell)).toBe(false);
  });
  test("cell with space", () => {
    const cell = document.createElement("td");
    cell.textContent = " ";
    expect(isEmptyCellElement(cell)).toBe(true);
  });
  test("cell with br", () => {
    const cell = document.createElement("td");
    cell.appendChild(document.createElement("br"));
    expect(isEmptyCellElement(cell)).toBe(false);
  });
  test("cell with img", () => {
    const cell = document.createElement("td");
    cell.appendChild(document.createElement("img"));
    expect(isEmptyCellElement(cell)).toBe(false);
  });
});
