export const en = {
  title: "Tables",
  intro:
    "Tables organize data in rows and columns and must be properly structured for screen readers to understand relationships between data. ",
  sections: {
    structure: { title: "Table Structure" },
    headers: { title: "Table Headers" },
    complex: { title: "Complex Headers" },
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
    complex: {
      rowGroupHeaders: {
        title: 'Row group headers (scope="rowgroup")',
        desc: '✅ scope="rowgroup" headers (Cats, English speakers) apply to every cell in their row group except cells in the columns to their left. Note that the row headers (Legs, Tails) are placed in the second column, not the leftmost one.',
      },
      colGroupHeaders: {
        title: 'Column group headers (scope="colgroup")',
        desc: '✅ A scope="colgroup" header (Sales) applies to every cell in its column group, grouping multiple columns under a shared heading.',
      },
      rowHeaderNotFirst: {
        title: "Row header not in the first column",
        desc: '✅ The row header (Country) is in the second column with a data column (Rank) to its left. scope="row" headers apply only to cells on their right, so the Rank column is not associated with them.',
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
    complex: { title: "複雑なヘッダー" },
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
    complex: {
      rowGroupHeaders: {
        title: '行グループの見出し（scope="rowgroup"）',
        desc: '✅ scope="rowgroup" の見出し（Cats、English speakers）は、その行グループ内で自分より左の列を除くすべてのセルに適用されます。行見出し（Legs、Tails）が左端ではなく2列目に置かれている点にも注目してください。',
      },
      colGroupHeaders: {
        title: '列グループの見出し（scope="colgroup"）',
        desc: '✅ scope="colgroup" の見出し（Sales）は、その列グループ内のすべてのセルに適用され、複数の列を共通の見出しでまとめます。',
      },
      rowHeaderNotFirst: {
        title: "左端の列にない行見出し",
        desc: '✅ 行見出し（Country）が2列目にあり、その左にデータ列（Rank）があります。scope="row" の見出しは右側のセルにのみ適用されるため、Rank 列とは関連付けられません。',
      },
    },
  },
} as const;
