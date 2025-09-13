export default {
  title: "リンク",
  intro:
    "リンクはページやセクション間を移動するための基本的なナビゲーション要素です。キーボード操作に対応し、スクリーンリーダーに適切に伝わるよう実装する必要があります。",
  sections: {
    aElement: { title: "<a> 要素" },
    linkRole: { title: "Link ロール" },
    variations: { title: "リンクのバリエーション" },
    iconLinks: { title: "アイコンリンク" },
  },
  examples: {
    a: {
      standard: {
        title: "href を持つ標準的なリンク",
        desc: "✅ href 属性を備えた適切なリンク。キーボードアクセスが可能で、スクリーンリーダーにもナビゲーション要素として明確に伝わります。",
      },
      noHref: {
        title: "href のない a 要素",
        desc: "❌ href のない a 要素は機能的なリンクではありません。キーボードアクセスや正しいアナウンスが行われません。",
      },
    },
    role: {
      withRole: {
        title: 'role="link" を持つ要素',
        desc: "✅ role='link' と適切な tabindex を用いたカスタムリンク。機能しますが、互換性の観点からはセマンティックな a 要素が望ましいです。",
      },
      noTabindex: {
        title: 'tabindex の無い role="link"',
        desc: "❌ tabindex='0' がなく、キーボードでフォーカスできません。",
      },
    },
    variations: {
      targetBlank: {
        title: "target='_blank' のリンク",
        desc: "新しいウィンドウ/タブで開くリンク。セキュリティのため rel='noopener noreferrer' を付与し、ユーザーに新しいウィンドウで開く旨を伝えることを検討してください。",
      },
    },
    icons: {
      onlyIcon: {
        title: "アイコンのみのリンク",
        desc: "❌ テキストやアクセシブルネームの無いアイコンだけのリンク。リンク先や目的がスクリーンリーダーに伝わりません。",
      },
      withAriaLabel: {
        title: "アイコンと aria-label を持つリンク",
        desc: "✅ SVG に role='img' と aria-label を付与し、アイコンの名称を提供する例。セマンティクスを保ちながらアクセシブルにできます。",
      },
      emptyText: {
        title: "可視テキストの無いリンク",
        desc: "❌ 可視・アクセシブルなテキストが無く、何をするリンクか・どこへ行くのかが分かりません。",
      },
    },
  },
} as const;
