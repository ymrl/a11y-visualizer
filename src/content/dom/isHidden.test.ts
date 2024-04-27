import { expect, test } from "vitest";
import { isHidden } from "./isHidden";
import { JSDOM } from "jsdom";

const dom = new JSDOM(`<!DOCTYPE html>
<html>
  <head>
    <style>
      .display-none {
        display: none;
      }
      .visibility-hidden {
        visibility: hidden;
      }
    </style>
  </head>
  <body>
    <div id="body-child">
      <div id="body-grand-child"></div> 
    </div>
    <div id="display-none" class="display-none">
      <div id="display-none-child"></div>
    </div>
    <div id="visibility-hidden" class="visibility-hidden">
      <div id="visibility-hidden-child"></div>
    </div>
    <div id="attribute-hidden" hidden>
      <div id="attribute-hidden-child"></div>
    </div>

    <details id="details">
      <summary id="details-summary">Summary</summary>
      <div id="details-content">Details</div>
    </details>

    <details id="details-open" open>
      <summary id="details-open-summary">Summary</summary>
      <div id="details-open-content">Details</div>
    </details>
  </body>
`);

test("isHidden", async () => {
  const bodyChild = dom.window.document.getElementById("body-child");
  expect(bodyChild).not.toBeNull();
  bodyChild && expect(isHidden(bodyChild)).toBe(false);

  const bodyGrandChild = dom.window.document.getElementById("body-grand-child");
  expect(bodyGrandChild).not.toBeNull();
  bodyGrandChild && expect(isHidden(bodyGrandChild)).toBe(false);

  const displayNone = dom.window.document.getElementById("display-none");
  expect(displayNone).not.toBeNull();
  displayNone && expect(isHidden(displayNone)).toBe(true);

  const displayNoneChild =
    dom.window.document.getElementById("display-none-child");
  expect(displayNoneChild).not.toBeNull();
  displayNoneChild && expect(isHidden(displayNoneChild)).toBe(true);

  const visibilityHidden =
    dom.window.document.getElementById("visibility-hidden");
  expect(visibilityHidden).not.toBeNull();
  visibilityHidden && expect(isHidden(visibilityHidden)).toBe(true);

  const visibilityHiddenChild = dom.window.document.getElementById(
    "visibility-hidden-child",
  );
  expect(visibilityHiddenChild).not.toBeNull();
  visibilityHiddenChild && expect(isHidden(visibilityHiddenChild)).toBe(true);

  const attributeHidden =
    dom.window.document.getElementById("attribute-hidden");
  expect(attributeHidden).not.toBeNull();
  attributeHidden && expect(isHidden(attributeHidden)).toBe(true);

  const attributeHiddenChild = dom.window.document.getElementById(
    "attribute-hidden-child",
  );
  expect(attributeHiddenChild).not.toBeNull();
  attributeHiddenChild && expect(isHidden(attributeHiddenChild)).toBe(true);

  const details = dom.window.document.getElementById("details");
  expect(details).not.toBeNull();
  details && expect(isHidden(details)).toBe(false);

  const summary = dom.window.document.getElementById("details-summary");
  expect(summary).not.toBeNull();
  summary && expect(isHidden(summary)).toBe(false);

  const detailsContent = dom.window.document.getElementById("details-content");
  expect(detailsContent).not.toBeNull();
  detailsContent && expect(isHidden(detailsContent)).toBe(true);

  const detailsOpen = dom.window.document.getElementById("details-open");
  expect(detailsOpen).not.toBeNull();
  detailsOpen && expect(isHidden(detailsOpen)).toBe(false);

  const detailsOpenSummary = dom.window.document.getElementById(
    "details-open-summary",
  );
  expect(detailsOpenSummary).not.toBeNull();
  detailsOpenSummary && expect(isHidden(detailsOpenSummary)).toBe(false);

  const detailsOpenContent = dom.window.document.getElementById(
    "details-open-content",
  );
  expect(detailsOpenContent).not.toBeNull();
  detailsOpenContent && expect(isHidden(detailsOpenContent)).toBe(false);
});
