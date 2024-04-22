# Accessibility Visualizer Browser Extension

![Screenshot of 駒瑠市. Showing annotations of accessibility properties](./a11y-visualizer-komarushi.jpg)
(This screenshot from [駒瑠市〜アクセシビリティ上の問題の体験サイト〜](https://a11yc.com/city-komaru/))

## Users' Guide

- [Accessibility Visualizer ユーザーズガイド (Japanese)](./docs/ja/UsersGuide.md)
- [Accessibility Visualizer User's Guide (English)](./docs/en/UsersGuide.md)

## How to develop

It is built with [CRXJS Vite Plugin](https://crxjs.dev/vite-plugin/).

To develop extension, lauch the dev server

```
# Install dependencies
$ npm install

# To testing, load the ./dist directory on your browser
# Currently it doesn't work in Firefox
$ npm run dev

```

And in your browser, turn on Developer mode, and load the `dist` directory with "Load unpacked" button.

## How to build

```
# Install dependencies
$ npm install

# Build browser extensions to ./dist (for Chrome) and ./dist-firefox directory
# To testing, load the directories on your browser
$ npm run build

# Build zip files to upload to the stores
$ npm run package
```
