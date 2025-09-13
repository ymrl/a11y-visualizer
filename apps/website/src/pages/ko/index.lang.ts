const dict = {
  subtitle: "간단하고 '보이는' 웹 접근성",
  hero: {
    title: "웹 접근성을 시각화",
    description:
      "스크린 리더 등 보조 기술 사용자가 인식하는 정보를 Chrome과 Firefox에서 쉽게 확인할 수 있는 확장 프로그램입니다.",
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
        description:
          "스크린 리더 등 보조 기술에 동적으로 전달되는 정보를 시각적으로 표시",
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
    description: "Accessibility Visualizer 사용 방법을 배워보세요",
    link: "사용자 가이드 보기",
    url: "/a11y-visualizer/docs/ko/UsersGuide",
  },
  tests: {
    title: "테스트 페이지",
    description:
      "Accessibility Visualizer의 동작을 확인하기 위해 다양한 구현 예제를 준비했습니다",
    link: "테스트 페이지로 이동",
    url: "/a11y-visualizer/tests",
  },
} as const;

export default dict;
