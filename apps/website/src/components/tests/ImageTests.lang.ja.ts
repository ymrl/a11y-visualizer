export default {
  title: "画像",
  intro:
    "画像は支援技術ユーザーにもアクセス可能である必要があります。以下では、適切な実装例とよくある間違いの双方を含む、画像アクセシビリティのさまざまな手法を示します。",
  sections: {
    imgElement: {
      title: "<img> 要素",
      desc: "img 要素は、アクセシブルにするために適切な代替テキスト（alt）が必要です。",
    },
    svgElement: {
      title: "<svg> 要素",
      desc: "SVG は title 要素、aria-label、role 属性などの手法でアクセシブルにできます。",
    },
    roleImg: {
      title: 'role="img"',
      desc: 'role="img" を持つ要素には、通常 aria-label などでアクセシブルネームを付与します。',
    },
  },
  examples: {
    img: {
      withAlt: {
        title: "alt テキスト付きの画像",
        desc: "説明的な代替テキストを持つ適切な実装例です。これは画像をアクセシブルにする正しい方法です。",
      },
      withAltAndTitle: {
        title: "alt と title を併用した画像",
        desc: "alt と title の両方を指定した例です。title はツールチップ表示されますが、アクセシビリティ改善にはあまり寄与しません。",
      },
      missingAlt: {
        title: "alt 属性のない画像",
        desc: "❌ alt が無いのは問題です。スクリーンリーダーはファイル名や単に「画像」と読み上げ、意味のある内容が伝わりません。",
      },
      titleOnly: {
        title: "title のみで alt が無い画像",
        desc: "❌ title 属性だけでは不十分です。スクリーンリーダーは主に alt を使用し、title は利用されません。",
      },
      decorativeEmptyAlt: {
        title: "装飾目的で空の alt を持つ画像",
        desc: "✅ 装飾画像には空の alt を指定します。重要な情報を伝えない画像であることをスクリーンリーダーに伝えます。",
      },
      decorativeEmptyAltWithTitle: {
        title: "空の alt と title を併用した装飾画像",
        desc: "空の alt で装飾画像として適切にマークしていますが、title は不要です。title はマウスユーザーにツールチップを表示し得ます。",
      },
      ariaHidden: {
        title: "aria-hidden を用いた画像",
        desc: "aria-hidden で支援技術から非表示にする方法です。装飾画像には空の alt の方が一般的です。",
      },
    },
    svg: {
      withTitle: {
        title: "title 要素を持つ SVG",
        desc: "✅ title 要素によりスクリーンリーダーへアクセシブルネームを提供できます。標準的な手法です。",
      },
      noTitle: {
        title: "title 要素のない SVG",
        desc: "❌ title 等の属性が無い SVG。何を表す図形かを支援技術が理解できない可能性があります。",
      },
      ariaHidden: {
        title: "aria-hidden を持つ SVG",
        desc: "支援技術から隠す装飾的な図形に使用します。重要な情報を伝えない場合に適します。",
      },
      withAriaLabel: {
        title: "aria-label を持つ SVG",
        desc: "✅ aria-label により title 要素を用いずにアクセシブルネームを提供できます。",
      },
      withImgRole: {
        title: "role=img と aria-label を持つ SVG",
        desc: "✅ 明示的に画像として扱い、aria-label で名前を提供します。図形が画像であることが明確になります。",
      },
      withPresentationRole: {
        title: "role=presentation を持つ SVG",
        desc: "装飾として扱い、意味付けを取り除きます。",
      },
      insideLink: {
        title: "リンク内の SVG",
        desc: "リンクテキストが文脈を提供するため、SVG 自体に追加のラベル付けが不要な場合があります。",
      },
    },
    roleImg: {
      withAriaLabel: {
        title: 'role="img" と aria-label',
        desc: "✅ role='img' と説明的な aria-label の適切な使用例です。文字ベースのグラフィックや絵文字などに有用です。",
      },
      withoutAriaLabel: {
        title: 'role="img" かつ aria-label なし',
        desc: "❌ aria-label が無いとアクセシブルネームがありません。テキスト内容がそのまま読み上げられ、混乱を招く恐れがあります。",
      },
    },
  },
} as const;
