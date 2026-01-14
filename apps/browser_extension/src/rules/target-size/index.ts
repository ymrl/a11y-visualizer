import {
  isDefaultSize,
  isInline,
  querySelectorAllFromRoots,
} from "@a11y-visualizer/dom-utils";
import { getElementPosition } from "../../../entrypoints/content/dom/getElementPosition";
import type { RuleObject } from "../type";

const ruleName = "target-size";
const defaultOptions = { enabled: true };

const tagNames = ["button", "select", "textarea"];
const roles = [
  "button",
  "menuitem",
  "tab",
  "checkbox",
  "combobox",
  "listbox",
  "radio",
  "searchbox",
  "slider",
  "spinbutton",
  "switch",
  "textbox",
  "menuitemcheckbox",
  "menuitemradio",
  "link",
];
const selectors = [
  'input:not([type="hidden"])',
  "details > summary:first-child",
  "a[href]",
  "area[href]",
];
const COMBINED_SELECTOR = [
  ...tagNames,
  ...selectors,
  ...roles.map((role) => `[role="${role}"]`),
].join(", ");

export const TargetSize: RuleObject = {
  ruleName,
  defaultOptions,
  tagNames,
  roles,
  selectors,
  evaluate: (
    element,
    { enabled },
    {
      elementDocument = element.ownerDocument,
      elementWindow = elementDocument.defaultView || window,
      shadowRoots,
    },
  ) => {
    if (!enabled) {
      return undefined;
    }
    if (
      isSmallTarget(element, elementDocument, elementWindow, shadowRoots) &&
      !(
        isInline(element) ||
        isDefaultSize(element) ||
        hasAdequateSpacing(element, elementDocument, shadowRoots)
      )
    ) {
      return [
        {
          type: "warning",
          message: "Small target",
          ruleName,
        },
      ];
    }
    return undefined;
  },
};

const isSmallTarget = (
  element: Element,
  elementDocument: Document,
  elementWindow: Window,
  shadowRoots?: ShadowRoot[],
): boolean => {
  const elementPosition = getElementPosition(element, elementWindow);
  const style = elementWindow.getComputedStyle(element);
  const { display } = style;

  if (elementPosition.width >= 24 && elementPosition.height >= 24) {
    return false;
  }

  const checkboxLabel =
    isCheckboxOrRadiobutton(element) &&
    ((element.id &&
      querySelectorAllFromRoots(
        `[for="${CSS.escape(element.id)}"]`,
        elementDocument,
        shadowRoots,
      )[0]) ||
      element.closest("label"));
  // チェックボックス・ラジオボタンはラベルの大きさも見る
  if (checkboxLabel) {
    return isSmallTarget(
      checkboxLabel,
      elementDocument,
      elementWindow,
      shadowRoots,
    );
  }

  // inlineの場合は、子要素に24px以上のものがあればfalse
  if (
    display === "inline" &&
    [...element.children].some((child) => {
      // チェックボックス・ラジオボタンはlabelと無限ループになるので除外
      if (isCheckboxOrRadiobutton(child)) {
        return false;
      }
      return !isSmallTarget(child, elementDocument, elementWindow, shadowRoots);
    })
  ) {
    return false;
  }

  return true;
};

const hasAdequateSpacing = (
  element: Element,
  elementDocument: Document,
  shadowRoots?: ShadowRoot[],
): boolean => {
  // First, check if there are any other target elements in the document
  // If not, spacing exception doesn't apply (isolated targets should show warnings)
  const hasOtherTargets = hasOtherTargetsInDocument(
    element,
    elementDocument,
    shadowRoots,
  );
  if (!hasOtherTargets) {
    return false;
  }

  // Use getBoundingClientRect for viewport coordinates (matches elementFromPoint)
  const rect = element.getBoundingClientRect();

  // Calculate center point of the element in viewport coordinates
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Define 24px square centered on the element (approximation of 24px diameter circle)
  // Check 8 points: 4 corners + 4 midpoints of sides
  const checkPoints = [
    // Top-left, top-center, top-right
    { x: centerX - 12, y: centerY - 12 },
    { x: centerX, y: centerY - 12 },
    { x: centerX + 12, y: centerY - 12 },
    // Left-center, right-center
    { x: centerX - 12, y: centerY },
    { x: centerX + 12, y: centerY },
    // Bottom-left, bottom-center, bottom-right
    { x: centerX - 12, y: centerY + 12 },
    { x: centerX, y: centerY + 12 },
    { x: centerX + 12, y: centerY + 12 },
  ];

  // Check each point using elementFromPoint
  for (const point of checkPoints) {
    if (hasTargetElementAtPoint(point.x, point.y, elementDocument, element)) {
      return false; // Found another target within the 24px square
    }
  }

  return true; // No other targets found within the 24px square
};

const hasTargetElementAtPoint = (
  x: number,
  y: number,
  doc: Document,
  excludeElement: Element,
): boolean => {
  // Use elementsFromPoint to get all elements at the position
  const elementsAtPoint = doc.elementsFromPoint(x, y);
  if (!elementsAtPoint || elementsAtPoint.length === 0) {
    return false;
  }

  // Find the first element that is not part of the extension
  let targetElement: Element | null = null;
  for (const element of elementsAtPoint) {
    // Skip extension elements (those with data-a11y-visualizer-extension attribute or their descendants)
    if (isExtensionElement(element)) {
      continue;
    }

    targetElement = element;
    break;
  }

  if (!targetElement) {
    return false;
  }

  // Check if targetElement or any of its ancestors is a target (excluding excludeElement)
  let current: Element | null = targetElement;
  while (current) {
    if (current === excludeElement) {
      break; // Don't include the element we're checking
    }

    if (current.matches(COMBINED_SELECTOR)) {
      return true;
    }

    current = current.parentElement;
  }

  // If the target element is an iframe, check inside the iframe as well
  if (targetElement.tagName.toLowerCase() === "iframe") {
    const iframe = targetElement as HTMLIFrameElement;
    try {
      const iframeDoc = iframe.contentDocument;
      if (iframeDoc) {
        // Convert coordinates to iframe's coordinate system
        const iframeRect = iframe.getBoundingClientRect();
        const iframeX = x - iframeRect.left;
        const iframeY = y - iframeRect.top;

        const iframeElementsAtPoint = iframeDoc.elementsFromPoint(
          iframeX,
          iframeY,
        );
        if (iframeElementsAtPoint && iframeElementsAtPoint.length > 0) {
          for (const iframeElement of iframeElementsAtPoint) {
            let iframeCurrent: Element | null = iframeElement;
            while (iframeCurrent) {
              if (iframeCurrent.matches(COMBINED_SELECTOR)) {
                return true;
              }
              iframeCurrent = iframeCurrent.parentElement;
            }
          }
        }
      }
    } catch {
      // Cross-origin iframe access denied - ignore silently
    }
  }

  return false;
};

const isExtensionElement = (element: Element): boolean => {
  // Check if the element itself or any of its ancestors has the extension marker
  let current: Element | null = element;
  while (current) {
    if (current.hasAttribute("data-a11y-visualizer-extension")) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
};

const hasOtherTargetsInDocument = (
  element: Element,
  elementDocument: Document,
  shadowRoots?: ShadowRoot[],
): boolean => {
  // Use combined selector for efficient single query
  const allTargets = querySelectorAllFromRoots(
    COMBINED_SELECTOR,
    elementDocument,
    shadowRoots,
  );

  // Check if any target other than the current element exists
  for (const target of allTargets) {
    if (target !== element) {
      return true;
    }
  }

  return false;
};

const isCheckboxOrRadiobutton = (element: Element): boolean => {
  const tagName = element.tagName.toLowerCase();
  const typeAttr = element.getAttribute("type");
  return (
    tagName === "input" && (typeAttr === "checkbox" || typeAttr === "radio")
  );
};
