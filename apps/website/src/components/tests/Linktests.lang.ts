export const en = {
  title: "Links",
  intro:
    "Links are essential navigation elements that allow users to move between pages or sections. They must be properly implemented to ensure keyboard accessibility and clear communication to assistive technology users.",
  sections: {
    aElement: { title: "<a> Element" },
    linkRole: { title: "Link Role" },
    variations: { title: "Link Variations" },
    iconLinks: { title: "Icon Links" },
  },
  examples: {
    a: {
      standard: {
        title: "Standard link with href",
        desc: "✅ Properly implemented link with href attribute. This is keyboard accessible and clearly identified by screen readers as a navigation element.",
      },
      noHref: {
        title: "Anchor without href attribute",
        desc: "❌ Anchor element without href attribute. It does not function as a link. Even if JavaScript is used to implement link behavior, it lacks keyboard accessibility and proper communication to assistive technologies.",
        underConstruction: "under construction",
        note: "Sometimes an anchor without href is used to indicate a place that will become a link later. Assistive technologies will treat it as plain text.",
      },
    },
    role: {
      withRole: {
        title: 'Element with role="link"',
        desc: '⚠️ Link-like element using role="link", tabindex="0", and JavaScript to mimic link behavior. This is insufficient as a link implementation, as it lacks features, for example \'Open in new tab\' option in context menu (right-click) or other ways.',
      },
    },
    variations: {
      targetBlank: {
        title: "Link with target='_blank'",
        desc: "⚠️ Link that opens in a new window/tab. This can increase user burden by forcing new windows/tabs to open. Consider whether this is truly necessary.",
      },
    },
    icons: {
      onlyIcon: {
        title: "Link with only an icon",
        desc: "❌ Link containing only an icon without text or accessible name. Screen readers may read parts of the URL, leaving users unable to understand the link's purpose or destination.",
      },
      withAriaLabel: {
        title: "Link with icon and aria-label",
        desc: "✅ Icon link with proper role='img' and aria-label on the SVG element. This provides accessible naming for the icon while maintaining proper semantic structure.",
      },
      withText: {
        title: "Link with icon and text",
        desc: "✅ Link with an icon accompanied by text that conveys the same meaning. The icon is marked as decorative with aria-hidden='true'.",
      },
    },
  },
} as const;

export const ja = {
  title: "リンク",
  intro:
    "リンクはページやセクション間を移動するための基本的なナビゲーション要素です。キーボード操作に対応し、支援技術に適切に伝わるよう実装する必要があります。",
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
        desc: "✅ href 属性を備えた適切なリンク。キーボードアクセスが可能で、支援技術にもナビゲーション要素として明確に伝わります。",
      },
      noHref: {
        title: "href のない a 要素",
        desc: "❌ href のない a 要素は機能的なリンクではありません。JavaScript でリンク動作を実装していても、キーボードアクセスや支援技術への適切な伝達が行われません。",
        underConstruction: "準備中",
        note: "あとでリンクになる場所を、 href なしの a 要素で示すことがあります。支援技術はただのテキストとして認識します。",
      },
    },
    role: {
      withRole: {
        title: 'role="link" を持つ要素',
        desc: '⚠️ role="link" と tabindex="0" と JavaScript でリンクの機能を再現しようとしたもの。コンテキストメニュー（右クリックメニュー）などから「新しいタブで開く」操作ができないなど、リンクの実装としては不十分です。',
      },
    },
    variations: {
      targetBlank: {
        title: "target='_blank' のリンク",
        desc: "⚠️ 新しいウィンドウ/タブで開くリンク。強制的に新しいウィンドウ/タブが開くため、ユーザーの負担が増えることがあります。本当に必要なのかを検討してください。",
      },
    },
    icons: {
      onlyIcon: {
        title: "アクセシブルネームを持たないアイコンによるリンク",
        desc: "❌ アクセシブルネームの無いアイコンだけのリンク。この状態ではスクリーンリーダーはURLの一部を読み上げたりすることがあり、ユーザーはリンク先や目的を理解できません。",
      },
      withAriaLabel: {
        title: "アクセシブルネームを持つアイコンによるリンク",
        desc: "✅ SVG に role='img' と aria-label を付与し、アイコンの名称を提供する例。セマンティクスを保ちながらアクセシブルにできます。",
      },
      withText: {
        title: "テキストを伴うアイコンによるリンク",
        desc: "✅ アイコンと同じ意味をもつテキストによるニンク。アイコンの意味は装飾的であるため、aria-hidden='true' を付与しています。",
      },
    },
  },
} as const;
