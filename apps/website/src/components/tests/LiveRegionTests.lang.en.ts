export default {
  title: "Live Regions",
  intro:
    "Live regions announce dynamic content changes to screen readers. They're essential for providing feedback about status updates, errors, and other dynamic content that users need to be aware of immediately.",
  sections: {
    ariaLive: { title: "aria-live Attribute" },
    roles: { title: "Live Region Roles" },
    output: { title: "Output Element" },
    ariaAtomic: { title: "aria-atomic Attribute" },
    problematic: { title: "Problematic Live Regions" },
    priority: { title: "Live Region Priority Interactions" },
    ariaBusy: { title: "aria-busy Suppression" },
    continuous: { title: "Continuously Updating Live Regions" },
  },
  examples: {
    ariaLive: {
      polite: {
        title: "aria-live='polite'",
        desc: "✅ Polite live region that announces changes when the user is idle. Good for status updates that aren't urgent.",
      },
      assertive: {
        title: "aria-live='assertive'",
        desc: "✅ Assertive live region that immediately interrupts screen readers to announce changes. Use for critical alerts and errors.",
      },
    },
    roles: {
      status: {
        title: "role='status'",
        desc: "✅ Status role provides advisory information that isn't critical. Equivalent to aria-live='polite'.",
      },
      alert: {
        title: "role='alert'",
        desc: "✅ Alert role for important, time-sensitive information. Equivalent to aria-live='assertive'.",
      },
    },
    output: {
      element: {
        title: "<output> element",
        desc: "✅ Output element for displaying calculation results or form output. Automatically has live region behavior.",
      },
    },
    ariaAtomic: {
      true: {
        title: "Live region with aria-atomic='true'",
        desc: "Live region where the entire content is announced when any part changes, rather than just the changed portion.",
      },
    },
    problematic: {
      noLive: {
        title: "Dynamic content without live region",
        desc: "❌ Content that changes dynamically but isn't marked as a live region. Screen readers won't announce these changes.",
      },
    },
    priority: {
      simultaneous: {
        title: "Polite and Assertive simultaneous updates",
        desc: "⚠️ Demonstrates how assertive live regions interrupt polite ones. When both update simultaneously, the polite announcement may be suppressed.",
      },
      sequential: {
        title: "Sequential updates with different priorities",
        desc: "Demonstrates how assertive announcements can clear pending polite announcements from the queue.",
      },
    },
    ariaBusy: {
      suppression: {
        title: "Live region with aria-busy suppression",
        desc: "⚠️ Demonstrates how aria-busy='true' suppresses live region announcements. When a region is marked as busy, content changes are not announced to screen readers.",
      },
    },
    continuous: {
      timerPolite: {
        title: "Timer with polite announcements",
        desc: "Timer that updates every second with polite live region. Good for testing extension behavior with frequent updates.",
      },
      counterAssertive: {
        title: "Live counter with assertive announcements",
        desc: "Counter that auto-increments every 2 seconds with assertive live region. Useful for testing frequent interruptions.",
      },
      statusUpdates: {
        title: "Status updates with role='status'",
        desc: "Status messages that update every 3 seconds. Tests extension handling of role-based live regions with continuous updates.",
      },
    },
  },
} as const;
