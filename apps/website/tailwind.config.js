/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme("colors.zinc.700"),
            a: {
              color: theme("colors.teal.700"),
              textDecoration: "underline",
              fontWeight: "500",
              "&:hover": { color: theme("colors.teal.800") },
            },
            h1: { color: theme("colors.teal.800") },
            h2: { color: theme("colors.teal.800") },
            h3: { color: theme("colors.teal.700") },
            h4: { color: theme("colors.teal.700") },
            strong: { color: theme("colors.zinc.900") },
            code: {
              color: theme("colors.zinc.800"),
              backgroundColor: theme("colors.zinc.100"),
              padding: "0.15rem 0.35rem",
              borderRadius: "0.25rem",
            },
            blockquote: {
              borderLeftColor: theme("colors.teal.400"),
              color: theme("colors.zinc.700"),
            },
            hr: { borderColor: theme("colors.zinc.200") },
            "ol > li::marker": { color: theme("colors.zinc.500") },
            "ul > li::marker": { color: theme("colors.zinc.500") },
            figcaption: { color: theme("colors.zinc.500") },
          },
        },
        invert: {
          css: {
            color: theme("colors.zinc.300"),
            a: {
              color: theme("colors.teal.300"),
              "&:hover": { color: theme("colors.teal.200") },
            },
            h1: { color: theme("colors.teal.200") },
            h2: { color: theme("colors.teal.200") },
            h3: { color: theme("colors.teal.300") },
            h4: { color: theme("colors.teal.300") },
            strong: { color: theme("colors.zinc.100") },
            code: {
              color: theme("colors.zinc.100"),
              backgroundColor: theme("colors.zinc.800"),
            },
            blockquote: {
              borderLeftColor: theme("colors.teal.600"),
              color: theme("colors.zinc.300"),
            },
            hr: { borderColor: theme("colors.zinc.700") },
            "ol > li::marker": { color: theme("colors.zinc.500") },
            "ul > li::marker": { color: theme("colors.zinc.500") },
            figcaption: { color: theme("colors.zinc.500") },
          },
        },
      }),
      zIndex: {
        10: "10",
        20: "20",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
