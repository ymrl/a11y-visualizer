export const en = {
  title: "Tables",
  intro:
    "Tables organize data in rows and columns and must be properly structured for screen readers to understand relationships between data. ",
  sections: {
    structure: { title: "Table Structure" },
    headers: { title: "Table Headers" },
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
  },
} as const;

export const ja = {
  title: "テーブル",
  intro:
    "テーブルは行と列でデータを整理します。支援技術がデータの関係を理解できるよう、適切な構造が必要です。",
  sections: {
    structure: { title: "テーブルの構造" },
    headers: { title: "ヘッダー" },
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
  },
} as const;
