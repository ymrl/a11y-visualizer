export const en = {
  title: "Layout & Landmarks",
  intro:
    "Semantic HTML elements and ARIA landmarks help users understand page structure and navigate efficiently. These elements provide important context about different sections of content.",
  sections: {
    semantic: { title: "Semantic Sections" },
    landmarks: { title: "ARIA Landmarks" },
    generic: { title: "Generic Containers" },
    sectionElements: { title: "Section Elements" },
    iframe: { title: "iFrame Elements" },
    dialog: { title: "Dialog and Modal" },
  },
  examples: {
    semantic: {
      html5: {
        title: "HTML landmark elements",
        desc: "✅ Proper use of landmark elements that provide clear structure and meaning to page content.",
      },
    },
    landmarks: {
      roles: {
        title: "ARIA landmark roles",
        desc: "✅ ARIA landmark roles that provide the same navigation benefits as semantic HTML elements. Use when semantic HTML isn't available.",
      },
    },
    generic: {
      divs: {
        title: "Generic div containers without semantic meaning",
        desc: "❌ Using generic div elements for major page sections provides no semantic information to assistive technologies.",
        note: "These divs provide no information about content purpose or page structure.",
      },
    },
    section: {
      withHeading: {
        title: "Section with accessible name",
        desc: "Section element with an accessible name becomes a region role and functions as a landmark.",
        note: "This section references the heading's id attribute value in the section element's aria-labelledby attribute.",
      },
      noHeading: {
        title: "Section without accessible name",
        desc: "Section element without an accessible name does not function as a landmark.",
        note: "This section merely places a heading without associating it.",
      },
    },
    iframe: {
      withTitle: {
        title: "iFrame with title attribute",
        desc: "✅ iFrame with proper title attribute that describes the content. Essential for assistive technologies to understand what the frame contains.",
        heading: "Sample content iframe",
      },
      noTitle: {
        title: "iFrame without title attribute",
        desc: "❌ iFrame missing title attribute. Accessible technologies cannot determine what content the frame contains, making it inaccessible.",
      },
    },
    dialog: {
      element: {
        title: "Dialog element",
        desc: "Example of HTML dialog element. When opened with showModal(), it becomes a modal that traps focus and blocks interaction with background content.",
      },
      ariaModal: {
        title: "Element with aria-modal='true'",
        desc: "✅ Custom modal implementation with proper focus management - traps focus inside the modal and returns focus to the opening button when closed.",
      },
    },
  },
} as const;

export const ja = {
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
        title: "ランドマーク要素",
        desc: "✅ ランドマーク要素を適切に用い、ページに明確な構造と意味を与えます。",
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
        title: "アクセシブルネームをつけた section",
        desc: "section 要素にアクセシブルネームをつけると region ロールとなり、ランドマークとして機能します",
        note: "この section は見出しの id 属性値を section 要素の aria-labelledby 属性で参照しています。",
      },
      noHeading: {
        title: "アクセシブルネームのない section",
        desc: "アクセシブルネームの提供されていない section 要素はランドマークとして機能しません。",
        note: "この section は見出しをただ置いただけの状態です。",
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
    },
    dialog: {
      element: {
        title: "dialog 要素",
        desc: "HTML の dialog 要素の例。showModal() で開くとフォーカスを閉じ込め、背後の操作をブロックします。",
      },
      ariaModal: {
        title: "aria-modal='true' を持つ要素",
        desc: "✅ 適切なフォーカス管理を伴うカスタムモーダル。モーダル内にフォーカスを閉じ込め、閉じると開いたボタンに戻します。",
      },
    },
  },
} as const;
