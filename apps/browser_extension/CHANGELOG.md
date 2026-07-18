# @a11y-visualizer/browser-extension

## 7.2.1

### Patch Changes

- e7a246f: Show the keystroke display in the top layer using the Popover API, so it appears above `<dialog>` elements and popovers, the same way the live region display does.
- 5ace999: Validate `lang` / `xml:lang` values as BCP 47 (RFC 5646) language tags. Syntactically invalid values (e.g. `lang="japanese"`) are now reported as an error, since WCAG 3.1.1 / 3.1.2 require a valid language tag.
- cb72cc2: Improve live region announcement detection to better match ARIA semantics:

  - An explicit `aria-atomic="false"` on `role="status"` / `role="alert"` regions is now honored instead of always being treated as atomic.
  - Text changes are only announced when `aria-relevant` includes `text` (or `all`). Because inserting text into a region is a text-node addition (not an element addition), regions such as `aria-relevant="additions"` no longer announce inserted or mutated text, matching NVDA's behavior.

- b6d8191: Improve live region announcement accuracy:

  - An explicit `aria-live` value now overrides the implicit level of a role, so `role="alert" aria-live="polite"` is announced politely.
  - Announcement text now excludes descendants hidden with `aria-hidden="true"` or CSS (`display:none` / `visibility:hidden`), matching what screen readers actually read.
  - Elements whose effective role is not a live region (e.g. `role="button status"`) and invalid `aria-live` values are no longer treated as live regions.
  - For atomic regions, the accessible name is taken from the atomic element that is announced.
  - Live regions added inside existing Shadow DOM are now detected.

- 359b5df: Announce alerts that become visible after being hidden. Previously, a `role="alert"` element that was hidden (via `display:none`, the `hidden` attribute, `aria-hidden`, `inert`, or `aria-busy`) when first scanned would never be announced even after it became visible. Such alerts are now re-checked on subsequent scans and announced once they become renderable.
- 2a847ca: Improve rendering performance on complex web applications:

  - Stop re-collecting and re-evaluating the whole page on every mouse move. Pointer-driven re-collection now happens only when the element under the pointer changes (`mouseover`/`mouseout`), which still picks up CSS `:hover`-driven UI such as dropdown menus.
  - Throttle pointer-tracking updates in interactive mode with `requestAnimationFrame`, and memoize each tip so only tips whose hover state changed re-render.
  - Use stable React keys based on the target element, avoiding unnecessary unmount/remount of tips when the collected list shifts.
  - Share the language setting across all tips through a single store, instead of reading extension storage and registering a listener per tip.
  - Skip scroll-container lookup (which walks ancestors with `getComputedStyle`) for elements outside the viewport, and cache lookup results within a collection pass.

- 42f0d01: Refine target-size warnings to distinguish crowded targets from isolated small targets:

  - A small target that is close to another target (inadequate spacing) is now reported as "Crowded small targets".
  - A small target with adequate spacing (including an isolated target with no nearby targets) is now consistently reported as "Small target", instead of being suppressed when other targets exist elsewhere on the page.

- Updated dependencies [8cb03cd]
- Updated dependencies [9f3c493]
- Updated dependencies [5ace999]
- Updated dependencies [4a27514]
- Updated dependencies [42f0d01]
  - @a11y-visualizer/rules@1.0.1
  - @a11y-visualizer/dom-utils@1.0.1
  - @a11y-visualizer/table@1.0.1
