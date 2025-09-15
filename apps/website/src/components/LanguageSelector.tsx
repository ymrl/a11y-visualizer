interface LanguageSelectorProps {
  currentLang: string;
  path?: string;
  disabledLanguages?: string[];
}

const languages = [
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
];

export default function LanguageSelector({
  currentLang,
  path = "/a11y-visualizer",
  disabledLanguages = [],
}: LanguageSelectorProps) {
  const basePath = "/a11y-visualizer";
  const isBrowser = typeof window !== "undefined";

  const getLanguageUrl = (langCode: string) => {
    const pathname = isBrowser ? window.location.pathname : path;
    if (pathname.startsWith(`${basePath}/docs/`)) {
      const rest = pathname.slice(`${basePath}/docs/`.length);
      const parts = rest.split("/").filter(Boolean);
      const first = parts[0];
      const isLocalized = first === "ja" || first === "ko";
      const slug = isLocalized ? parts.slice(1).join("/") : parts.join("/");
      if (langCode === "en") return `${basePath}/docs/${slug}/`;
      return `${basePath}/docs/${langCode}/${slug}/`;
    }

    if (pathname.startsWith(`${basePath}/`)) {
      const rest = pathname.slice(basePath.length);
      const parts = rest.split("/").filter(Boolean);
      const first = parts[0];
      const isLocalized = first === "ja" || first === "ko";
      const slug = isLocalized ? parts.slice(1).join("/") : parts.join("/");
      if (langCode === "en") return `${basePath}/${slug}/`;
      return `${basePath}/${langCode}/${slug}/`;
    }

    return langCode === "en" ? `${basePath}/` : `${basePath}/${langCode}/`;
  };

  return (
    <div className="flex items-center space-x-1">
      {languages.map((language, index) => {
        const isDisabled = disabledLanguages.includes(language.code);
        return (
          <span key={language.code} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-zinc-400 dark:text-zinc-500">|</span>
            )}
            <a
              href={isDisabled ? undefined : getLanguageUrl(language.code)}
              className={`px-2 py-1 text-xs sm:text-sm font-medium rounded transition-colors ${
                isDisabled
                  ? "text-zinc-600 dark:text-zinc-400"
                  : language.code === currentLang
                    ? "text-teal-700 dark:text-teal-200 bg-teal-50 dark:bg-teal-800"
                    : "text-zinc-700 dark:text-zinc-300 hover:text-teal-600 dark:hover:text-teal-200 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
              {...(language.code === currentLang && { "aria-current": "page" })}
              lang={language.code}
            >
              {language.name}
            </a>
          </span>
        );
      })}
    </div>
  );
}
