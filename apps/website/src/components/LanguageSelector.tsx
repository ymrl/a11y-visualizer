interface LanguageSelectorProps {
  currentLang: string;
}

const languages = [
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
];

export default function LanguageSelector({
  currentLang,
}: LanguageSelectorProps) {
  const basePath = "/a11y-visualizer";

  const getLanguageUrl = (langCode: string) => {
    if (langCode === "en") {
      return basePath + "/";
    }
    return basePath + `/${langCode}/`;
  };

  const handleLanguageChange = (langCode: string) => {
    // 言語選択済みフラグを設定
    sessionStorage.setItem("a11y-visualizer-language-selected", "true");
    window.location.href = getLanguageUrl(langCode);
  };

  return (
    <div className="flex items-center space-x-1">
      {languages.map((language, index) => (
        <span key={language.code} className="flex items-center">
          {index > 0 && (
            <span className="mx-2 text-zinc-400 dark:text-zinc-500">|</span>
          )}
          <a
            href={getLanguageUrl(language.code)}
            onClick={(e) => {
              e.preventDefault();
              handleLanguageChange(language.code);
            }}
            className={`px-2 py-1 text-xs sm:text-sm font-medium rounded transition-colors ${
              language.code === currentLang
                ? "text-teal-700 dark:text-teal-200 bg-teal-50 dark:bg-teal-800"
                : "text-zinc-600 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-200 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
            {...(language.code === currentLang && { "aria-current": "page" })}
          >
            {language.name}
          </a>
        </span>
      ))}
    </div>
  );
}
