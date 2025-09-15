export const HeaderLink = ({
  lang,
  title,
  subtitle,
}: {
  lang: string;
  title: string;
  subtitle?: string;
}) => (
  <a
    href={lang === "en" ? "/a11y-visualizer/" : `/a11y-visualizer/${lang}/`}
    className="flex items-center"
  >
    <img src="/a11y-visualizer/icon.svg" alt="" className="w-12 h-12 mr-4" />
    <div>
      <h1 className="text-3xl font-bold text-teal-700 dark:text-teal-200">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          {subtitle}
        </p>
      )}
    </div>
  </a>
);
