export default {
  title: "ライブリージョン",
  intro:
    "ライブリージョンは動的な内容の変化をスクリーンリーダーに伝えます。状態更新やエラーなど、即時に把握すべき情報の通知に不可欠です。",
  sections: {
    ariaLive: { title: "aria-live 属性" },
    roles: { title: "ライブリージョンのロール" },
    output: { title: "output 要素" },
    ariaAtomic: { title: "aria-atomic 属性" },
    problematic: { title: "問題のあるライブリージョン" },
    priority: { title: "優先度の相互作用" },
    ariaBusy: { title: "aria-busy の抑止" },
    continuous: { title: "継続的に更新されるライブリージョン" },
  },
  examples: {
    ariaLive: {
      polite: {
        title: "aria-live='polite'",
        desc: "✅ ユーザーの操作を妨げないタイミングで案内するライブリージョン。緊急性の低いステータス更新に適します。",
      },
      assertive: {
        title: "aria-live='assertive'",
        desc: "✅ 変更を即座に通知し、スクリーンリーダーの読み上げを割り込みます。重要な警告やエラーに使用します。",
      },
    },
    roles: {
      status: {
        title: "role='status'",
        desc: "✅ 重要度の低い案内情報を伝えるロール。aria-live='polite' と同等です。",
      },
      alert: {
        title: "role='alert'",
        desc: "✅ 時間に敏感な重要情報を伝えるロール。aria-live='assertive' と同等です。",
      },
    },
    output: {
      element: {
        title: "<output> 要素",
        desc: "✅ 計算結果やフォームの出力を表示する要素。暗黙的にライブリージョンの挙動があります。",
      },
    },
    ariaAtomic: {
      true: {
        title: "aria-atomic='true' のライブリージョン",
        desc: "内容の一部が変化した場合でも、領域全体が読み上げられます。",
      },
    },
    problematic: {
      noLive: {
        title: "ライブリージョンでない動的コンテンツ",
        desc: "❌ 動的に変化してもライブリージョンとしてマークされていないため、スクリーンリーダーに変化が伝わりません。",
      },
    },
    priority: {
      simultaneous: {
        title: "polite と assertive の同時更新",
        desc: "⚠️ assertive が polite を割り込む挙動を示します。同時更新時、polite の読み上げは抑制される場合があります。",
      },
      sequential: {
        title: "優先度の異なる順次更新",
        desc: "assertive の通知が、キューにある polite の未読を打ち消す場合があることを示します。",
      },
    },
    ariaBusy: {
      suppression: {
        title: "aria-busy による抑止",
        desc: "⚠️ aria-busy='true' が設定された間はライブリージョンの通知が抑制されます。内容は変化しても読み上げられません。",
      },
    },
    continuous: {
      timerPolite: {
        title: "polite のタイマー通知",
        desc: "1 秒ごとに更新する polite なライブリージョン。頻繁な更新時の挙動テストに有用です。",
      },
      counterAssertive: {
        title: "assertive のカウンター通知",
        desc: "2 秒ごとに自動インクリメントする assertive なライブリージョン。割り込みの頻度が高いケースのテストに有用です。",
      },
      statusUpdates: {
        title: "role='status' によるステータス更新",
        desc: "3 秒ごとに更新されるステータスメッセージ。ロールベースのライブリージョンに対する継続更新の扱いをテストします。",
      },
    },
  },
} as const;
