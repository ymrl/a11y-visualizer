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
      title: "Visible Web Accessibility",
      description:
        "A browser extension that makes it easy to check web accessibility issues that were previously only visible through assistive technologies like screen readers.",
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
            "Highlight markup issues with warning and error indicators",
        },
        liveRegions: {
          title: "Live Regions",
          description: "Display live region announcements visually",
        },
        customizable: {
          title: "Customizable",
          description:
            "Customize element types and display methods to match your website",
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
    subtitle: "かんたんに「見える」Webアクセシビリティ",
    description:
      "Webページの上にアクセシビリティに関係する注釈を表示し、開発者を支援するブラウザ拡張機能です。",
    hero: {
      title: "「見える」Webアクセシビリティ",
      description:
        "これまではスクリーンリーダーなどの支援技術でしか確認できなかったWebアクセシビリティの問題を、簡単に確認できるブラウザ拡張機能です。",
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
          description: "警告やエラー表示でマークアップの問題をハイライト",
        },
        liveRegions: {
          title: "ライブリージョン",
          description: "ライブリージョンのアナウンスを視覚的に表示",
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
      title: "'보이는' 웹 접근성",
      description:
        "지금까지 스크린 리더와 같은 보조 기술로만 확인할 수 있었던 웹 접근성 문제를 쉽게 확인할 수 있는 브라우저 확장 프로그램입니다.",
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
          description: "경고 및 오류 표시로 마크업 문제 강조",
        },
        liveRegions: {
          title: "라이브 영역",
          description: "라이브 영역 알림을 시각적으로 표시",
        },
        customizable: {
          title: "사용자 정의 가능",
          description: "대상 웹사이트에 맞춰 요소 유형과 표시 방법을 사용자 정의",
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
        "Accessibility Visualizer 사용 방법을 배워보세요",
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
