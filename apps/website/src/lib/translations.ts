export interface Translation {
  title: string;
  subtitle: string;
  description: string;
  hero: {
    title: string;
    description: string;
    imageAlt: string;
    screenshotSrc: string;
  };
  features: {
    title: string;
    items: {
      visual: { title: string; description: string };
      detection: { title: string; description: string };
      liveRegions: { title: string; description: string };
      customizable: { title: string; description: string };
    };
  };
  download: {
    title: string;
    chromeStore: string;
    firefoxAddons: string;
  };
  guide: {
    title: string;
    description: string;
    link: string;
    url: string;
  };
  footer: {
    copyright: string;
    github: string;
  };
}

export const translations: Record<string, Translation> = {
  en: {
    title: "Accessibility Visualizer",
    subtitle: "Simple and Visible Web Accessibility",
    description:
      "A browser extension that displays accessibility-related annotations on web pages to assist developers.",
    hero: {
      title: "Visualize Web Accessibility",
      description:
        "A browser extension that lets you easily view information perceived by users of assistive technologies like screen readers, directly in Chrome and Firefox.",
      imageAlt:
        "Displaying Wikipedia in Chrome with the Accessibility Visualizer popup open. Information from Accessibility Visualizer is overlaid on the page.",
      screenshotSrc: "/a11y-visualizer/images/screenshot_en.png",
    },
    features: {
      title: "Features",
      items: {
        visual: {
          title: "Information Visualization",
          description:
            "Visualize information that's hard to check with browsers alone, such as image alt text, heading levels, and form labels",
        },
        detection: {
          title: "Issue Detection",
          description: "Highlight problematic markup and techniques that need attention",
        },
        liveRegions: {
          title: "Live Regions",
          description: "Visually display information dynamically conveyed to assistive technologies like screen readers",
        },
        customizable: {
          title: "Customizable",
          description:
            "Customize element types and display methods to match your target website",
        },
      },
    },
    download: {
      title: "Download",
      chromeStore: "Chrome Web Store",
      firefoxAddons: "Firefox Add-ons",
    },
    guide: {
      title: "User Guide",
      description: "Learn how to use Accessibility Visualizer",
      link: "View User Guide on GitHub",
      url: "https://github.com/ymrl/a11y-visualizer/blob/main/docs/en/UsersGuide.md",
    },
    footer: {
      copyright: "© 2024 ymrl (MIT License)",
      github: "GitHub",
    },
  },
  ja: {
    title: "Accessibility Visualizer",
    subtitle: "かんたん、「見える」Webアクセシビリティ",
    description:
      "Webページの上にアクセシビリティに関係する注釈を表示し、開発者を支援するブラウザ拡張機能です。",
    hero: {
      title: "Webアクセシビリティを、見る",
      description:
        "スクリーンリーダーなどの支援技術のユーザーが知覚している情報を、ChromeやFirefoxで簡単に確認できる拡張機能です。",
      imageAlt:
        "ChromeでWikipediaを表示し、Accessibility Visualizerのポップアップを開いている。ページ内にはAccessibility Visualizerによる情報がオーバーレイされている",
      screenshotSrc: "/a11y-visualizer/images/screenshot_ja.png",
    },
    features: {
      title: "機能",
      items: {
        visual: {
          title: "情報の可視化",
          description:
            "画像の代替テキスト、見出しレベル、フォームラベルなど、ブラウザ単体では確認しづらい情報を可視化",
        },
        detection: {
          title: "問題の検出",
          description: "問題のあるマークアップや注意するべきテクニックをハイライト",
        },
        liveRegions: {
          title: "ライブリージョン",
          description: "スクリーンリーダーなどの支援技術に動的に伝わる情報を視覚的に表示",
        },
        customizable: {
          title: "カスタマイズ可能",
          description:
            "対象のWebサイトにあわせて、要素の種類や表示方法をカスカスタマイズ",
        },
      },
    },
    download: {
      title: "ダウンロード",
      chromeStore: "Chrome ウェブストア",
      firefoxAddons: "Firefox アドオン",
    },
    guide: {
      title: "ユーザーガイド",
      description: "Accessibility Visualizerの使用方法を学ぶ",
      link: "GitHub でユーザーガイドを見る",
      url: "https://github.com/ymrl/a11y-visualizer/blob/main/docs/ja/UsersGuide.md",
    },
    footer: {
      copyright: "© 2024 ymrl (MIT License)",
      github: "GitHub",
    },
  },
  ko: {
    title: "Accessibility Visualizer",
    subtitle: "간단하고 '보이는' 웹 접근성",
    description:
      "웹 페이지에 접근성 관련 주석을 표시하여 개발자를 지원하는 브라우저 확장 프로그램입니다.",
    hero: {
      title: "웹 접근성을 시각화",
      description:
        "스크린 리더 등 보조 기술 사용자가 인식하는 정보를 Chrome과 Firefox에서 쉽게 확인할 수 있는 확장 프로그램입니다.",
      imageAlt:
        "Chrome에서 Wikipedia를 표시하고 Accessibility Visualizer 팝업이 열려 있습니다. 페이지에는 Accessibility Visualizer의 정보가 오버레이되어 있습니다.",
      screenshotSrc: "/a11y-visualizer/images/screenshot_ko.png",
    },
    features: {
      title: "기능",
      items: {
        visual: {
          title: "정보 시각화",
          description:
            "이미지 대체 텍스트, 제목 수준, 폼 레이블 등 브라우저 단독으로는 확인하기 어려운 정보를 시각화",
        },
        detection: {
          title: "문제 감지",
          description: "문제가 있는 마크업이나 주의해야 할 기술을 하이라이트",
        },
        liveRegions: {
          title: "라이브 영역",
          description: "스크린 리더 등 보조 기술에 동적으로 전달되는 정보를 시각적으로 표시",
        },
        customizable: {
          title: "사용자 정의 가능",
          description:
            "대상 웹사이트에 맞춰 요소 유형과 표시 방법을 사용자 정의",
        },
      },
    },
    download: {
      title: "다운로드",
      chromeStore: "Chrome 웹 스토어",
      firefoxAddons: "Firefox 애드온",
    },
    guide: {
      title: "사용자 가이드",
      description: "Accessibility Visualizer 사용 방법을 배워보세요",
      link: "GitHub에서 사용자 가이드 보기",
      url: "https://github.com/ymrl/a11y-visualizer/blob/main/docs/ko/UsersGuide.md",
    },
    footer: {
      copyright: "© 2024 ymrl (MIT License)",
      github: "GitHub",
    },
  },
};

export function getTranslation(locale: string): Translation {
  return translations[locale] || translations.en;
}
