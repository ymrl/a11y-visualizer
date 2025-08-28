# Target Enlarger

Browser extension to enlarge small interactive targets for improved accessibility. This extension helps users with motor disabilities by overlaying enlarged, semi-transparent buttons over small clickable elements that don't meet WCAG 2.2 Target Size (Minimum) guidelines.

## Features

- Automatically detects small interactive targets (< 24px × 24px)
- Overlays configurable semi-transparent enlargement buttons
- Respects WCAG 2.2 spacing exceptions
- Forwards click events to original elements
- Configurable minimum target size
- Works with buttons, links, form controls, and other interactive elements

## Development

This extension is built using the WXT framework and is part of the a11y-visualizer monorepo.

### Commands

```bash
# Development
pnpm dev:target-enlarger          # Chrome/Chromium development
pnpm dev:target-enlarger:firefox  # Firefox development

# Building
pnpm build:target-enlarger          # Build for Chrome/Chromium
pnpm build:target-enlarger:firefox  # Build for Firefox

# Testing
pnpm --filter @a11y-visualizer/target-enlarger test

# Packaging
pnpm zip:target-enlarger          # Create Chrome/Chromium zip
pnpm zip:target-enlarger:firefox  # Create Firefox zip
```

## Architecture

The extension uses core logic adapted from the Accessibility Visualizer's target-size rule to identify elements that need enlargement, then overlays interactive buttons that forward events to the original elements.
