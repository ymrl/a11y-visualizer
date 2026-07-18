# @a11y-visualizer/rules

## 1.0.1

### Patch Changes

- 8cb03cd: Align ARIA attribute validation with WAI-ARIA 1.2 to reduce false positives:

  - `aria-modal` is now accepted on `alertdialog` (in addition to `dialog`).
  - `aria-valuemin` / `aria-valuemax` / `aria-valuenow` / `aria-valuetext` are now accepted on `meter`.
  - `aria-colcount` / `aria-rowcount` / `aria-setsize` now accept `-1` (unknown total).
  - `aria-activedescendant` is now accepted on `toolbar` and `spinbutton`.
  - `aria-haspopup` and `aria-errormessage` are validated as non-global attributes, so misuse on unsupported roles is now reported.

- 9f3c493: Improve heading level detection to follow WAI-ARIA and HTML-AAM:

  - `aria-level` now overrides the implicit level of `h1`–`h6` elements (e.g. `<h2 aria-level="4">` is shown as level 4).
  - `role="heading"` without `aria-level` is now treated as level 2 (its implicit level) and reported as a warning instead of an error.

- 5ace999: Validate `lang` / `xml:lang` values as BCP 47 (RFC 5646) language tags. Syntactically invalid values (e.g. `lang="japanese"`) are now reported as an error, since WCAG 3.1.1 / 3.1.2 require a valid language tag.
- 4a27514: Align several rules more closely with the HTML and WAI-ARIA specifications:

  - `<label for="...">` with an unresolvable or non-labelable reference no longer falls back to a contained control, matching HTML's labeled-control resolution.
  - Descendants of a disabled `<fieldset>`'s first `<legend>` are no longer reported as disabled, per the HTML exception.
  - Radio buttons are grouped by their form owner, so the `form` attribute is honored and same-named radios in different forms are treated as separate groups.
  - Nested interactive detection now also catches descendants with an interactive ARIA role (e.g. `role="button"`) that lack `tabindex`.
  - `<optgroup>` now correctly resolves to the `group` role.

- 42f0d01: Refine target-size warnings to distinguish crowded targets from isolated small targets:

  - A small target that is close to another target (inadequate spacing) is now reported as "Crowded small targets".
  - A small target with adequate spacing (including an isolated target with no nearby targets) is now consistently reported as "Small target", instead of being suppressed when other targets exist elsewhere on the page.

- Updated dependencies [4a27514]
  - @a11y-visualizer/dom-utils@1.0.1
  - @a11y-visualizer/table@1.0.1
