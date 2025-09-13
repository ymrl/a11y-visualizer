export default {
  title: "Tables",
  intro:
    "Tables organize data in rows and columns and must be properly structured for screen readers to understand relationships between data. Proper table headers and semantic markup are essential for accessibility.",
  sections: {
    structure: { title: "Table Structure" },
    headers: { title: "Table Headers" },
    misuse: { title: "Table Misuse" },
  },
  examples: {
    structure: {
      properHeaders: {
        title: "Table with proper headers",
        desc: "✅ Well-structured table with th elements for headers and proper scope attributes. Screen readers can announce column/row relationships.",
      },
      noHeaders: {
        title: "Table without headers",
        desc: "❌ Table using only td elements without proper th headers. Screen readers cannot establish relationships between data.",
      },
    },
    headers: {
      rowHeaders: {
        title: "Table with row headers",
        desc: "✅ Table with both column headers and row headers using appropriate scope attributes for complex data relationships.",
      },
      withCaption: {
        title: "Table with caption",
        desc: "✅ Table with caption element providing context about the table's purpose. Helps users understand what data the table contains.",
      },
    },
    misuse: {
      layoutTable: {
        title: "Layout table (problematic)",
        desc: "❌ Table used for layout purposes rather than tabular data. Modern CSS should be used for layout instead of tables.",
      },
    },
  },
} as const;
