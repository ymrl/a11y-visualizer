# Website of Accessibility Visualizer

Accessibility Visualizer のウェブサイト用のディレクトリです。

## ウェブサイトに求められていること

- `pnpm` を使用し、a11y-visualizer 内のworkspaceである
- コンテンツとして、以下のものが含まれている
  - Accessibility Visualizer の簡単な紹介文
  - スクリーンショット
  - ChromeウェブストアとFirefox Add-onsへのリンク
  - GitHub上のユーザーガイドへのリンク
  - GitHubリポジトリへのリンク
- スタイルはTailwind CSSを使用する
  - Accessibility Visualizerと同じく、 `teal` カラーと `zinc` カラーを中心に使用する
- WCAG レベルAA相当のアクセシビリティ
- 多言語に対応する
- 開発時に使用するポートは、`4000` とする（Accessibility Visualizerが `3000` ポートを使用するため）
- ベースURLは、`/a11y-visualizer/` とする（GitHub Pagesでのホスティングを考慮）

### 多言語化

- 日本語、英語、韓国語でサイトを提供する
- 何らかの、多言語のコンテンツをシンプルに管理できる仕組みを用意する
  - 翻訳用のファイルを用意するなどの方法が望ましい
- はじめてアクセスしたときに表示される言語は、ブラウザの設定に応じて自動的に切り替わる
- `/ja` や `?lang=ja` のように、URLで言語を切り替えることもできることが望ましい

### ビルド

- SSG (Static Site Generation) を使用して、ウェブサイトをビルドする
- ビルドは、GitHub Actionsで行う
- ビルドされたものは、GitHub Pagesにデプロイされる

### 表記

- Accessibility Visualizer は、すべての言語で `Accessibility Visualizer` と表記すること
