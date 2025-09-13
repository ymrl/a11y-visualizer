export default {
  title: "ARIA hidden",
  intro:
    "aria-hidden 属性は要素を支援技術に公開するかどうかを制御します。適切に使えば装飾的な内容を隠せますが、誤用すると重要な情報がアクセス不能になります。",
  sections: {
    visible: { title: "可視コンテンツ" },
    hidden: { title: "非表示コンテンツ" },
    icons: { title: "アイコン" },
  },
  examples: {
    visible: {
      false: {
        title: "aria-hidden='false' の可視テキスト",
        desc: "可視かつ支援技術に公開されるテキスト。通常、要素は既定で公開されるため aria-hidden='false' は不要です。",
      },
      true: {
        title: "aria-hidden='true' の可視テキスト",
        desc: "❌ 視覚的には見えるのに支援技術からは隠されるため、スクリーンリーダー利用者には内容が伝わりません。",
      },
    },
    hidden: {
      true: {
        title: "aria-hidden='true' の非表示テキスト",
        desc: "装飾的または冗長な内容を適切に非表示にした例です。視覚的にも支援技術からも隠されます。",
      },
    },
    icons: {
      decorativeTrue: {
        title: "aria-hidden='true' の装飾アイコン",
        desc: "✅ 重要な情報を伝えない装飾アイコンに aria-hidden を使う適切な例。アイコンは隠され、テキストは引き続きアクセス可能です。",
      },
      importantNoHidden: {
        title: "aria-hidden を付けない重要なアイコン",
        desc: "❌ 重要な意味を持つのに代替テキストが無く、非表示でもない例。スクリーンリーダーに誤って伝わる、または意味が伝わらない恐れがあります。",
      },
      accessibleLabeled: {
        title: "適切にラベル付けされたアイコン",
        desc: "✅ aria-label で意味を提供する例。視覚的な意味に加え、プログラム的な意味も提供します。",
      },
    },
  },
} as const;
