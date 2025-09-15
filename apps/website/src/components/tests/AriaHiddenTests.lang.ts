export const en = {
  title: "ARIA Hidden",
  intro:
    "The aria-hidden attribute controls whether elements are exposed to assistive technologies. When properly used, it can hide decorative content, but when misused, it can make important content inaccessible.",
  sections: {
    visible: { title: "Visible Content" },
    hidden: { title: "Hidden Content" },
    icons: { title: "Icons" },
  },
  examples: {
    visible: {
      false: {
        title: 'Visible text with aria-hidden="false"',
        desc: 'Text that is visible and explicitly exposed to assistive technologies. The aria-hidden="false" is usually unnecessary as elements are exposed by default.',
        content:
          "This text is visually visible and can be read by screen readers.",
      },
      true: {
        title: 'Visible text with aria-hidden="true"',
        desc: "❌ Visually visible but inaccessible to assistive technologies. Screen reader users will miss out on the content.",
        content:
          "This text is visually visible but cannot be read by screen readers!",
      },
    },
    hidden: {
      true: {
        title: 'Hidden text with aria-hidden="true"',
        desc: "Properly hidden decorative or redundant content. Both visually hidden and hidden from assistive technologies.",
      },
    },
    icons: {
      decorativeTrue: {
        title: 'Decorative icon with aria-hidden="true"',
        desc: "✅ Proper use of aria-hidden for decorative icons that don't convey essential information. The icon is hidden while the text remains accessible.",
      },
      importantNoHidden: {
        title: "Important icon without aria-hidden",
        desc: "❌ The information conveyed by the icon is not made available to assistive technologies.",
        content: "There are unfilled fields",
      },
      accessibleLabeled: {
        title: "Accessible icon with proper labeling",
        desc: "✅ Example of providing meaning with aria-label. Visually an icon, but conveys information to assistive technologies via the aria-label.",
        icon: "Error",
        content: "There are unfilled fields",
      },
    },
  },
} as const;

export const ja = {
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
        title: 'aria-hidden="false" の可視テキスト',
        desc: "可視かつ支援技術に公開されるテキスト。要素は公開されているのがデフォルトで、 aria-hidden 属性を指定する必要はありません。",
        content:
          "このテキストは視覚的に見えていて、スクリーンリーダーでも読むことができます。",
      },
      true: {
        title: 'aria-hidden="true" の可視テキスト',
        desc: "❌ 視覚的には見えるのに支援技術からはアクセスできません。スクリーンリーダー利用者には内容が伝わりません。",
        content:
          "このテキストは視覚的に見えていますが、スクリーンリーダーでは読むことができません！",
      },
    },
    hidden: {
      true: {
        title: 'aria-hidden="true" の非表示テキスト',
        desc: "装飾的または冗長な内容を適切に非表示にした例です。視覚的にも支援技術からも隠されます。",
      },
    },
    icons: {
      decorativeTrue: {
        title: 'aria-hidden="true" の装飾アイコン',
        desc: "✅ 重要な情報を伝えない装飾アイコンに aria-hidden を使う適切な例。アイコンは隠され、テキストは引き続きアクセス可能です。",
      },
      importantNoHidden: {
        title: "aria-hidden を付けない重要なアイコン",
        desc: "❌ アイコンで表現された情報が、支援技術向けに伝わる状態になっていません。",
        content: "未記入の項目があります",
      },
      accessibleLabeled: {
        title: "適切にラベル付けされたアイコン",
        desc: "✅ aria-label で意味を提供する例。視覚的にはアイコンで、支援技術へは aria-label で情報を伝えます。",
        icon: "エラー",
        content: "未記入の項目があります",
      },
    },
  },
} as const;
