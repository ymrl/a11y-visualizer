export default {
  title: "Form Controls",
  intro:
    "Form controls are interactive elements that allow users to input data. They must have proper labels and be accessible to screen readers and keyboard users. The following examples demonstrate both accessible implementations and common accessibility issues.",
  sections: {
    textInputs: { title: "Text Inputs" },
    selectElements: { title: "Select Elements" },
    textareaElements: { title: "Textarea Elements" },
    editableElements: { title: "Editable Elements" },
    radioButtons: { title: "Radio Buttons" },
    checkboxes: { title: "Checkboxes" },
    labelIssues: { title: "Label Issues" },
    inputStates: { title: "Input States" },
  },
  examples: {
    textInputs: {
      withoutLabel: {
        title: "Input without label",
        desc: "❌ Text input without any label. Screen readers cannot determine what this field is for, making it inaccessible.",
      },
      withLabel: {
        title: "Input with proper label",
        desc: "✅ Text input with associated label using 'for' and 'id' attributes. This creates a programmatic relationship between label and input.",
      },
      describedbyMissing: {
        title: "Input with aria-describedby referencing missing IDs",
        desc: "❌ Input using aria-describedby to reference description elements that don't exist in the document.",
      },
      mixedRefs: {
        title: "Input with mixed existing and missing ID references",
        desc: "⚠️ Input where some referenced IDs exist and others don't. This creates partial accessibility relationships.",
      },
    },
    selectElements: {
      withoutLabel: {
        title: "Select without label",
        desc: "❌ Select element without label. Users cannot determine what this dropdown is for.",
      },
      withLabel: {
        title: "Select with proper label",
        desc: "✅ Select element with associated label. Screen readers can announce both the label and the current selection.",
      },
    },
    textarea: {
      withoutLabel: {
        title: "Textarea without label",
        desc: "❌ Textarea without label. Users cannot understand what content should be entered here.",
      },
      withLabel: {
        title: "Textarea with proper label",
        desc: "✅ Textarea with associated label. Clearly communicates the purpose of the text area to all users.",
      },
    },
    editable: {
      noRole: {
        title: "Contenteditable div without role",
        desc: "⚠️ Contenteditable div without proper role. While functional, screen readers may not announce it as a text input field.",
      },
      textboxLabelled: {
        title: "Contenteditable div with role='textbox' and aria-labelledby",
        desc: "✅ Contenteditable div with proper textbox role and accessible labeling. Uses aria-labelledby to connect with the label element.",
      },
      textboxMultiline: {
        title: "Contenteditable div with role='textbox' and aria-multiline",
        desc: "✅ Contenteditable div configured for multiline editing. The aria-multiline attribute helps screen readers understand the expected input type.",
      },
      noLabel: {
        title: "Contenteditable without label",
        desc: "❌ Contenteditable element without any label or accessible name. Screen readers cannot identify what this field is for.",
      },
      ariaLabel: {
        title: "Contenteditable with aria-label",
        desc: "✅ Contenteditable element using aria-label for accessibility. When a visual label isn't appropriate, aria-label provides the accessible name.",
      },
      placeholder: {
        title: "Contenteditable with placeholder using aria-placeholder",
        desc: "✅ Contenteditable element with proper placeholder semantics using aria-placeholder. This provides hint text that's accessible to screen readers.",
      },
    },
    radio: {
      withLabels: {
        title: "Radio buttons with labels",
        desc: "✅ Properly labeled radio buttons with shared name attribute. Forms a logical group that screen readers can navigate.",
      },
      withoutLabels: {
        title: "Radio buttons without labels",
        desc: "❌ Radio buttons without proper labels. Text appears next to radios but isn't programmatically associated, making it inaccessible.",
      },
      withoutName: {
        title: "Radio buttons without name attribute",
        desc: "❌ Radio buttons without shared name attribute. These don't form a proper group, so both can be selected simultaneously.",
      },
      differentName: {
        title: "Radio buttons with different name attributes",
        desc: "❌ Radio buttons with different name attributes don't form a logical group. Each acts as an independent radio button.",
      },
    },
    checkbox: {
      withLabels: {
        title: "Checkboxes with labels",
        desc: "✅ Properly labeled checkboxes. Each checkbox has a clear, accessible name that screen readers can announce.",
      },
      withoutLabels: {
        title: "Checkboxes without labels",
        desc: "❌ Checkboxes without proper labels. Text appears nearby but isn't programmatically associated with the checkboxes.",
      },
      customDisplayNone: {
        title: "Custom styled checkbox with display: none",
        desc: "❌ Custom checkbox using 'display: none' which can remove the element from keyboard navigation and screen readers in some cases.",
      },
    },
    labels: {
      orphaned: {
        title: "Orphaned label",
        desc: "❌ Label element not associated with any form control. This can confuse screen readers and doesn't provide any functional benefit.",
      },
      missingId: {
        title: "Label with non-existent ID reference",
        desc: "❌ Label element referencing an ID that doesn't exist. Screen readers cannot establish the relationship between label and control.",
      },
    },
    states: {
      required: {
        title: "Required input",
        desc: "✅ Input with required attribute. Screen readers can announce that this field is required. Consider adding visual indicators and clear error messaging.",
      },
      readonly: {
        title: "Read-only input",
        desc: "Read-only input that users cannot modify. Screen readers will announce this state. Useful for displaying non-editable information in form context.",
      },
    },
  },
} as const;
