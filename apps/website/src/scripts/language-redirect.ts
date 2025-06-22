// ブラウザの言語設定を検出して適切な言語ページにリダイレクト（初回訪問時のみ）
function initLanguageRedirect(): void {
  // 現在のパスから言語を判定
  const currentPath = window.location.pathname;
  const basePath = "/a11y-visualizer";

  // すでに言語固有のパスにいる場合はリダイレクトしない
  if (
    currentPath.startsWith(basePath + "/ja/") ||
    currentPath.startsWith(basePath + "/ko/") ||
    (currentPath !== basePath + "/" && currentPath !== basePath)
  ) {
    return;
  }

  // リファラーがある場合（サイト内遷移）はリダイレクトしない
  const referrer = document.referrer;
  if (
    referrer &&
    (referrer.includes("/a11y-visualizer/ja/") ||
      referrer.includes("/a11y-visualizer/ko/") ||
      referrer.includes("/a11y-visualizer/"))
  ) {
    return;
  }

  // セッションストレージで言語選択済みかチェック
  const hasLanguagePreference = sessionStorage.getItem(
    "a11y-visualizer-language-selected",
  );
  if (hasLanguagePreference) {
    return;
  }

  // ブラウザの言語設定を取得
  const browserLanguages = navigator.languages || [navigator.language];

  // サポートする言語
  const supportedLanguages: Record<string, string> = {
    ja: "/ja/",
    ko: "/ko/",
    en: "/",
  };

  // 最適な言語を決定
  let targetLanguage = "en"; // デフォルトは英語

  for (const lang of browserLanguages) {
    const langCode = lang.split("-")[0].toLowerCase();
    if (supportedLanguages[langCode]) {
      targetLanguage = langCode;
      break;
    }
  }

  // 現在が英語ページで、他の言語が適切な場合のみリダイレクト
  if (
    targetLanguage !== "en" &&
    (currentPath === basePath + "/" || currentPath === basePath)
  ) {
    // 言語選択済みフラグを設定
    sessionStorage.setItem("a11y-visualizer-language-selected", "true");
    window.location.href = basePath + supportedLanguages[targetLanguage];
  }
}

// DOMの読み込み完了を待つ
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLanguageRedirect);
} else {
  initLanguageRedirect();
}
