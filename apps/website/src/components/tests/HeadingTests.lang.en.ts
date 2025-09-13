export default {
  title: "Headings",
  intro:
    "Headings provide a hierarchical structure to web content, helping users understand page organization and navigate efficiently. Screen readers use headings as navigation landmarks, so proper heading structure is crucial for accessibility.",
  sections: {
    hierarchy: { title: "Heading Hierarchy" },
    problematic: { title: "Problematic Headings" },
  },
  examples: {
    hierarchy: {
      demo: {
        title: "Heading hierarchy demonstration",
        desc: "This example shows the standard HTML heading hierarchy from h1 to h6, plus a custom heading using ARIA attributes. Notice how heading levels should follow a logical order.",
      },
      best: {
        title: "Best practices:",
        item1: "Start with h1 for main page title",
        item2: "Don't skip heading levels (h1 → h3 without h2)",
        item3: "Use headings to create a logical content outline",
        item4: "Each page should have only one h1",
        item5: 'Use role="heading" with aria-level for headings beyond h6',
      },
    },
    problematic: {
      skipped: {
        title: "Problematic heading: Skipped level",
        desc: "❌ This example shows incorrect heading hierarchy where h4 appears without h2 or h3. This breaks the logical document structure.",
        note: "This h4 should be h2 to maintain proper hierarchy.",
      },
      empty: {
        title: "Empty heading",
        desc: "❌ Heading element with no text content. Screen readers cannot announce meaningful information about this heading.",
        note: "This h6 element contains no text and provides no value to users.",
      },
    },
  },
} as const;
