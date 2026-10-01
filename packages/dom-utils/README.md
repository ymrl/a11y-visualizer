# @a11y-visualizer/dom-utils

DOM utilities for accessibility inspection: role computation, visibility checks (`display`, `aria-hidden`, `inert`), focusability, element positioning, and Shadow DOM-aware queries.

This package is part of [Accessibility Visualizer](../../README.md), but it has no dependency on the browser extension and can be used on its own in any environment with a real DOM.

## Requirements

- A browser environment (or a browser-based test runner). Many functions rely on `getComputedStyle()` and layout (`getBoundingClientRect()`), so they do not give meaningful results in jsdom or happy-dom.
- [`dom-accessibility-api`](https://github.com/eps1lon/dom-accessibility-api) (installed as a dependency)

## Installation

This package is not published to npm. Inside this monorepo, add it as a workspace dependency:

```json
{
  "dependencies": {
    "@a11y-visualizer/dom-utils": "workspace:*"
  }
}
```

The package exports its TypeScript sources directly (`src/index.ts`), so the consumer needs a bundler or TypeScript setup that can compile them (e.g. Vite, WXT, or `moduleResolution: "bundler"`).

## Usage

```ts
import {
  getKnownRole,
  isHidden,
  isInAriaHidden,
  isInInert,
  isFocusable,
} from "@a11y-visualizer/dom-utils";

const button = document.querySelector("#submit")!;

getKnownRole(button); // "button"
isHidden(button); // false unless it (or an ancestor) is display:none, etc.
isInAriaHidden(button); // true if it or an ancestor has aria-hidden="true"
isInInert(button); // true if it or an ancestor is inert
isFocusable(button, true); // keyboard-focusable?
```

## API

### Roles

| Export | Description |
| --- | --- |
| `getKnownRole(el)` | Returns the element's role (explicit `role` attribute, otherwise implicit), limited to `knownRoles`. Falls back through space-separated `role` values, and assumes browser-like roles for `<input>` types and `<svg>` that ARIA in HTML leaves undefined. Returns `null` if unknown. |
| `getImplicitRole(el)` | Returns the implicit WAI-ARIA role from the tag name and attributes, ignoring the `role` attribute. |
| `getComputedImplicitRole(el)` | Like `getImplicitRole`, but returns `html-*` pseudo roles (`COMPUTED_ROLES`) for elements with no corresponding WAI-ARIA role (e.g. `html-iframe`, `html-input-date`). |
| `computedRoleToKnownRole(role)` | Converts a `ComputedRole` to the closest WAI-ARIA role (e.g. `html-input-date` → `textbox`), or `null`. |
| `getClosestByRoles(el, roles)` | Role-based `Element.closest()`: the nearest element (including `el` itself) whose role is one of `roles`. |
| `isPresentationalChildren(el)` | Whether the element is inside an element whose role has "Children Presentational: True" (e.g. `button`, `checkbox`, `img`) or inside a `<button>`. |
| `knownRoles` / `KnownRole` | The list (and type) of roles this package recognizes: WAI-ARIA 1.2 roles including abstract roles, roles planned for ARIA 1.3, and Graphics Module roles (`graphics-*`). |
| `COMPUTED_ROLES` / `ComputedRole` | The `html-*` pseudo roles and the union type returned by `getComputedImplicitRole`. |

### Visibility and interactivity

| Export | Description |
| --- | --- |
| `isHidden(el)` | Whether the element is not rendered: `display: none`, `visibility: hidden` or `content-visibility: hidden` on itself or an ancestor, or inside a closed `<details>`. Crosses Shadow DOM boundaries. Does not consider `aria-hidden` or `inert`. |
| `isAriaHidden(el)` | Whether the element itself has `aria-hidden="true"`. |
| `isInAriaHidden(el)` | Whether the element or any ancestor has `aria-hidden="true"`. |
| `isInert(el)` | Whether the element itself is inert (`inert` attribute or CSS `interactivity: inert`). |
| `isInInert(el)` | Whether the element or any ancestor is inert. Crosses Shadow DOM boundaries. |
| `isFocusable(el, keyboard?)` | Whether the element matches `FOCUSABLE_SELECTOR`. With `keyboard = true`, elements with a negative `tabindex` are excluded. |
| `FOCUSABLE_SELECTOR` | CSS selector for elements that can be focusable (links, form controls, `contenteditable`, `[tabindex]`, ...). Does not account for `disabled` or negative `tabindex`. |
| `hasInteractiveDescendant(el)` | Whether any descendant is interactive content (links, buttons, form controls, ...) or has an interactive ARIA role. `el` itself is not checked. |
| `hasTabIndexDescendant(el)` | Whether any descendant has a `tabindex` attribute. `el` itself is not checked. |

### Layout

| Export | Description |
| --- | --- |
| `getElementPosition(el, win, offsetX?, offsetY?)` | Position and size of the element in document coordinates (scroll offset included). For `<area>`, the region is computed from `shape`/`coords` and the associated `<img>`. Returns an `ElementPosition`: `x`/`y` (with the offset subtracted), `absoluteX`/`absoluteY`, `width`, `height`. |
| `isInline(el)` | Whether the element is rendered inline within a run of text (e.g. a link in a sentence). Useful for the "Inline" exception of WCAG 2.5.8 Target Size (Minimum). |
| `isDefaultSize(el)` | Whether a `<button>` or `<input>` is displayed at the browser's default size, by comparing it with a temporarily created default element. Useful for the "User agent control" exception of WCAG 2.5.8. Always `false` for other elements. |

### Shadow DOM-aware queries

| Export | Description |
| --- | --- |
| `getElementByIdFromRoots(id, document, shadowRoots?)` | `getElementById()` that also searches the given shadow roots. |
| `querySelectorAllFromRoots(selector, root, shadowRoots?)` | `querySelectorAll()` that also searches the given shadow roots. |

## Development

```bash
# Run tests (Vitest browser mode with Playwright: Chromium and Firefox)
pnpm --filter=@a11y-visualizer/dom-utils test

# Lint / format
pnpm --filter=@a11y-visualizer/dom-utils lint
pnpm --filter=@a11y-visualizer/dom-utils lint-fix
```

Tests run in real browsers. If Playwright browsers are not installed yet, run `pnpm install-playwright` at the repository root.

## License

MIT. See [LICENSE.txt](../../LICENSE.txt).
