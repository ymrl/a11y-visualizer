export const en = {
  title: "Buttons",
  intro:
    "Buttons are interactive elements that users activate to perform actions. They must convey the purpose of themselves what it does when pushed, to assistive technologies. They must be accessible to keyboard users and assistive technologies. The following examples show various button implementations and common accessibility issues.",
  sections: {
    buttonElement: { title: "<button> Element" },
    buttonRole: { title: "Button Role" },
    inputElements: { title: "Input Elements" },
    summary: { title: "Summary Element" },
  },
  examples: {
    button: {
      standard: {
        title: "Standard button element",
        desc: "✅ The most accessible way to create a button. Semantic HTML buttons are keyboard accessible by default and announced correctly by assistive technologies.",
      },
      ariaHidden: {
        title: 'Button with aria-hidden="true"',
        desc: "❌ Button hidden from assistive technologies. While it remains visible and operable visually and via keyboard, users of assistive technologies may not be able to find or operate it.",
      },
      imgWithAlt: {
        title: "Button containing image with alt text",
        desc: "✅ Button with an image that has proper alt text. The alt text becomes the accessible name of the button.",
      },
      imgNoAlt: {
        title: "Button containing image without alt text",
        desc: "❌ Button with an image missing alt text. Assistive technologies cannot determine what this button does, making it inaccessible.",
      },
    },
    role: {
      divWithRole: {
        title: "Div with button role and tabindex",
        desc: "⚠️ A div element with role='button' and tabindex='0', along with JavaScript handling both click and key events. This is a complex implementation and it's better to use a button element.",
      },
      divNoRole: {
        title: "Div as button without role",
        desc: "❌ Custom button missing role='button'. Assistive technologies won't identify this as an interactive element, making it inaccessible.",
      },
      divNoTabindex: {
        title: "Div as button without tabindex",
        desc: "❌ Custom button that can't receive keyboard focus. Keyboard users won't be able to activate this button.",
      },
    },
    input: {
      button: {
        title: 'Input type="button"',
        desc: '✅ Input element with type="button". The value attribute provides the visible label and accessible name.',
      },
      buttonNoValue: {
        title: 'Input type="button" without value',
        desc: "❌ Input button without a value attribute has no accessible name. Assistive technologies cannot identify what this button does.",
      },
      submit: {
        title: 'Input type="submit"',
        desc: "✅ Submit button with proper value. The value attribute provides the visible label and accessible name.",
      },
      submitNoValue: {
        title: 'Input type="submit" without value',
        desc: "Submit button without explicit value. Browsers provide a default label ('Submit' etc), but it's better to be explicit.",
      },
      reset: {
        title: 'Input type="reset"',
        desc: "✅ Reset button that clears form data. The value attribute provides the visible label and accessible name.",
      },
      resetNoValue: {
        title: 'Input type="reset" without value',
        desc: "Reset button without explicit value. Browsers provide a default accessible name ('Reset' etc), but it's better to be explicit.",
      },
      imageWithAlt: {
        title: 'Input type="image" with alt text',
        desc: '✅ Image button by input element with type="image". The alt attribute provides the accessible name for this submit button type.',
      },
      image: {
        title: 'Input type="image"',
        desc: "❌ Image input without alt text. This creates an inaccessible submit button since assistive technologies can't determine its purpose.",
      },
    },
    summary: {
      standard: {
        title: "Summary element",
        desc: "✅ Summary element within details for creating disclosure widgets. Semantically correct and accessible by default.",
      },
      noSummary: {
        title: "details without summary",
        desc: "When details lacks a summary, browsers display a default label like 'Details'.",
      },
      noDetails: {
        title: "Summary element without details",
        desc: "❌ Summary element used outside of details. This is invalid HTML.",
      },
      noName: {
        title: "Summary without accessible name",
        desc: "❌ Summary element with no text content or accessible name. Users won't know what this control does.",
      },
    },
  },
} as const;

export const ja = {
  title: "ボタン",
  intro:
    "ボタンは操作を実行するためのインタラクティブ要素です。ボタンを押したら何が起きるのかという目的を、アクセシブルネームとして支援技術に伝えられなければなりません。キーボードによる操作への対応も必須です。以下は様々な実装例と、よくある問題点を示します。",
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
        desc: "✅ もっともアクセシブルな方法です。セマンティックな HTML の button はデフォルトでキーボード操作でき、支援技術にも適切に伝わります。",
      },
      ariaHidden: {
        title: 'aria-hidden="true" を付けたボタン',
        desc: "❌ aria-hidden 属性によって支援技術はこのボタンを無視します。ところが視覚的には表示され、キーボードでも操作できます。支援技術のユーザーは操作方法によって見つけられないことがあります。",
      },
      imgWithAlt: {
        title: "画像（alt あり）を含むボタン",
        desc: "✅ 適切な alt を持つ画像を含むボタンです。alt がそのままボタンのアクセシブルネームになります。",
      },
      imgNoAlt: {
        title: "画像（alt なし）を含むボタン",
        desc: "❌ 画像に alt が無いため、このボタンの目的が支援技術に伝わりません。",
      },
    },
    role: {
      divWithRole: {
        title: 'div に role="button" と tabindex',
        desc: '⚠️ div 要素に role="button\' と tabindex="0" を付与し、JavaScript でクリックイベントに加えてキーイベントも処理したもの。複雑な実装になってしまうため、 button 要素を使用するべきです。',
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
        desc: "✅ type='button' の input。value 属性に指定した値が表示され、アクセシブルネームとなります。",
      },
      buttonNoValue: {
        title: 'input type="button"（value 無し）',
        desc: "❌ value が無いため、アクセシブルネームがありません。何をするボタンか伝わりません。",
      },
      submit: {
        title: 'input type="submit"',
        desc: "✅ フォーム送信用のボタン。value 属性に指定した値が表示され、アクセシブルネームとなります。",
      },
      submitNoValue: {
        title: 'input type="submit"（value 無し）',
        desc: "明示的な value が無い例。「送信」や「Submit」などの規定の名前が付きますが、明示したほうが良いでしょう。",
      },
      reset: {
        title: 'input type="reset"',
        desc: "✅ 入力内容をリセットするボタン。value 属性に指定した値が表示され、アクセシブルネームとなります。",
      },
      resetNoValue: {
        title: 'input type="reset"（value 無し）',
        desc: "明示的な value が無い例。「リセット」や「Reset」などの規定の名前が付きますが、明示したほうが良いでしょう。",
      },
      imageWithAlt: {
        title: 'input type="image"（alt あり）',
        desc: '✅ type="image" の input 要素は画像ボタンになります。alt 属性に指定した値がアクセシブルネームとなります。',
      },
      image: {
        title: 'input type="image"',
        desc: "❌ alt のない画像ボタン。支援技術は何の目的のボタンなのかをユーザーに伝えられません。",
      },
    },
    summary: {
      standard: {
        title: "summary 要素",
        desc: "✅ details と組み合わせて開閉 UI を作るための要素。セマンティックに正しく、アクセシブルです。",
      },
      noSummary: {
        title: "summary 要素のない details",
        desc: "summary 要素が無い場合、ブラウザは「詳細」のようなデフォルトのラベルを表示します。",
      },
      noDetails: {
        title: "details 外の summary",
        desc: "❌ details の外で summary を使うのは正しくありません。",
      },
      noName: {
        title: "アクセシブルネームのない summary",
        desc: "❌ テキストやアクセシブルネームが無いため、何の操作か分かりません。",
      },
    },
  },
} as const;
