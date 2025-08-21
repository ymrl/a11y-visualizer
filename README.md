# Accessibility Visualizer Browser Extension

![Screenshot of 駒瑠市. Showing annotations of accessibility properties](./a11y-visualizer-komarushi.jpg)
(This screenshot from [駒瑠市〜アクセシビリティ上の問題の体験サイト〜](https://a11yc.com/city-komaru/))

## Install

- [Chrome Web Store](https://chromewebstore.google.com/detail/accessibility-visualizer/idcacekakoknnpbfjcdhnkffgfbddnhk)
- [Firefox Add-ons](https://addons.mozilla.org/ja/firefox/addon/accessibility-visualizer/)

## Users' Guide

- [Accessibility Visualizer ユーザーズガイド (Japanese)](./docs/ja/UsersGuide.md)
- [Accessibility Visualizer User's Guide (English)](./docs/en/UsersGuide.md)
- [Accessibility Visualizer 사용자 가이드 (Korean)](./docs/ko/UsersGuide.md)

## How to develop

It is built with [WXT](https://wxt.dev/).

To develop extension, launch the dev server

```
# Install dependencies
$ pnpm install

# To develop for Chrome/Chromium browsers
$ pnpm --filter=@a11y-visualizer/browser-extension dev

# To develop for Firefox
$ pnpm --filter=@a11y-visualizer/browser-extension dev:firefox
```

WXT will automatically open your browser and load the extension in development mode.

You can test the extension using the test pages available on the website at `/tests`. The website serves as both promotional content and comprehensive test cases for accessibility features.

## How to build

```
# Install dependencies
$ pnpm install

# Build browser extension for Chrome/Chromium
$ pnpm --filter=@a11y-visualizer/browser-extension build

# Build browser extension for Firefox
$ pnpm --filter=@a11y-visualizer/browser-extension build:firefox

# Create zip files for store distribution
$ pnpm --filter=@a11y-visualizer/browser-extension zip
$ pnpm --filter=@a11y-visualizer/browser-extension zip:firefox
```

The built extensions will be in `apps/browser_extension/dist/` directory, and zip files will be created in the same location.
