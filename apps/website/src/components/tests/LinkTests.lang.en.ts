export default {
  title: "Links",
  intro:
    "Links are essential navigation elements that allow users to move between pages or sections. They must be properly implemented to ensure keyboard accessibility and clear communication to screen reader users.",
  sections: {
    aElement: { title: "<a> Element" },
    linkRole: { title: "Link Role" },
    variations: { title: "Link Variations" },
    iconLinks: { title: "Icon Links" },
  },
  examples: {
    a: {
      standard: {
        title: "Standard link with href",
        desc: "✅ Properly implemented link with href attribute. This is keyboard accessible and clearly identified by screen readers as a navigation element.",
      },
      noHref: {
        title: "Anchor without href attribute",
        desc: "❌ Anchor element without href attribute. This is not a functional link and won't be keyboard accessible or announced properly by screen readers.",
      },
    },
    role: {
      withRole: {
        title: 'Element with role="link"',
        desc: "✅ Custom link using role='link' with proper tabindex. While functional, semantic HTML links are preferred for better compatibility.",
      },
      noTabindex: {
        title: 'role="link" without tabindex',
        desc: "❌ Custom link that's not keyboard accessible. Missing tabindex='0' means keyboard users cannot navigate to this element.",
      },
    },
    variations: {
      targetBlank: {
        title: "Link with target='_blank'",
        desc: "Link that opens in a new window/tab. Consider adding rel='noopener noreferrer' for security and informing users about the new window behavior.",
      },
    },
    icons: {
      onlyIcon: {
        title: "Link with only an icon",
        desc: "❌ Link containing only an icon without text or accessible name. Screen readers cannot determine the link's destination or purpose.",
      },
      withAriaLabel: {
        title: "Link with icon and aria-label",
        desc: "✅ Icon link with proper role='img' and aria-label on the SVG element. This provides accessible naming for the icon while maintaining proper semantic structure.",
      },
      emptyText: {
        title: "Link with empty text content",
        desc: "❌ Link with no visible or accessible text. Screen readers cannot determine what this link does or where it leads.",
      },
    },
  },
} as const;
