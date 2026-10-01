# @a11y-visualizer/rules

Accessibility rules that inspect a DOM element and return what to show about it: errors and warnings (e.g. missing accessible names, invalid ARIA usage), and informational content (accessible name, role, heading level, table headers, and so on).

This package is the rule engine of [Accessibility Visualizer](../../README.md), but it has no dependency on the browser extension or its UI. You can use it on its own, for example in a test suite, a custom overlay, or another inspection tool.

## Requirements

- A browser environment (or a browser-based test runner). Some rules rely on computed styles and layout (e.g. `target-size`), so jsdom or happy-dom will not give accurate results.
- Depends on [`@a11y-visualizer/dom-utils`](../dom-utils/README.md), [`@a11y-visualizer/table`](../table/README.md), and [`dom-accessibility-api`](https://github.com/eps1lon/dom-accessibility-api).

## Installation

This package is not published to npm. Inside this monorepo, add it as a workspace dependency:

```json
{
  "dependencies": {
    "@a11y-visualizer/rules": "workspace:*"
  }
}
```

The package exports its TypeScript sources directly (`src/index.ts`), so the consumer needs a bundler or TypeScript setup that can compile them.

## Usage

Run every rule against every element on a page:

```ts
import { getKnownRole } from "@a11y-visualizer/dom-utils";
import {
  isRuleTargetElement,
  type RuleResult,
  Rules,
} from "@a11y-visualizer/rules";
import type { Table } from "@a11y-visualizer/table";
import { computeAccessibleName } from "dom-accessibility-api";

// Shared across all elements so each table is parsed only once
const tables: Table[] = [];

for (const el of document.body.querySelectorAll("*")) {
  const role = getKnownRole(el);
  const name = computeAccessibleName(el);

  const results = Rules.flatMap<RuleResult>((rule) =>
    isRuleTargetElement(el, rule, role)
      ? (rule.evaluate(el, rule.defaultOptions, {
          name,
          role,
          tables,
          elementDocument: document,
          elementWindow: window,
        }) ?? [])
      : [],
  );

  for (const result of results) {
    if (result.type === "error" || result.type === "warning") {
      console.log(el, result.ruleName, result.type, result.message);
    }
  }
}
```

Or run a single rule:

```ts
import { ImageName } from "@a11y-visualizer/rules";

const img = document.querySelector("img")!;
ImageName.evaluate(img, { enabled: true }, {});
// e.g. [{ type: "error", ruleName: "image-name", message: "No alt attribute" }]
```

The `body` element is where page-level rules (`page-title`, `page-lang`) report their results, so include it when you evaluate.

## Results

`evaluate` returns `RuleResult[]`, or `undefined` when there is nothing to report. Every result has `ruleName` and `type`:

| `type` | Shape | Meaning |
| --- | --- | --- |
| `"error"` | `{ message, messageParams? }` | A clear accessibility violation. |
| `"warning"` | `{ message, messageParams? }` | A possible issue that depends on context (may be a false positive). |
| One of `CONTENT_TYPES` (`"name"`, `"role"`, `"heading"`, `"tableHeader"`, ...) | `{ content, contentLabel? }` | Information about the element, not an issue. |
| `"state"` | `{ state }` | A state of the element, such as checked or expanded. |
| `"ariaAttributes"` | `{ attributes: { name, value }[] }` | The `aria-*` attributes on the element. |

### Messages and translations

`message`, `state`, and the `content` of content types that are not in `RAW_CONTENT_TYPES` are **English translation keys**, not end-user sentences. They read fine as English, but some contain placeholders in [i18next](https://www.i18next.com/) syntax that must be filled from `messageParams`:

```ts
{
  type: "warning",
  ruleName: "id-reference",
  message: "Referenced IDs do not exist: {{idsWithAttributes}}",
  messageParams: { idsWithAttributes: "missing-id (aria-labelledby)" },
}
```

The `content` of types in `RAW_CONTENT_TYPES` (accessible name, description, language, page title, ...) comes from the page itself and should be displayed as is.

Translations for English, Japanese, and Korean live in the browser extension: [`apps/browser_extension/src/i18n/`](../../apps/browser_extension/src/i18n/).

## Rules

All rules are exported individually and collected in the `Rules` array.

| Export | `ruleName` | What it checks or shows |
| --- | --- | --- |
| `AbstractRole` | `abstract-role` | Use of abstract WAI-ARIA roles |
| `AccessibleDescription` | `accessible-description` | Shows the accessible description |
| `AccessibleName` | `accessible-name` | Shows the accessible name; flags names on roles that cannot or should not be named |
| `AriaAttributes` | `aria-attributes` | Shows `aria-*` attributes and `aria-roledescription` |
| `AriaState` | `aria-state` | Shows states such as checked, selected, expanded, disabled |
| `AriaValidation` | `aria-validation` | Invalid ARIA attribute values, and attributes not allowed on the role |
| `ContenteditableRole` | `contenteditable-role` | `contenteditable` elements without an appropriate role |
| `ControlFocus` | `control-focus` | Controls that are not focusable |
| `ControlName` | `control-name` | Controls without an accessible name |
| `Fieldset` | `fieldset` | Shows `<fieldset>` |
| `HeadingLevel` | `heading-level` | Shows the heading level; missing or invalid levels |
| `HeadingName` | `heading-name` | Empty headings |
| `Hgroup` | `hgroup` | Shows `<hgroup>` |
| `IdReference` | `id-reference` | ID references (`aria-labelledby`, `for`, ...) pointing to missing elements |
| `IframeName` | `iframe-name` | `<iframe>` without a `title` |
| `ImageName` | `image-name` | Images without alternative text |
| `Inert` | `inert` | Inert elements |
| `LabelAssociatedControl` | `label-associated-control` | `<label>` not associated with any control |
| `Landmark` | `landmark` | Shows landmarks |
| `Lang` | `lang` | Shows `lang`; invalid language tags, `lang` / `xml:lang` mismatch |
| `LinkHref` | `link-href` | `<a>` / `<area>` without `href` |
| `LinkTarget` | `link-target` | Shows the link `target` |
| `List` | `list` | Shows list type and item count; invalid list children |
| `ListItem` | `list-item` | List items outside a list |
| `NestedInteractive` | `nested-interactive` | Interactive elements nested inside interactive elements |
| `PageLang` | `page-lang` | Missing or invalid `lang` on `<html>` |
| `PageTitle` | `page-title` | Shows the page title; missing `<title>` |
| `RadioGroup` | `radio-group` | Radio buttons without a `name` or not grouped |
| `Role` | `role` | Shows the role; unknown roles |
| `SvgSkip` | `svg-skip` | `<svg>` that may be skipped by assistive technologies |
| `TabIndex` | `tab-index` | Shows `tabindex`; positive or invalid values |
| `TableHeader` | `table-header` | Shows the headers that apply to a table cell |
| `TablePosition` | `table-position` | Shows the row and column of a table cell |
| `TableSize` | `table-size` | Shows the number of rows and columns of a table |
| `TargetSize` | `target-size` | Small or crowded pointer targets (WCAG 2.5.8) |

## API

### `RuleObject`

Each rule is a `RuleObject`:

| Property | Description |
| --- | --- |
| `ruleName` | Identifier of the rule. Set as `ruleName` on its results. |
| `evaluate(element, options, condition)` | Evaluates the element and returns `RuleResult[] \| undefined`. Returns `undefined` when `options.enabled` is `false`. |
| `defaultOptions` | Default options (`{ enabled: true }`). |
| `tagNames?` / `roles?` / `selectors?` | Elements the rule applies to. If none are defined, the rule applies to every element. Use `isRuleTargetElement` to check. |

### `RuleEvaluationCondition`

The third argument of `evaluate`. Every field is optional; values you have already computed avoid recomputation inside each rule.

| Field | Description |
| --- | --- |
| `name` | Accessible name of the element. |
| `role` | Role of the element (e.g. from `getKnownRole`). |
| `elementDocument` | `Document` the element belongs to. Defaults to `element.ownerDocument`. |
| `elementWindow` | `Window` the element belongs to. |
| `tables` | A shared, mutable array of parsed `Table` instances. Table rules add to it, so pass the same array for all elements of a page. |
| `srcdoc` | Whether the element is inside an `<iframe srcdoc>` (suppresses page-level errors such as a missing `<title>`). |
| `shadowRoots` | Shadow roots on the page, used to resolve ID references across Shadow DOM. |

### Utilities

| Export | Description |
| --- | --- |
| `Rules` | Array of all rules. |
| `isRuleTargetElement(element, rule, role?)` | Whether the element matches the rule's `tagNames`, `roles`, or `selectors`. Pass `role` if already computed. |
| `getRuleResultIdentifier(result)` | A string that identifies a result, useful for de-duplication or as a React `key`. |
| `CONTENT_TYPES` | All content result types. |
| `RAW_CONTENT_TYPES` | Content result types whose `content` comes from the page and should not be translated. |

Types: `RuleObject`, `RuleEvaluation`, `RuleEvaluationCondition`, `RuleResult`, `RuleResultMessage`, `RuleResultError`, `RuleResultWarning`, `RuleResultContent`, `RuleResultRawContent`, `RuleResultState`, `RuleResultAriaAttributes`.

## Development

```bash
# Run tests (Vitest browser mode with Playwright: Chromium and Firefox)
pnpm --filter=@a11y-visualizer/rules test

# Run tests for a single rule
pnpm --filter=@a11y-visualizer/rules test src/image-name/index.test.ts

# Lint / format
pnpm --filter=@a11y-visualizer/rules lint
pnpm --filter=@a11y-visualizer/rules lint-fix
```

Tests run in real browsers. If Playwright browsers are not installed yet, run `pnpm install-playwright` at the repository root.

To add a rule, create `src/<rule-name>/index.ts` exporting a `RuleObject` with tests next to it, register it in [`src/Rules.ts`](src/Rules.ts), and add its messages to the extension's translation files. See [CLAUDE.md](../../CLAUDE.md) for message and severity guidelines.

## License

MIT. See [LICENSE.txt](../../LICENSE.txt).
