---
"@a11y-visualizer/dom-utils": patch
"@a11y-visualizer/rules": patch
---

Align several rules more closely with the HTML and WAI-ARIA specifications:

- `<label for="...">` with an unresolvable or non-labelable reference no longer falls back to a contained control, matching HTML's labeled-control resolution.
- Descendants of a disabled `<fieldset>`'s first `<legend>` are no longer reported as disabled, per the HTML exception.
- Radio buttons are grouped by their form owner, so the `form` attribute is honored and same-named radios in different forms are treated as separate groups.
- Nested interactive detection now also catches descendants with an interactive ARIA role (e.g. `role="button"`) that lack `tabindex`.
- `<optgroup>` now correctly resolves to the `group` role.
