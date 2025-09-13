export default {
  title: "レイアウトとランドマーク",
  intro:
    "セマンティックな HTML 要素や ARIA ランドマークは、ページ構造の理解と効率的な移動に役立ちます。これらはコンテンツ各所の文脈を提供します。",
  sections: {
    semantic: { title: "セマンティックなセクション" },
    landmarks: { title: "ARIA ランドマーク" },
    generic: { title: "汎用コンテナー" },
    sectionElements: { title: "section 要素" },
    iframe: { title: "iFrame 要素" },
    dialog: { title: "ダイアログとモーダル" },
  },
  examples: {
    semantic: {
      html5: {
        title: "セマンティックな HTML5 セクション",
        desc: "✅ HTML5 のセマンティック要素を適切に用い、ページに明確な構造と意味を与えます。",
      },
    },
    landmarks: {
      roles: {
        title: "ARIA のランドマークロール",
        desc: "✅ セマンティック HTML と同様のナビゲーション上の利点を提供します。セマンティック HTML が使えないときに利用します。",
      },
    },
    generic: {
      divs: {
        title: "セマンティックな意味のない div コンテナー",
        desc: "❌ ページの主要セクションを div だけで構成すると、支援技術に意味が伝わりません。",
        note: "これらの div は目的や構造に関する情報を提供しません。",
      },
    },
    section: {
      withHeading: {
        title: "見出しを持つ section",
        desc: "✅ section 要素には見出しを付け、内容の文脈を提供します。",
        note: "この section は内容を表す明確な見出しを持っています。",
      },
      noHeading: {
        title: "見出しのない section",
        desc: "❌ 見出しの無い section。スクリーンリーダーにとって有用なランドマークになりません。",
      },
    },
    iframe: {
      withTitle: {
        title: "title を持つ iFrame",
        desc: "✅ 内容を説明する title を持つ iFrame。フレーム内容の理解に必須です。",
        heading: "サンプルコンテンツの iframe",
      },
      noTitle: {
        title: "title の無い iFrame",
        desc: "❌ title が無く、フレーム内容を支援技術が把握できません。",
      },
      lazy: {
        title: "loading='lazy' の iFrame",
        desc: "パフォーマンス向上のための遅延読み込み。アクセシビリティのため title は依然として必要です。",
        heading: "遅延読み込みされた iframe コンテンツ",
      },
    },
    dialog: {
      element: {
        title: "dialog 要素",
        desc: "HTML5 の dialog 要素の例。showModal() で開くとフォーカスを閉じ込め、背後の操作をブロックします。",
      },
      ariaModal: {
        title: "aria-modal='true' を持つ要素",
        desc: "✅ 適切なフォーカス管理を伴うカスタムモーダル。モーダル内にフォーカスを閉じ込め、閉じると開いたボタンに戻します。",
      },
    },
  },
} as const;
