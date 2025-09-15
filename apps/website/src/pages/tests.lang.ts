const dict = {
  header: {
    subtitle: "Test Examples",
  },
  notice: {
    title: "Test Page Notice",
    p1: "This page contains intentionally problematic accessibility patterns for testing and demonstration purposes only.",
    p2: "Do not use these examples in production websites. They violate accessibility guidelines and best practices.",
    p3: "This page is designed to work with the Accessibility Visualizer browser extension to help developers identify and understand accessibility issues.",
  },
  intro: {
    title: "Test Examples",
    desc: "This page serves as a testing ground for the Accessibility Visualizer browser extension. It contains various examples of web elements with accessibility issues to demonstrate how the extension highlights problems and provides information about accessible alternatives.",
  },
  categories: {
    title: "Categories",
    headings: {
      images: "Images",
      buttons: "Buttons",
      links: "Links",
      forms: "Form Controls",
      headings: "Headings",
      tables: "Tables",
      ariaHidden: "ARIA Hidden",
      landmarks: "Layout & Landmarks",
      liveRegions: "Live Regions",
    },
  },
} as const;

export default dict;
