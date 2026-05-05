export const en = {
  title: "Shadow DOM",
  intro:
    "Shadow DOM is used by Web Components to encapsulate styles and markup. Accessibility Visualizer can detect and analyze elements inside Shadow DOM trees, including nested Shadow DOM.",
  sections: {
    form: { title: "Form in Shadow DOM" },
    image: { title: "Image in Shadow DOM" },
    nested: { title: "Nested Shadow DOM" },
    liveRegion: { title: "Live Region in Shadow DOM" },
  },
  examples: {
    form: {
      accessible: {
        title: "Accessible form in Shadow DOM",
        desc: "✅ A form with proper labels inside a Shadow DOM. Each input has an associated label element.",
      },
      noLabels: {
        title: "Form without labels in Shadow DOM",
        desc: "❌ Inputs inside Shadow DOM without associated labels. Screen readers cannot identify the purpose of these fields.",
      },
    },
    image: {
      noAlt: {
        title: "Image without alt text in Shadow DOM",
        desc: "❌ An image inside Shadow DOM without an alt attribute. Assistive technologies cannot convey the image's purpose.",
      },
      withAlt: {
        title: "Image with alt text in Shadow DOM",
        desc: "✅ An image inside Shadow DOM with a descriptive alt attribute.",
      },
    },
    nested: {
      accessible: {
        title: "Nested Shadow DOM with accessible elements",
        desc: "✅ An outer Web Component containing an inner Web Component, both with proper accessibility attributes.",
      },
    },
    liveRegion: {
      polite: {
        title: "Live region inside Shadow DOM",
        desc: "Live regions inside Shadow DOM should also notify assistive technologies of content updates.",
      },
    },
  },
} as const;

export const ja = {
  title: "Shadow DOM",
  intro:
    "Shadow DOMはWeb Componentsでスタイルやマークアップをカプセル化するために使われます。Accessibility VisualizerはShadow DOMツリー内の要素を検出・分析でき、ネストしたShadow DOMにも対応しています。",
  sections: {
    form: { title: "Shadow DOM内のフォーム" },
    image: { title: "Shadow DOM内の画像" },
    nested: { title: "ネストしたShadow DOM" },
    liveRegion: { title: "Shadow DOM内のライブリージョン" },
  },
  examples: {
    form: {
      accessible: {
        title: "アクセシブルなShadow DOM内フォーム",
        desc: "✅ 適切なラベルを持つShadow DOM内のフォーム。各入力にはlabel要素が関連付けられている",
      },
      noLabels: {
        title: "ラベルのないShadow DOM内フォーム",
        desc: "❌ ラベルが関連付けられていないShadow DOM内の入力要素。スクリーンリーダーが各フィールドの目的を識別できない",
      },
    },
    image: {
      noAlt: {
        title: "alt属性のないShadow DOM内画像",
        desc: "❌ alt属性のないShadow DOM内の画像。支援技術が画像の目的を伝えることができない",
      },
      withAlt: {
        title: "alt属性のあるShadow DOM内画像",
        desc: "✅ 説明的なalt属性を持つShadow DOM内の画像",
      },
    },
    nested: {
      accessible: {
        title: "アクセシブルなネストしたShadow DOM",
        desc: "✅ 内側にWeb Componentを含む外側のWeb Component。どちらも適切なアクセシビリティ属性を持つ",
      },
    },
    liveRegion: {
      polite: {
        title: "Shadow DOM内のライブリージョン",
        desc: "Shadow DOM内のライブリージョンも支援技術にコンテンツの更新を通知する必要がある",
      },
    },
  },
} as const;
