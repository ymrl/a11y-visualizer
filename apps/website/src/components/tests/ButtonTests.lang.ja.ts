export default {
  title: "ボタン",
  intro:
    "ボタンは操作を実行するためのインタラクティブ要素です。キーボード利用やスクリーンリーダーへの対応が必要です。以下は様々な実装例と、よくある問題点を示します。",
  sections: {
    buttonElement: { title: "<button> 要素" },
    buttonRole: { title: "Button ロール" },
    inputElements: { title: "input 要素" },
    summary: { title: "summary 要素" },
  },
  examples: {
    button: {
      standard: {
        title: "標準的な button 要素",
        desc: "✅ もっともアクセシブルな方法です。セマンティックな HTML の button はデフォルトでキーボード操作でき、スクリーンリーダーにも適切に伝わります。",
      },
      ariaHidden: {
        title: "aria-hidden を付けたボタン",
        desc: "❌ 支援技術から隠されるため、スクリーンリーダーユーザーには操作できないボタンになります（視覚的には表示されます）。",
      },
      imgWithAlt: {
        title: "画像（alt あり）を含むボタン",
        desc: "✅ 適切な alt を持つ画像を含むボタンです。alt がそのままボタンのアクセシブルネームになります。",
      },
      imgNoAlt: {
        title: "画像（alt なし）を含むボタン",
        desc: "❌ 画像に alt が無いため、このボタンの目的がスクリーンリーダーに伝わりません。",
      },
    },
    role: {
      divWithRole: {
        title: "div に role=button と tabindex",
        desc: "✅ div を用いて正しく実装したカスタムボタン。role='button' と tabindex='0' を付与。とはいえ、基本的にはセマンティックな button の利用が推奨されます。",
      },
      divNoRole: {
        title: "role のない div ボタン",
        desc: "❌ role='button' が無いため、支援技術はインタラクティブ要素として認識できません。",
      },
      divNoTabindex: {
        title: "tabindex のない div ボタン",
        desc: "❌ キーボードフォーカスを受けられないため、キーボード利用者は操作できません。",
      },
    },
    input: {
      button: {
        title: 'input type="button"',
        desc: "✅ type='button' の input。value 属性でボタンのアクセシブルネームを提供します。",
      },
      buttonNoValue: {
        title: 'input type="button"（value 無し）',
        desc: "❌ value が無いため、アクセシブルネームがありません。何をするボタンか伝わりません。",
      },
      submit: {
        title: 'input type="submit"',
        desc: "✅ フォーム送信用のボタン。value を適切に指定します（未指定時は 'Submit' が既定）。",
      },
      submitNoValue: {
        title: 'input type="submit"（value 無し）',
        desc: "明示的な value が無い例。ブラウザは既定の名前（'Submit'）を付けますが、明示した方が望ましいです。",
      },
      reset: {
        title: 'input type="reset"',
        desc: "✅ 入力内容をリセットするボタン。アクセシビリティのため value を適切に指定します。",
      },
      resetNoValue: {
        title: 'input type="reset"（value 無し）',
        desc: "明示的な value が無い例。既定の名前（'Reset'）は付きますが、明示した方が分かりやすいです。",
      },
      image: {
        title: 'input type="image"',
        desc: "❌ alt のない画像ボタン。スクリーンリーダーが目的を特定できず、アクセス不能になります。",
      },
      imageWithAlt: {
        title: 'input type="image"（alt あり）',
        desc: "✅ 適切な alt により、このボタン型のアクセシブルネームが提供されます。",
      },
    },
    summary: {
      standard: {
        title: "summary 要素",
        desc: "✅ details と組み合わせて開閉 UI を作るための要素。セマンティックに正しく、既定でアクセシブルです。",
      },
      noDetails: {
        title: "details 外の summary",
        desc: "❌ details の外で summary を使うのは無効な HTML で、ブラウザ間で挙動が安定しません。",
      },
      noName: {
        title: "アクセシブルネームのない summary",
        desc: "❌ テキストやアクセシブルネームが無いため、何の操作か分かりません。",
      },
    },
  },
} as const;
