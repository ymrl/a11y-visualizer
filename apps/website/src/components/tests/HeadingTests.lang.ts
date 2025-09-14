export const en = {
  title: "Headings",
  intro:
    "Headings provide a hierarchical structure to web content, helping users understand page organization and navigate efficiently. Assistive Technologiess use headings as navigation landmarks, so proper heading structure helps users to reach their objective content.",
  sections: {
    hierarchy: { title: "Heading Hierarchy" },
    problematic: { title: "Problematic Headings" },
  },
  examples: {
    hierarchy: {
      demo: {
        title: "Heading hierarchy demonstration",
        desc: "This example shows the standard HTML heading hierarchy from h1 to h6, plus a custom heading using ARIA attributes. Notice how heading levels should follow a logical order.",
      },
      best: {
        title: "Best practices:",
        item1: "Start with h1 for main page title",
        item2: "Don't skip heading levels (h1 → h3 without h2)",
        item3: "Use headings to create a logical content outline first",
      },
    },
    problematic: {
      skipped: {
        title: "Problematic heading: Skipped level",
        desc: "❌ This example shows incorrect heading hierarchy where h4 appears without h2 or h3. This breaks the logical document structure.",
        note: "This h4 should be h2 to maintain proper hierarchy.",
      },
      empty: {
        title: "Empty heading",
        desc: "❌ Heading element with no text content. Assistive technology users cannot predict the content about the part with this heading.",
        note: "This h6 element contains no text and provides no value to users.",
      },
    },
  },
} as const;

export const ja = {
  title: "見出し",
  intro:
    "見出しはコンテンツに階層構造を与え、ページの構成を理解しやすくします。支援技術は見出しをナビゲーションの目印として用いるため、見出し構造が適切であれば、ユーザーはいち早く目的の内容に到達できます。",
  sections: {
    hierarchy: { title: "見出しの階層" },
    problematic: { title: "問題のある見出し" },
  },
  examples: {
    hierarchy: {
      demo: {
        title: "見出し階層のデモ",
        desc: "h1 から h6 までの標準的な見出し階層と、ARIA を用いたカスタム見出しの例です。見出しレベルは論理的な順序に従う必要があります。",
      },
      best: {
        title: "ベストプラクティス:",
        item1: "ページの主題には h1 を使用する",
        item2: "見出しレベルを飛ばさない（h1 の次に h3 としない）",
        item3: "先に見出しで論理的なアウトラインを作る",
      },
    },
    problematic: {
      skipped: {
        title: "問題例: レベル飛び",
        desc: "❌ h2 や h3 を用いず h4 が現れるなど、誤った見出し階層の例です。論理的な文書構造が崩れます。",
        note: "この h4 は階層を保つため h2 にするべきです。",
      },
      empty: {
        title: "空の見出し",
        desc: "❌ テキストのない見出し要素です。支援技術のユーザーは、この見出しのついた部分に何があるのか予想できません。",
        note: "この h6 要素にはテキストがなく、利用者に価値を提供しません。",
      },
    },
  },
} as const;
