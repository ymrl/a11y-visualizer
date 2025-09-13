export default {
  title: "テーブル",
  intro:
    "テーブルは行と列でデータを整理します。支援技術がデータの関係を理解できるよう、適切な構造が必要です。見出し（th）やセマンティックなマークアップはアクセシビリティに不可欠です。",
  sections: {
    structure: { title: "テーブルの構造" },
    headers: { title: "ヘッダー" },
    misuse: { title: "誤用" },
  },
  examples: {
    structure: {
      properHeaders: {
        title: "適切なヘッダーを持つテーブル",
        desc: "✅ th 要素と scope 属性を用いた適切な構造。スクリーンリーダーが列・行の関係を認識できます。",
      },
      noHeaders: {
        title: "ヘッダーのないテーブル",
        desc: "❌ th を用いず td だけで構成されたテーブル。支援技術がデータの関係を把握できません。",
      },
    },
    headers: {
      rowHeaders: {
        title: "行見出しのあるテーブル",
        desc: "✅ 列見出しに加えて行見出しも備え、複雑なデータ関係を scope 属性で表現しています。",
      },
      withCaption: {
        title: "caption のあるテーブル",
        desc: "✅ caption 要素によりテーブルの目的や内容の文脈を提供します。利用者が理解しやすくなります。",
      },
    },
    misuse: {
      layoutTable: {
        title: "レイアウト目的のテーブル（問題）",
        desc: "❌ 表形式データではなくレイアウトにテーブルを使用しています。レイアウトにはモダンな CSS を利用しましょう。",
      },
    },
  },
} as const;
