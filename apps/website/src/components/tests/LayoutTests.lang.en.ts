export default {
  title: "Layout & Landmarks",
  intro:
    "Semantic HTML elements and ARIA landmarks help users understand page structure and navigate efficiently. These elements provide important context about different sections of content.",
  sections: {
    semantic: { title: "Semantic Sections" },
    landmarks: { title: "ARIA Landmarks" },
    generic: { title: "Generic Containers" },
    sectionElements: { title: "Section Elements" },
    iframe: { title: "iFrame Elements" },
    dialog: { title: "Dialog and Modal" },
  },
  examples: {
    semantic: {
      html5: {
        title: "Semantic HTML5 sections",
        desc: "✅ Proper use of HTML5 semantic elements that provide clear structure and meaning to page content.",
      },
    },
    landmarks: {
      roles: {
        title: "ARIA landmark roles",
        desc: "✅ ARIA landmark roles that provide the same navigation benefits as semantic HTML elements. Use when semantic HTML isn't available.",
      },
    },
    generic: {
      divs: {
        title: "Generic div containers without semantic meaning",
        desc: "❌ Using generic div elements for major page sections provides no semantic information to assistive technologies.",
        note: "These divs provide no information about content purpose or page structure.",
      },
    },
    section: {
      withHeading: {
        title: "Section with heading",
        desc: "✅ Proper use of section element with heading. Sections should have headings to provide context about their content.",
        note: "This section element has a clear heading that describes its content.",
      },
      noHeading: {
        title: "Section without heading",
        desc: "❌ Section element without a heading. Sections should have headings to be meaningful landmarks for screen reader users.",
      },
    },
    iframe: {
      withTitle: {
        title: "iFrame with title attribute",
        desc: "✅ iFrame with proper title attribute that describes the content. Essential for screen readers to understand what the frame contains.",
        heading: "Sample content iframe",
      },
      noTitle: {
        title: "iFrame without title attribute",
        desc: "❌ iFrame missing title attribute. Screen readers cannot determine what content the frame contains, making it inaccessible.",
      },
      lazy: {
        title: "iFrame with loading='lazy'",
        desc: "iFrame with lazy loading for performance. Still needs proper title attribute for accessibility.",
        heading: "Lazy loaded iframe content",
      },
    },
    dialog: {
      element: {
        title: "Dialog element",
        desc: "Example of HTML5 dialog element. When opened with showModal(), it becomes a modal that traps focus and blocks interaction with background content.",
      },
      ariaModal: {
        title: "Element with aria-modal='true'",
        desc: "✅ Custom modal implementation with proper focus management - traps focus inside the modal and returns focus to the opening button when closed.",
      },
    },
  },
} as const;
