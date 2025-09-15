export const en = {
  title: "Form Controls",
  intro:
    "Form controls are interactive elements that allow users to input data. They must have proper labels and be accessible to assistive technologies and keyboard users. The following examples demonstrate both accessible implementations and common accessibility issues.",
  sections: {
    textInputs: { title: "Text Inputs" },
    selectElements: { title: "Select Elements" },
    textareaElements: { title: "Textarea Elements" },
    editableElements: { title: "Editable Elements" },
    radioButtons: { title: "Radio Buttons" },
    checkboxes: { title: "Checkboxes" },
    labelIssues: { title: "Label Issues" },
    inputStates: { title: "Input States" },
  },
  examples: {
    textInputs: {
      withoutLabel: {
        title: "Input without label",
        desc: "❌ Input without a label. Assistive technologies cannot convey the purpose of this field to users.",
      },
      withLabel: {
        title: "Input with proper label",
        desc: "✅ Text input with associated label using 'for' and 'id' attributes. This creates a programmatic relationship between label and input.",
      },
      insideLabel: {
        title: "Input inside label",
        desc: "✅ An alternative method is to nest the input inside the label element. This works similarly to 'for/id' association.",
      },
    },
    selectElements: {
      withoutLabel: {
        title: "Select without label",
        desc: "❌ Select element without label. Users cannot determine what this dropdown is for.",
      },
      withLabel: {
        title: "Select with proper label",
        desc: "✅ Select element with associated label. Assistive technologies can tell their users both the label and the current selection.",
      },
    },
    textarea: {
      withoutLabel: {
        title: "Textarea without label",
        desc: "❌ Textarea without label. Users cannot understand what content should be entered here.",
      },
      withLabel: {
        title: "Textarea with proper label",
        desc: "✅ Textarea with associated label. Clearly communicates the purpose of the text area to assistive technology users.",
      },
    },
    checkbox: {
      withLabels: {
        title: "Checkboxes with labels",
        desc: "✅ Properly labeled checkboxes. Each checkbox has a clear, accessible name.",
      },
      withoutLabels: {
        title: "Checkboxes without labels",
        desc: "❌ Checkboxes without proper labels. While there is text nearby, it isn't programmatically associated, making it hard for screen reader users to understand what each checkbox represents.",
      },
      customDisplayNone: {
        title: "Custom styled checkbox with display: none",
        desc: "❌ Custom checkbox using 'display: none' which can remove the element from keyboard navigation and screen readers.",
      },
    },
    radio: {
      withLabels: {
        title: "Radio buttons with labels",
        desc: "✅ Properly labeled radio buttons with shared name attribute. Forms a logical group that browsers and assistive technologies can interpret. Each option is named using label elements. The group itself is labeled using fieldset and legend elements.",
      },
      withoutLabels: {
        title: "Radio buttons without labels",
        desc: "❌ Radio buttons without proper labels. Text appears next to radios but isn't programmatically associated, making it inaccessible.",
      },
      withoutName: {
        title: "Radio buttons without name attribute",
        desc: "❌ Radio buttons without shared name attribute. These don't form a proper group, so both can be selected simultaneously.",
      },
      differentName: {
        title: "Radio buttons with different name attributes",
        desc: "❌ Radio buttons with different name attributes don't form a logical group. Each acts as an independent radio button.",
      },
      single: {
        title: "Single radio button",
        desc: "❌ If there's only one option, use a checkbox instead of a radio button. Users cannot uncheck a radio button once selected.",
      },
    },
    labels: {
      orphaned: {
        title: "Orphaned label",
        desc: "⚠️ Label element not associated with any form control. It makses no sense.",
      },
      missingId: {
        title: "Label with non-existent ID reference",
        desc: "⚠️ Label references an ID that doesn't exist. Is the ID you meant to reference incorrect?",
      },
    },
    states: {
      required: {
        title: "Required input",
        desc: "✅ Input with required attribute. Screen readers can announce that this field is required. Consider adding visual indicators and clear error messaging.",
      },
      readonly: {
        title: "Read-only input",
        desc: "Read-only input that users cannot modify. Screen readers will announce this state. Useful for displaying non-editable information in form context.",
      },
    },
    editable: {
      noRole: {
        title: "Contenteditable div without role",
        desc: "⚠️ Contenteditable div without proper role. While functional, screen readers may not announce it as a text input field.",
      },
      textboxLabelled: {
        title: "Contenteditable div with role='textbox' and aria-labelledby",
        desc: "✅ Contenteditable div with proper textbox role and accessible labeling. Uses aria-labelledby to connect with the label element.",
      },
      noLabel: {
        title: "Contenteditable without label",
        desc: "❌ Contenteditable element without any label or accessible name. Screen readers cannot identify what this field is for.",
      },
    },
  },
} as const;

export const ja = {
  title: "フォームコントロール",
  intro:
    "フォームコントロールは入力のためのインタラクティブ要素です。適切なラベル付けと、キーボード・支援技術への対応が必要です。以下は良い実装とよくある問題の両方を示します。",
  sections: {
    textInputs: { title: "テキスト入力" },
    selectElements: { title: "select 要素" },
    textareaElements: { title: "textarea 要素" },
    editableElements: { title: "contenteditable 属性" },
    radioButtons: { title: "ラジオボタン" },
    checkboxes: { title: "チェックボックス" },
    labelIssues: { title: "ラベルの問題" },
    inputStates: { title: "入力の状態" },
  },
  examples: {
    textInputs: {
      withoutLabel: {
        title: "ラベルのない input",
        desc: "❌ 支援技術は、フィールドの目的をフィールドから辿ってユーザーに提示することができません。",
      },
      withLabel: {
        title: "適切なラベル付き input",
        desc: "✅ for と id を用いて関連付けた例。ラベルと入力のプログラム上の関係を構築します。",
      },
      insideLabel: {
        title: "label 内に含まれる input",
        desc: "✅ label 要素内に input を含める方法もあります。for/id の関連付けと同様に機能します。",
      },
    },
    selectElements: {
      withoutLabel: {
        title: "ラベルのない select",
        desc: "❌ このセレクトボックスの目的が分かりません。",
      },
      withLabel: {
        title: "適切なラベル付き select",
        desc: "✅ ラベルと関連付けられており、支援技術はセレクトボックスの目的と選択肢をユーザーに伝えられます。",
      },
    },
    textarea: {
      withoutLabel: {
        title: "ラベルのない textarea",
        desc: "❌ 何を入力すべきか分かりません。",
      },
      withLabel: {
        title: "適切なラベル付き textarea",
        desc: "✅ 支援技術のユーザーに対しても、テキストエリアの目的を明確に伝えられます。",
      },
    },
    checkbox: {
      withLabels: {
        title: "ラベル付きのチェックボックス",
        desc: "✅ 各チェックボックスに明確な名前があり、支援技術もそれらを認識します。",
      },
      withoutLabels: {
        title: "ラベルのないチェックボックス",
        desc: "❌ 近くにテキストがあっても、プログラム上の関連付けがありません。スクリーンリーサーのユーザーは、どのチェックボックスが何を意味するのか分かりづらくなります。",
      },
      customDisplayNone: {
        title: "display: none を使うカスタムチェックボックス",
        desc: "❌ display: none により、キーボードや支援技術から到達できません。",
      },
    },
    radio: {
      withLabels: {
        title: "ラベル付きのラジオボタン",
        desc: "✅ 同一の name 属性をつけることで、ブラウザや支援技術が解釈できるかたちでラジオボタンをグループ化しています。それぞれの選択肢は label 要素により名前がつけられています。 fieldset 要素 と legend 要素で、グループ全体のラベルもつけられています。",
      },
      withoutLabels: {
        title: "ラベルのないラジオボタン",
        desc: "❌ 視覚的にテキストがあっても、プログラム上の関連付けが無くアクセシブルではありません。",
      },
      withoutName: {
        title: "name のないラジオボタン",
        desc: "❌ グループを形成できず、同時に複数選択できてしまいます。",
      },
      differentName: {
        title: "異なる name を持つラジオボタン",
        desc: "❌ グループにならず、独立したボタンとして扱われます。",
      },
      single: {
        title: "単体で置かれたラジオボタン",
        desc: "❌ 選択肢が1つだけのときは、ラジオボタンではなくチェックボックスを使うべきです。ユーザーはラジオボタンのチェック状態を解除できません。",
      },
    },
    labels: {
      orphaned: {
        title: "孤立した label",
        desc: "⚠️ どのフォームコントロールにも関連付かず、意味がありません。",
      },
      missingId: {
        title: "存在しない ID を参照する label",
        desc: "⚠️ 対応する入力が存在していません。指定する ID を間違えていませんか？",
      },
    },
    states: {
      required: {
        title: "必須の入力",
        desc: "✅ required 属性により必須であることを伝えます。視覚的な指標やエラーメッセージも併用しましょう。",
      },
      readonly: {
        title: "読み取り専用の入力",
        desc: "ユーザーが変更できない入力。スクリーンリーダーは状態を読み上げます。固定情報の表示に有用です。",
      },
    },
    editable: {
      noRole: {
        title: "role のない contenteditable",
        desc: "⚠️ 動作はしますが、スクリーンリーダーがテキスト入力として認識しない場合があります。",
      },
      textboxLabelled: {
        title: "role='textbox'＋aria-labelledby の contenteditable",
        desc: "✅ textbox ロールとラベル関連付けにより、アクセシブルな編集領域になります。",
      },
      noLabel: {
        title: "ラベルのない contenteditable",
        desc: "❌ ラベルやアクセシブルネームがなく、用途が分かりません。",
      },
    },
  },
} as const;
