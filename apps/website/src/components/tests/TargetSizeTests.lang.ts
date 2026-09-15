export const en = {
  title: "Target Size",
  intro:
    "Interactive targets such as buttons and links need to be large enough, and spaced far enough apart, to be operated comfortably by touch and pointer users. WCAG 2.5.8 (AA) requires a minimum target size of 24×24 CSS pixels, and WCAG 2.5.5 (AAA) recommends at least 44×44 CSS pixels. Undersized targets can still pass if there is enough spacing around them. The following examples use buttons to show target size and spacing patterns.",
  sections: {
    singleTarget: { title: "Single Target Size" },
    spacing: { title: "Spacing Between Targets" },
  },
  examples: {
    standard: {
      title: "Comfortably sized button (44×44px)",
      desc: "✅ A button at least 44×44 CSS pixels. This meets the AAA recommendation (WCAG 2.5.5) and is easy to operate for touch and pointer users.",
    },
    minimum: {
      title: "Minimum sized button (24×24px)",
      desc: "⚠️ A 24×24 CSS pixel button meets the AA minimum (WCAG 2.5.8) but is on the edge. A larger target of 44×44px is recommended for comfortable operation.",
    },
    tooSmall: {
      title: "Too small button (16×16px)",
      desc: "❌ A 16×16 CSS pixel button is below the 24×24px minimum. It is hard to tap accurately and fails WCAG 2.5.8.",
    },
    dense: {
      title: "Too small buttons packed together",
      desc: "❌ Several undersized buttons placed right next to each other with no spacing. Each target is too small and too close to its neighbors, making them easy to mis-tap.",
    },
    adjacent: {
      title: "Large and small buttons adjacent",
      desc: "❌ A large button next to a small button with no spacing. Even though one target is large, the small one is undersized and sits too close, so it is easy to activate the wrong one.",
    },
    mitigated: {
      title: "Adequate spacing around small targets",
      desc: "✅ The same small buttons, but with enough spacing that a 24px circle centered on each target does not overlap its neighbors. This satisfies the WCAG 2.5.8 spacing exception. Making the targets 44×44px is still preferable.",
    },
  },
} as const;

export const ja = {
  title: "ターゲットサイズ",
  intro:
    "ボタンやリンクなどの操作ターゲットは、タッチやポインターで快適に操作できるよう、十分な大きさと間隔が必要です。WCAG 2.5.8（AA）は最小 24×24 CSS ピクセルを求め、WCAG 2.5.5（AAA）は 44×44 CSS ピクセル以上を推奨しています。小さいターゲットでも、周囲に十分な間隔があれば要件を満たせます。以下はボタンを使ってターゲットサイズと間隔のパターンを示します。",
  sections: {
    singleTarget: { title: "単体のターゲットサイズ" },
    spacing: { title: "ターゲット間の間隔" },
  },
  examples: {
    standard: {
      title: "十分な大きさのボタン（44×44px）",
      desc: "✅ 44×44 CSS ピクセル以上のボタン。AAA の推奨（WCAG 2.5.5）を満たし、タッチやポインターでも操作しやすい大きさです。",
    },
    minimum: {
      title: "最小サイズのボタン（24×24px）",
      desc: "⚠️ 24×24 CSS ピクセルのボタンは AA の最小要件（WCAG 2.5.8）を満たしますが、ぎりぎりの大きさです。快適な操作のためには 44×44px 以上を推奨します。",
    },
    tooSmall: {
      title: "小さすぎるボタン（16×16px）",
      desc: "❌ 16×16 CSS ピクセルのボタンは最小の 24×24px を下回っています。正確にタップしづらく、WCAG 2.5.8 を満たしません。",
    },
    dense: {
      title: "小さすぎるボタンが密集した状態",
      desc: "❌ 小さすぎるボタンを間隔なく並べたもの。ターゲットが小さいうえに隣接しているため、誤って隣を押しやすくなります。",
    },
    adjacent: {
      title: "大きなボタンと小さなボタンが隣接した状態",
      desc: "❌ 大きなボタンの隣に小さなボタンを間隔なく配置したもの。片方が大きくても、小さいほうはサイズ不足のうえ近すぎるため、意図しないボタンを押しやすくなります。",
    },
    mitigated: {
      title: "小さいターゲットの間隔を確保した状態",
      desc: "✅ 同じ小さいボタンでも、各ターゲットを中心とした直径 24px の円が隣と重ならないだけの間隔を空けたもの。WCAG 2.5.8 の間隔に関する例外を満たします。ターゲット自体を 44×44px にできればより望ましいです。",
    },
  },
} as const;
