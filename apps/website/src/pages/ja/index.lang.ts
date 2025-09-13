const dict = {
  subtitle: "かんたん、「見える」Webアクセシビリティ",
  hero: {
    title: "Webアクセシビリティを、見る",
    description:
      "スクリーンリーダーなどの支援技術のユーザーが知覚している情報を、ChromeやFirefoxで簡単に確認できる拡張機能です。",
    screenshotSrc: "/a11y-visualizer/images/screenshot_ja.png",
  },
  features: {
    title: "機能",
    items: {
      visual: {
        title: "情報の可視化",
        description:
          "画像の代替テキスト、見出しレベル、フォームラベルなど、ブラウザ単体では確認しづらい情報を可視化",
      },
      detection: {
        title: "問題の検出",
        description: "問題のあるマークアップや注意するべきテクニックをハイライト",
      },
      liveRegions: {
        title: "ライブリージョン",
        description: "スクリーンリーダーなどの支援技術に動的に伝わる情報を視覚的に表示",
      },
      customizable: {
        title: "カスタマイズ可能",
        description: "対象のWebサイトにあわせて、要素の種類や表示方法をカスタマイズ",
      },
    },
  },
  download: {
    title: "ダウンロード",
    chromeStore: "Chrome ウェブストア",
    firefoxAddons: "Firefox アドオン",
  },
  guide: {
    title: "ユーザーガイド",
    description: "Accessibility Visualizerの使用方法を学ぶ",
    link: "ユーザーガイドを見る",
    url: "/a11y-visualizer/docs/ja/UsersGuide",
  },
  tests: {
    title: "テスト用ページ",
    description:
      "Accessibility Visualizerの動作を確認するために、様々な実装例を用意しています",
    link: "テスト用ページへ",
    url: "/a11y-visualizer/tests",
  },
} as const;

export default dict;

