# Contributing to Accessibility Visualizer

Accessibility Visualizerに興味を持っていただき、ありがとうございます。以下は、貢献を始めるための基本的なガイドラインです。

Thank you for your interest in Accessibility Visualizer. Here are some basic guidelines to help you get started contributing.

## Before You Begin 始める前に

- セットアップ方法やビルド方法は、[README](./README.md)を参照してください。
  Please refer to the [README](./README.md) for setup and build instructions.
- IssueやPull Requestは主に日本語で書かれていますが、英語での貢献も大歓迎です。
  Issues and pull requests are primarily written in Japanese, but contributions in English are also very welcome.
- 特に、ユーザーインタフェースやドキュメントの多言語化に関する貢献を歓迎します。現在サポートされていない言語への翻訳も大歓迎です。
  In particular, contributions to the multilingualization of the user interface and documentation are welcome. Translations into languages not currently supported are also very welcome.

## License ライセンス

貢献していただくことで、あなたの貢献は[MITライセンス](./LICENSE.txt)の下で提供されることに同意したものとみなされます。

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE.txt).

## Reporting Bugs バグの報告

以下の内容を含めて、[Issue](https://github.com/ymrl/a11y-visualizer/issues)を作成してください。
Please create an [Issue](https://github.com/ymrl/a11y-visualizer/issues) with the following:

- Clear title: はっきりとしたタイトル
- Steps to reproduce: 再現手順
- Expected and actual behavior: 期待される動作と実際の動作
- Environment details: 環境の詳細

特に、特定のWebページでの問題を報告する場合には、そのページを確認できるURLか、再現できるソースコードを提供してください。
Especially when reporting issues on specific web pages, please provide the URL of the page or the source code that can reproduce the issue.

## Proposing New Features 新機能の提案

新しい機能についても、[Issue](https://github.com/ymrl/a11y-visualizer/issues)を作成してください。
ただし、実装の優先順位は、作者の判断により行います。提案いただいても実現できるかどうか保証できないことをご了承ください。

Please create an [Issue](https://github.com/ymrl/a11y-visualizer/issues) for proposing new features.
However, the priority of implementation is at the discretion of the author. Please note that we cannot guarantee that your proposal will be implemented.

Issueには、以下の内容を提供してください。
Please provide the following information in the issue:

- Detailed description: 詳細な説明
- Use cases and examples: ユースケースと例

## Multilingalization 多言語化 (Help Wanted!!)

We would greatly appreciate it if you could help us multilingualize the user interface and documentation of Accessibility Visualizer.
The author is a native Japanese speaker and not a native English speaker, and has little knowledge of other languages.
We welcome any contributions, such as correcting translation errors, adding new languages, and improving existing languages.

Multilingualization of the user interface is done by editing the JSON files in the [src/i18n](./src/i18n) directory. To add a new language, create a new JSON file based on the Japanese (`ja.json`) or English (`en.json`) file, and submit a Pull Request.

Accessibility Visualizerのユーザーインタフェースやドキュメントの多言語化をしていただけると、大変助かります。
作者は日本語のネイティブスピーカーであり、英語はネイティブではなく、他の言語についてはほとんど知識がありません。
翻訳の間違いの修正、新しい言語の追加、既存の言語の改善など、どのような貢献でも歓迎します。

ユーザーインタフェースの多言語化は、[src/i18n](./src/i18n)ディレクトリにあるJSONファイルを編集することで行います。新しい言語を追加するには、日本語 (`ja.json`) または英語 (`en.json`) のファイルを元に、新しい言語のJSONファイルを作成し、Pull Requestを送信してください。

## Pull Request

Issueを立てるだけでなく、実際のコードを提供していただける場合は、Pull Requestを送信してください。
Pull Requestが作成されると、自動的に `lint` `test` が実行されます。これらのチェックを通過するようにしてください。

If you can provide actual code in addition to creating an issue, please submit a Pull Request.
When a Pull Request is created, `lint` and `test` will be run automatically. Please make sure that these checks pass.
