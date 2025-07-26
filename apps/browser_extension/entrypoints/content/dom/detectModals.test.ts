import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { detectModals, shouldHideBackgroundElements } from "./detectModals";

describe("detectModals", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("aria-modal='true'な要素を検出する", () => {
    container.innerHTML = `
      <div aria-modal="true" id="modal1">Modal 1</div>
      <div aria-modal="false" id="not-modal">Not Modal</div>
      <div id="no-aria">No Aria</div>
    `;

    const modals = detectModals(container);
    expect(modals).toHaveLength(1);
    expect(modals[0].id).toBe("modal1");
  });

  it("openなdialog要素を検出する", () => {
    const dialog = document.createElement("dialog");
    dialog.id = "dialog1";
    dialog.open = true;
    container.appendChild(dialog);

    const closedDialog = document.createElement("dialog");
    closedDialog.id = "dialog2";
    closedDialog.open = false;
    container.appendChild(closedDialog);

    const modals = detectModals(container);
    expect(modals).toHaveLength(1);
    expect(modals[0].id).toBe("dialog1");
  });

  it("aria-modalとopenなdialogの両方を検出する", () => {
    container.innerHTML = `<div aria-modal="true" id="modal1">Modal 1</div>`;

    const dialog = document.createElement("dialog");
    dialog.id = "dialog1";
    dialog.open = true;
    container.appendChild(dialog);

    const modals = detectModals(container);
    expect(modals).toHaveLength(2);

    const ids = modals.map((modal) => modal.id);
    expect(ids).toContain("modal1");
    expect(ids).toContain("dialog1");
  });

  it("重複する要素を除去する", () => {
    const dialog = document.createElement("dialog");
    dialog.id = "dialog1";
    dialog.setAttribute("aria-modal", "true");
    dialog.open = true;
    container.appendChild(dialog);

    const modals = detectModals(container);
    expect(modals).toHaveLength(1);
    expect(modals[0].id).toBe("dialog1");
  });

  it("モーダルが存在しない場合は空配列を返す", () => {
    container.innerHTML = `
      <div>Regular div</div>
      <p>Regular paragraph</p>
    `;

    const modals = detectModals(container);
    expect(modals).toHaveLength(0);
  });

  it("ネストしたモーダルも検出する", () => {
    container.innerHTML = `
      <div>
        <div aria-modal="true" id="nested-modal">Nested Modal</div>
      </div>
    `;

    const modals = detectModals(container);
    expect(modals).toHaveLength(1);
    expect(modals[0].id).toBe("nested-modal");
  });
});

describe("shouldHideBackgroundElements", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("モーダルが存在する場合はtrueを返す", () => {
    container.innerHTML = `<div aria-modal="true">Modal</div>`;

    expect(shouldHideBackgroundElements(container)).toBe(true);
  });

  it("モーダルが存在しない場合はfalseを返す", () => {
    container.innerHTML = `<div>Regular content</div>`;

    expect(shouldHideBackgroundElements(container)).toBe(false);
  });
});
