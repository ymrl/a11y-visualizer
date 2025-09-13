export default {
  title: "フォームコントロール",
  intro:
    "フォームコントロールは入力のためのインタラクティブ要素です。適切なラベル付けと、スクリーンリーダー/キーボードへの対応が必要です。以下は良い実装とよくある問題の両方を示します。",
  sections: {
    textInputs: { title: "テキスト入力" },
    selectElements: { title: "select 要素" },
    textareaElements: { title: "textarea 要素" },
    editableElements: { title: "編集可能要素" },
    radioButtons: { title: "ラジオボタン" },
    checkboxes: { title: "チェックボックス" },
    labelIssues: { title: "ラベルの問題" },
    inputStates: { title: "入力の状態" },
  },
  examples: {
    textInputs: {
      withoutLabel: {
        title: "ラベルのない input",
        desc: "❌ ラベルがなく、このフィールドの目的が分かりません。スクリーンリーダー利用者にとってアクセス不能です。",
      },
      withLabel: {
        title: "適切なラベル付き input",
        desc: "✅ for と id を用いて関連付けた例。ラベルと入力のプログラム上の関係を構築します。",
      },
      describedbyMissing: {
        title: "存在しない ID を参照する aria-describedby",
        desc: "❌ 文書内に存在しない説明要素を参照しています。",
      },
      mixedRefs: {
        title: "存在する/存在しない参照が混在",
        desc: "⚠️ 一部は存在するが一部は存在しない参照。アクセシビリティの関係が部分的になります。",
      },
    },
    selectElements: {
      withoutLabel: {
        title: "ラベルのない select",
        desc: "❌ このドロップダウンの目的が分かりません。",
      },
      withLabel: {
        title: "適切なラベル付き select",
        desc: "✅ ラベルと関連付けられており、ラベルと選択肢を読み上げられます。",
      },
    },
    textarea: {
      withoutLabel: {
        title: "ラベルのない textarea",
        desc: "❌ 何を入力すべきか分かりません。",
      },
      withLabel: {
        title: "適切なラベル付き textarea",
        desc: "✅ すべての利用者に目的を明確に伝えます。",
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
      textboxMultiline: {
        title: "role='textbox'＋aria-multiline の contenteditable",
        desc: "✅ 複数行の編集に対応。aria-multiline で入力の種類が伝わります。",
      },
      noLabel: {
        title: "ラベルのない contenteditable",
        desc: "❌ ラベルやアクセシブルネームがなく、用途が分かりません。",
      },
      ariaLabel: {
        title: "aria-label を用いた contenteditable",
        desc: "✅ 視覚的なラベルが適さない場合でも、aria-label で名前を提供できます。",
      },
      placeholder: {
        title: "aria-placeholder を用いたプレースホルダー",
        desc: "✅ スクリーンリーダーにも伝わるプレースホルダーのパターンです。",
      },
    },
    radio: {
      withLabels: {
        title: "ラベル付きのラジオボタン",
        desc: "✅ 同一の name で論理的なグループを形成し、ナビゲーション可能になります。",
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
        desc: "❌ 論理的なグループにならず、独立したボタンとして扱われます。",
      },
    },
    checkbox: {
      withLabels: {
        title: "ラベル付きのチェックボックス",
        desc: "✅ 各チェックボックスに明確な名前があり、スクリーンリーダーで読み上げられます。",
      },
      withoutLabels: {
        title: "ラベルのないチェックボックス",
        desc: "❌ 近くにテキストがあっても、プログラム上の関連付けが無いため不適切です。",
      },
      customDisplayNone: {
        title: "display: none を使うカスタムチェックボックス",
        desc: "❌ display: none によりキーボードや支援技術から到達できない場合があります。",
      },
    },
    labels: {
      orphaned: {
        title: "孤立した label",
        desc: "❌ どのフォームコントロールにも関連付かず、混乱を招きます。",
      },
      missingId: {
        title: "存在しない ID を参照する label",
        desc: "❌ 対応する入力が存在しないため、関連付けが確立できません。",
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
  },
} as const;
