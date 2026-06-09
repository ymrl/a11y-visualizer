export const en = {
  title: "Live Regions",
  intro:
    "Live regions announce dynamic content changes to screen readers. They're essential for providing feedback about status updates, errors, and other dynamic content that users need to be aware of immediately.",
  sections: {
    ariaLive: { title: "aria-live Attribute" },
    roles: { title: "Live Region Roles" },
    output: { title: "Output Element" },
    ariaAtomic: { title: "aria-atomic Attribute" },
    problematic: { title: "Problematic Live Regions" },
    priority: { title: "Live Region Priority Interactions" },
    ariaBusy: { title: "aria-busy Suppression" },
    continuous: { title: "Continuously Updating Live Regions" },
    ariaNotify: { title: "ariaNotify API" },
    modalLive: { title: "Live Regions and Modal Dialogs" },
  },
  examples: {
    ariaLive: {
      polite: {
        title: "aria-live='polite'",
        desc: "Polite live region that announces changes when the user is idle. Good for status updates that aren't urgent.",
      },
      assertive: {
        title: "aria-live='assertive'",
        desc: "Assertive live region that immediately interrupts screen readers to announce changes. Use for critical alerts and errors.",
      },
    },
    roles: {
      status: {
        title: "role='status'",
        desc: "Status role provides advisory information that isn't critical. Equivalent to aria-live='polite'.",
      },
      alert: {
        title: "role='alert'",
        desc: "Alert role for important, time-sensitive information. Equivalent to aria-live='assertive'.",
      },
    },
    output: {
      element: {
        title: "<output> element",
        desc: "Output element for displaying calculation results or form output. Automatically has live region behavior.",
      },
    },
    ariaAtomic: {
      true: {
        title: "Live region with aria-atomic='true'",
        desc: "Live region where the entire content is announced when any part changes, rather than just the changed portion.",
      },
    },
    problematic: {
      noLive: {
        title: "Dynamic content without live region",
        desc: "Content that changes dynamically but isn't marked as a live region. Screen readers won't announce these changes.",
      },
    },
    priority: {
      simultaneous: {
        title: "Polite and Assertive simultaneous updates",
        desc: "Demonstrates how assertive live regions interrupt polite ones. When both update simultaneously, the polite announcement may be suppressed.",
      },
      sequential: {
        title: "Sequential updates with different priorities",
        desc: "Demonstrates how assertive announcements can clear pending polite announcements from the queue.",
      },
    },
    ariaBusy: {
      suppression: {
        title: "Live region with aria-busy suppression",
        desc: "Demonstrates how aria-busy='true' suppresses live region announcements. When a region is marked as busy, content changes are not announced to screen readers.",
      },
    },
    continuous: {
      timerPolite: {
        title: "Timer with polite announcements",
        desc: "Timer that updates every second with polite live region. Good for testing extension behavior with frequent updates.",
      },
      counterAssertive: {
        title: "Live counter with assertive announcements",
        desc: "Counter that auto-increments every 2 seconds with assertive live region. Useful for testing frequent interruptions.",
      },
      statusUpdates: {
        title: "Status updates with role='status'",
        desc: "Status messages that update every 3 seconds. Tests extension handling of role-based live regions with continuous updates.",
      },
    },
    ariaNotify: {
      none: {
        title: "ariaNotify (none priority)",
        desc: "Calls document.ariaNotify() with default priority (none). This API notifies assistive technologies without using DOM live region elements.",
      },
      high: {
        title: "ariaNotify (high priority)",
        desc: 'Calls document.ariaNotify() with priority "high". High-priority notifications may interrupt current speech output.',
      },
      element: {
        title: "element.ariaNotify()",
        desc: "Calls ariaNotify() on a specific element. Element.prototype.ariaNotify() notifies assistive technologies in the context of that element.",
      },
      hidden: {
        title: "element.ariaNotify() on an excluded element",
        desc: "Calls ariaNotify() on an element that is excluded from the accessibility tree (display:none / aria-hidden). It should NOT be announced, just like live regions in hidden elements.",
      },
    },
    modalLive: {
      dialog: {
        title: "Live regions inside and outside <dialog>",
        desc: "A modal dialog opened with showModal() contains a live region, and another live region sits outside the modal.",
      },
      ariaModal: {
        title: "Live regions inside and outside aria-modal",
        desc: 'A custom modal using role="dialog" aria-modal="true" contains a live region, and another live region sits outside the modal.',
      },
    },
  },
} as const;

export const ja = {
  title: "ライブリージョン",
  intro:
    "ライブリージョンは動的な内容の変化を支援技術に伝えます。状態更新やエラーなど、即時に把握すべき情報の通知に不可欠です。",
  sections: {
    ariaLive: { title: "aria-live 属性" },
    roles: { title: "ライブリージョンのロール" },
    output: { title: "output 要素" },
    ariaAtomic: { title: "aria-atomic 属性" },
    problematic: { title: "問題のあるライブリージョン" },
    priority: { title: "優先度の相互作用" },
    ariaBusy: { title: "aria-busy の抑止" },
    continuous: { title: "継続的に更新されるライブリージョン" },
    ariaNotify: { title: "ariaNotify API" },
    modalLive: { title: "ライブリージョンとモーダルダイアログ" },
  },
  examples: {
    ariaLive: {
      polite: {
        title: 'aria-live="polite"',
        desc: "ユーザーの操作を妨げないタイミングで案内するライブリージョン。緊急性の低いステータス更新に適します。",
      },
      assertive: {
        title: 'aria-live="assertive"',
        desc: "変更を即座に通知し、スクリーンリーダーの読み上げを割り込みます。重要な警告やエラーに使用します。",
      },
    },
    roles: {
      status: {
        title: 'role="status"',
        desc: '重要度の低い案内情報を伝えるロール。aria-live="polite" と似た挙動です。',
      },
      alert: {
        title: 'role="alert"',
        desc: '時間に敏感な重要情報を伝えるロール。aria-live="assertive" と似た挙動です。',
      },
    },
    output: {
      element: {
        title: "<output> 要素",
        desc: "計算結果やフォームの出力を表示する要素。暗黙的にライブリージョンの挙動があります。",
      },
    },
    ariaAtomic: {
      true: {
        title: 'aria-atomic="true" のライブリージョン',
        desc: "内容の一部が変化した場合でも、領域全体が読み上げられます。",
      },
    },
    problematic: {
      noLive: {
        title: "ライブリージョンでない動的コンテンツ",
        desc: "動的に変化してもライブリージョンとしてマークされていないため、支援技術に変化が伝わりません。",
      },
    },
    priority: {
      simultaneous: {
        title: "polite と assertive の同時更新",
        desc: "assertive が polite を割り込む挙動を示します。同時更新時、polite の読み上げは抑制される場合があります。",
      },
      sequential: {
        title: "優先度の異なる順次更新",
        desc: "assertive の通知が、キューにある polite の未読を打ち消す場合があることを示します。",
      },
    },
    ariaBusy: {
      suppression: {
        title: "aria-busy による抑止",
        desc: 'aria-busy="true" が設定された間はライブリージョンの通知が抑制されます。内容は変化しても読み上げられません。',
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
        title: 'role="status" によるステータス更新',
        desc: "3 秒ごとに更新されるステータスメッセージ。ロールベースのライブリージョンに対する継続更新の扱いをテストします。",
      },
    },
    ariaNotify: {
      none: {
        title: "ariaNotify（priority なし）",
        desc: "document.ariaNotify() をデフォルト priority（none）で呼び出します。DOM にライブリージョン要素を使わずに支援技術へ通知する API です。",
      },
      high: {
        title: 'ariaNotify（priority: "high"）',
        desc: 'document.ariaNotify() を priority "high" で呼び出します。高優先度の通知は現在の読み上げを中断する可能性があります。',
      },
      element: {
        title: "element.ariaNotify()",
        desc: "特定の要素に対して ariaNotify() を呼び出します。Element.prototype.ariaNotify() はその要素の文脈で支援技術へ通知します。",
      },
      hidden: {
        title:
          "アクセシビリティツリーから除外された要素での element.ariaNotify()",
        desc: "アクセシビリティツリーから除外された要素（display:none / aria-hidden）に対して ariaNotify() を呼び出します。隠れた要素内のライブリージョンと同様に、通知されないはずです。",
      },
    },
    modalLive: {
      dialog: {
        title: "<dialog> の内側と外側のライブリージョン",
        desc: "showModal() で開いたモーダルダイアログ内のライブリージョンと、モーダルの外にあるライブリージョンです。",
      },
      ariaModal: {
        title: "aria-modal の内側と外側のライブリージョン",
        desc: 'role="dialog" aria-modal="true" のカスタムモーダル内のライブリージョンと、モーダルの外にあるライブリージョンです。',
      },
    },
  },
} as const;
