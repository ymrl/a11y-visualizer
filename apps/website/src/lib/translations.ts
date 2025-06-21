export interface Translation {
  title: string;
  subtitle: string;
  description: string;
  hero: {
    title: string;
    description: string;
    imageAlt: string;
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
  };
  footer: {
    copyright: string;
    github: string;
  };
}

export const translations: Record<string, Translation> = {
  en: {
    title: "Accessibility Visualizer",
    subtitle: "Visualize Web Accessibility",
    description:
      "A browser extension that helps developers identify accessibility issues by highlighting and annotating elements on web pages.",
    hero: {
      title: "Make Web Accessibility Visible",
      description:
        "A browser extension that helps developers identify accessibility issues by highlighting and annotating elements on web pages.",
      imageAlt:
        "Accessibility Visualizer extension in action showing highlighted elements on a webpage",
    },
    features: {
      title: "Features",
      items: {
        visual: {
          title: "Visual Elements",
          description:
            "Visualize image alt text, heading levels, and form labels",
        },
        detection: {
          title: "Issue Detection",
          description:
            "Highlight accessibility issues with warning and error indicators",
        },
        liveRegions: {
          title: "Live Regions",
          description: "Display live region announcements visually",
        },
        customizable: {
          title: "Customizable",
          description:
            "Support for multiple element types and customizable presets",
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
      description: "Learn how to use Accessibility Visualizer effectively",
      link: "View User Guide on GitHub",
    },
    footer: {
      copyright: "© 2024 Accessibility Visualizer. Open source on",
      github: "GitHub",
    },
  },
  ja: {
    title: "Accessibility Visualizer",
    subtitle: "Webアクセシビリティを可視化",
    description:
      "Webページのアクセシビリティ問題をハイライトし、注釈を付けることで開発者を支援するブラウザ拡張機能です。",
    hero: {
      title: "Webアクセシビリティを見える化",
      description:
        "Webページのアクセシビリティ問題をハイライトし、注釈を付けることで開発者を支援するブラウザ拡張機能です。",
      imageAlt:
        "Webページ上の要素をハイライト表示するAccessibility Visualizer拡張機能",
    },
    features: {
      title: "機能",
      items: {
        visual: {
          title: "視覚的要素",
          description:
            "画像の代替テキスト、見出しレベル、フォームラベルを可視化",
        },
        detection: {
          title: "問題検出",
          description: "警告やエラー表示でアクセシビリティ問題をハイライト",
        },
        liveRegions: {
          title: "ライブリージョン",
          description: "ライブリージョンのアナウンスを視覚的に表示",
        },
        customizable: {
          title: "カスタマイズ可能",
          description:
            "複数の要素タイプとカスタマイズ可能なプリセットをサポート",
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
      description: "Accessibility Visualizerを効果的に使用する方法を学ぶ",
      link: "GitHub でユーザーガイドを見る",
    },
    footer: {
      copyright: "© 2024 Accessibility Visualizer.",
      github: "GitHub でオープンソース公開中",
    },
  },
  ko: {
    title: "Accessibility Visualizer",
    subtitle: "웹 접근성 시각화",
    description:
      "웹 페이지의 접근성 문제를 강조하고 주석을 달아 개발자를 도와주는 브라우저 확장 프로그램입니다.",
    hero: {
      title: "웹 접근성을 시각화하세요",
      description:
        "웹 페이지의 접근성 문제를 강조하고 주석을 달아 개발자를 도와주는 브라우저 확장 프로그램입니다.",
      imageAlt:
        "웹페이지의 요소들을 강조 표시하는 Accessibility Visualizer 확장 프로그램",
    },
    features: {
      title: "기능",
      items: {
        visual: {
          title: "시각적 요소",
          description: "이미지 대체 텍스트, 제목 수준, 폼 레이블 시각화",
        },
        detection: {
          title: "문제 감지",
          description: "경고 및 오류 표시로 접근성 문제 강조",
        },
        liveRegions: {
          title: "라이브 영역",
          description: "라이브 영역 알림을 시각적으로 표시",
        },
        customizable: {
          title: "사용자 정의 가능",
          description: "여러 요소 유형 및 사용자 정의 가능한 프리셋 지원",
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
      description:
        "Accessibility Visualizer를 효과적으로 사용하는 방법을 배워보세요",
      link: "GitHub에서 사용자 가이드 보기",
    },
    footer: {
      copyright: "© 2024 Accessibility Visualizer.",
      github: "GitHub에서 오픈소스로 공개됩니다",
    },
  },
};

export function getTranslation(locale: string): Translation {
  return translations[locale] || translations.en;
}
