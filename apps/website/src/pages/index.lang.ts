const dict = {
  subtitle: "Simple and Visible Web Accessibility",
  hero: {
    title: "Visualize Web Accessibility",
    description:
      "A browser extension that lets you easily view information perceived by users of assistive technologies like screen readers, directly in Chrome and Firefox.",
    screenshotSrc: "/a11y-visualizer/images/screenshot_en.png",
  },
  features: {
    title: "Features",
    items: {
      visual: {
        title: "Information Visualization",
        description:
          "Visualize information that's hard to check with browsers alone, such as image alt text, heading levels, and form labels",
      },
      detection: {
        title: "Issue Detection",
        description: "Highlight problematic markup and techniques that need attention",
      },
      liveRegions: {
        title: "Live Regions",
        description:
          "Visually display information dynamically conveyed to assistive technologies like screen readers",
      },
      customizable: {
        title: "Customizable",
        description:
          "Customize element types and display methods to match your target website",
      },
    },
  },
  download: {
    title: "Download",
    chromeStore: "Chrome Web Store",
    firefoxAddons: "Firefox Add-ons",
  },
  guide: {
    title: "User Guide",
    description: "Learn how to use Accessibility Visualizer",
    link: "View User Guide",
    url: "/a11y-visualizer/docs/UsersGuide",
  },
  tests: {
    title: "Test Pages",
    description:
      "We've prepared various implementation examples for you to verify Accessibility Visualizer's functionality",
    link: "Go to Test Pages",
    url: "/a11y-visualizer/tests",
  },
} as const;

export default dict;

