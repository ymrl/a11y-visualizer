export const en = {
  title: "Inert",
  intro:
    "The inert attribute and the CSS interactivity: inert declaration make an element and its entire subtree non-interactive and remove them from the accessibility tree. Assistive technologies ignore content within an inert subtree.",
  sections: {
    interactive: { title: "Interactive Elements" },
    liveRegions: { title: "Live Regions" },
  },
  examples: {
    interactive: {
      link: {
        title: "Link inside an inert subtree",
        desc: "A link placed inside a container with the inert attribute. It cannot receive focus or be activated, and it is removed from the accessibility tree.",
      },
      button: {
        title: "Button inside an inert subtree",
        desc: "A button placed inside a container with the inert attribute. It cannot be focused or clicked, and it is removed from the accessibility tree.",
        button: "Inert Button",
      },
      form: {
        title: "Form controls inside an inert subtree",
        desc: "Form controls placed inside a container with the inert attribute. They cannot be focused or edited, and they are removed from the accessibility tree.",
        nameLabel: "Name",
        agreeLabel: "Agree to terms",
        submit: "Submit",
      },
    },
    attribute: {
      liveRegion: {
        title: "Live region inside an inert subtree",
        desc: "A live region placed inside a container with the inert attribute. Because the subtree is removed from the accessibility tree, content changes are not conveyed to assistive technologies.",
        button: "Update Live Region",
        label: "Status (inert):",
      },
    },
    style: {
      liveRegion: {
        title: "Live region inside an interactivity: inert subtree",
        desc: "A live region inside a container styled with interactivity: inert. This CSS declaration expresses the same inert state as the attribute. Browser support for this property varies.",
        button: "Update Live Region",
        label: "Status (interactivity: inert):",
      },
    },
    ariaNotify: {
      element: {
        title: "element.ariaNotify() on an inert element",
        desc: "Calls ariaNotify() on an element that has the inert attribute. Notifications originating from an inert element are not conveyed to assistive technologies.",
        button: "Call ariaNotify on inert element",
      },
    },
  },
} as const;

export const ja = {
  title: "Inert",
  intro:
    "inert 属性および CSS の interactivity: inert は、要素とそのサブツリー全体を操作不可にし、アクセシビリティツリーから除外します。inert なサブツリー内のコンテンツは支援技術から無視されます。",
  sections: {
    interactive: { title: "操作可能な要素" },
    liveRegions: { title: "ライブリージョン" },
  },
  examples: {
    interactive: {
      link: {
        title: "inert なサブツリー内のリンク",
        desc: "inert 属性を持つコンテナ内に置かれたリンクです。フォーカスや操作ができず、アクセシビリティツリーからも除外されます。",
      },
      button: {
        title: "inert なサブツリー内のボタン",
        desc: "inert 属性を持つコンテナ内に置かれたボタンです。フォーカスやクリックができず、アクセシビリティツリーからも除外されます。",
        button: "inert なボタン",
      },
      form: {
        title: "inert なサブツリー内のフォームコントロール",
        desc: "inert 属性を持つコンテナ内に置かれたフォームコントロールです。フォーカスや入力ができず、アクセシビリティツリーからも除外されます。",
        nameLabel: "名前",
        agreeLabel: "規約に同意する",
        submit: "送信",
      },
    },
    attribute: {
      liveRegion: {
        title: "inert なサブツリー内のライブリージョン",
        desc: "inert 属性を持つコンテナ内に置かれたライブリージョンです。サブツリーがアクセシビリティツリーから除外されるため、内容の変化は支援技術に伝わりません。",
        button: "ライブリージョンを更新",
        label: "ステータス（inert）:",
      },
    },
    style: {
      liveRegion: {
        title: "interactivity: inert なサブツリー内のライブリージョン",
        desc: "interactivity: inert を指定したコンテナ内のライブリージョンです。この CSS 宣言は inert 属性と同等の状態を表します。このプロパティの対応状況はブラウザによって異なります。",
        button: "ライブリージョンを更新",
        label: "ステータス（interactivity: inert）:",
      },
    },
    ariaNotify: {
      element: {
        title: "inert な要素での element.ariaNotify()",
        desc: "inert 属性を持つ要素に対して ariaNotify() を呼び出します。inert な要素から発生した通知は支援技術に伝わりません。",
        button: "inert な要素で ariaNotify を呼ぶ",
      },
    },
  },
} as const;
