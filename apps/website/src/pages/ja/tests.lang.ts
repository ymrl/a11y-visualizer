const dict = {
  header: {
    subtitle: "テスト用ページ",
  },
  notice: {
    title: "テストページに関する注意",
    p1: "このページには、テストおよびデモのために意図的にアクセシビリティ上の問題を含む実装例が含まれています。",
    p2: "これらの例を本番サイトで使用しないでください。アクセシビリティのガイドラインやベストプラクティスに反します。",
    p3: "このページは Accessibility Visualizer 拡張機能と併用することで、開発者がアクセシビリティの問題を発見・理解するのを支援する目的で作られています。",
  },
  intro: {
    title: "テスト用ページ",
    desc: "このページは Accessibility Visualizer 拡張機能の動作確認を目的としたテストページです。アクセシビリティ上の課題がある様々な実装例を含み、拡張機能が問題点をどのように可視化し、改善の手がかりを提示するかを確認できます。",
  },
  categories: {
    title: "カテゴリー",
    headings: {
      images: "画像",
      buttons: "ボタン",
      links: "リンク",
      forms: "フォームコントロール",
      headings: "見出し",
      tables: "テーブル",
      ariaHidden: "ARIA Hidden",
      landmarks: "ランドマーク",
      liveRegions: "ライブリージョン",
    },
  },
} as const;

export default dict;
