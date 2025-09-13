export default {
  title: "Buttons",
  intro:
    "Buttons are interactive elements that users activate to perform actions. They must be accessible to keyboard users and screen readers. The following examples show various button implementations and common accessibility issues.",
  sections: {
    buttonElement: { title: "<button> Element" },
    buttonRole: { title: "Button Role" },
    inputElements: { title: "Input Elements" },
    summary: { title: "Summary Element" },
  },
  examples: {
    button: {
      standard: {
        title: "Standard button element",
        desc: "✅ The most accessible way to create a button. Semantic HTML buttons are keyboard accessible by default and announced correctly by screen readers.",
      },
      ariaHidden: {
        title: "Button with aria-hidden",
        desc: "❌ Button hidden from assistive technologies. This makes the button inaccessible to screen reader users while remaining visible to sighted users.",
      },
      imgWithAlt: {
        title: "Button containing image with alt text",
        desc: "✅ Button with an image that has proper alt text. The alt text becomes the accessible name of the button.",
      },
      imgNoAlt: {
        title: "Button containing image without alt text",
        desc: "❌ Button with an image missing alt text. Screen readers cannot determine what this button does, making it inaccessible.",
      },
    },
    role: {
      divWithRole: {
        title: "Div with button role and tabindex",
        desc: "✅ Properly implemented custom button using a div. Includes role='button' and tabindex='0' to make it accessible. However, semantic HTML buttons are preferred.",
      },
      divNoRole: {
        title: "Div as button without role",
        desc: "❌ Custom button missing role='button'. Screen readers won't identify this as an interactive element, making it inaccessible.",
      },
      divNoTabindex: {
        title: "Div as button without tabindex",
        desc: "❌ Custom button that can't receive keyboard focus. Keyboard users won't be able to activate this button.",
      },
    },
    input: {
      button: {
        title: 'Input type="button"',
        desc: "✅ Input element with type='button'. Uses the value attribute to provide the button's accessible name.",
      },
      buttonNoValue: {
        title: 'Input type="button" without value',
        desc: "❌ Input button without a value attribute has no accessible name. Screen readers cannot identify what this button does.",
      },
      submit: {
        title: 'Input type="submit"',
        desc: "✅ Submit button with proper value. Used within forms to submit data. Has default value of 'Submit' if none provided.",
      },
      submitNoValue: {
        title: 'Input type="submit" without value',
        desc: "Submit button without explicit value. Browsers provide a default accessible name ('Submit'), but it's better to be explicit.",
      },
      reset: {
        title: 'Input type="reset"',
        desc: "✅ Reset button that clears form data. Has proper value attribute for accessibility.",
      },
      resetNoValue: {
        title: 'Input type="reset" without value',
        desc: "Reset button without explicit value. Browsers provide a default accessible name ('Reset'), but explicit values are clearer.",
      },
      image: {
        title: 'Input type="image"',
        desc: "❌ Image input without alt text. This creates an inaccessible submit button since screen readers can't determine its purpose.",
      },
      imageWithAlt: {
        title: 'Input type="image" with alt text',
        desc: "✅ Image input with proper alt text. The alt attribute provides the accessible name for this submit button type.",
      },
    },
    summary: {
      standard: {
        title: "Summary element",
        desc: "✅ Summary element within details for creating disclosure widgets. Semantically correct and accessible by default.",
      },
      noDetails: {
        title: "Summary element without details",
        desc: "❌ Summary element used outside of details. This is invalid HTML and may not work as expected across all browsers.",
      },
      noName: {
        title: "Summary without accessible name",
        desc: "❌ Summary element with no text content or accessible name. Users won't know what this control does.",
      },
    },
  },
} as const;
