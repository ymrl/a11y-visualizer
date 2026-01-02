# Shadow DOM テストページ

このディレクトリには、Accessibility VisualizerのShadow DOM対応をテストするための静的HTMLページが含まれています。

## 概要

このテストページには以下のWeb Componentsが実装されています：

1. **ユーザープロフィールカード** - アバター、名前、役割などの情報を表示
2. **ログインフォーム** - ユーザー名とパスワードの入力フォーム
3. **タスクリスト** - チェックボックス付きのタスク一覧
4. **データテーブル** - ユーザー情報を表示するテーブル
5. **ネストしたShadow DOM** - Shadow DOM内にさらにShadow DOMを持つコンポーネント

## 使い方

### ローカルサーバーで開く

```bash
# プロジェクトルートから
npx serve apps/shadow_dom_test
```

または、任意のローカルサーバーで開いてください：

```bash
# Python 3の場合
cd apps/shadow_dom_test
python3 -m http.server 8000

# Node.jsのhttp-serverの場合
npx http-server apps/shadow_dom_test
```

### ブラウザで直接開く

単純な静的HTMLファイルなので、ブラウザで直接 `index.html` を開くこともできます。

## Accessibility Visualizerでのテスト方法

1. 上記の方法でテストページを開く
2. ブラウザにAccessibility Visualizer拡張機能をインストール
3. 拡張機能を有効化
4. Shadow DOM内の要素（フォームの入力欄、ボタン、見出しなど）にアノテーションが表示されることを確認

## テストポイント

- Shadow DOM内の見出し（h3, h4）が正しく検出されるか
- Shadow DOM内のフォーム要素（input, button）にアクセシビリティの問題が検出されるか
- Shadow DOM内のテーブルの構造が正しく解析されるか
- ネストしたShadow DOM（Shadow DOM内のShadow DOM）も正しく処理されるか
- aria属性やrole属性がShadow DOM内でも正しく評価されるか

## アクセシビリティの特徴

このテストページのWeb Componentsは、以下のアクセシビリティのベストプラクティスを実装しています：

- セマンティックなHTML要素の使用
- 適切なARIA属性（`aria-label`, `aria-labelledby`, `aria-required`など）
- フォーカス可能な要素への適切なスタイリング
- キーボード操作のサポート
- スクリーンリーダー向けのライブリージョン

ただし、**意図的にアクセシビリティの問題も含めている場合があります**（例：ラベルのない入力欄、不適切なARIA属性など）。これらはAccessibility Visualizerが正しく検出できるかをテストするためのものです。
