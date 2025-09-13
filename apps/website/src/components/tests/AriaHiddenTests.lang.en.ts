export default {
  title: "ARIA Hidden",
  intro:
    "The aria-hidden attribute controls whether elements are exposed to assistive technologies. When properly used, it can hide decorative content, but when misused, it can make important content inaccessible.",
  sections: {
    visible: { title: "Visible Content" },
    hidden: { title: "Hidden Content" },
    icons: { title: "Icons" },
  },
  examples: {
    visible: {
      false: {
        title: "Visible text with aria-hidden='false'",
        desc: "Text that is visible and explicitly exposed to assistive technologies. The aria-hidden='false' is usually unnecessary as elements are exposed by default.",
      },
      true: {
        title: "Visible text with aria-hidden='true'",
        desc: "❌ Visible text hidden from assistive technologies. This creates a confusing experience where sighted users can see content that screen reader users cannot access.",
      },
    },
    hidden: {
      true: {
        title: "Hidden text with aria-hidden='true'",
        desc: "Properly hidden decorative or redundant content. Both visually hidden and hidden from assistive technologies.",
      },
    },
    icons: {
      decorativeTrue: {
        title: "Decorative icon with aria-hidden='true'",
        desc: "✅ Proper use of aria-hidden for decorative icons that don't convey essential information. The icon is hidden while the text remains accessible.",
      },
      importantNoHidden: {
        title: "Important icon without aria-hidden",
        desc: "❌ Icon that conveys important information but isn't hidden and lacks alternative text. Screen readers might announce confusing information or miss the meaning entirely.",
      },
      accessibleLabeled: {
        title: "Accessible icon with proper labeling",
        desc: "✅ Icon that conveys meaning with proper accessible labeling using aria-label. The icon provides both visual and programmatic meaning.",
      },
    },
  },
} as const;
