# Accessibility Visualizer 사용자 가이드

## 사용하기에 앞서

우선 Accessibility Visualizer에 관심을 가져주셔서 정말 감사합니다.
Accessibility Visualizer는 웹 페이지의 접근성을 향상시키기 위해 중요하면서도 시각적으로는 표시되지 않는 정보를 가시화하는 것을 목적으로 제작된 브라우저 확장 기능입니다.
현재는 Google Chrome용으로 [Chrome 웹 스토어](https://chromewebstore.google.com/detail/accessibility-visualizer/idcacekakoknnpbfjcdhnkffgfbddnhk) Mozilla Firefox용으로[Firefox Add-ons](https://addons.mozilla.org/ja/firefox/addon/accessibility-visualizer/) 에서 배포하고 있습니다.

## Accessibility Visualizer에서 할 수 있는 것

- 이미지의 대체 텍스트, 헤딩 레벨, 폼 라벨링 등의 상황을 웹 페이지에 오버레이하여 표시할 수 있습니다
- 이 중 명백하게 문제가 있는 상태인 것, 주의 깊게 사용해야 할 것에 대해서는 경고문을 표시합니다
- `role="status"` `role="alert"` `role="log"` `aria-live`속성、 `<output>` 요소에 의해 생성되는 라이브리전의 변화를 시각적인 표시로 알립니다

지금까지 이들 정보는 브라우저의 개발자 도구에서 접근성 트리(접근성 객체 모델)를 읽거나 소스 코드를 읽거나 스크린 리더에서 실제로 조작하여 확인해 보는 것 외에 제대로 구현되고 있는지 확인할 방법이 없었습니다.

접근성 트리를 읽는 것도 소스 코드를 읽는 것도 기반 지식 필요합니다. 또한 스크린 리더는 대부분의 사람들에게 익숙하지 않고 독특한 조작 방법과 출력 내용을 이해하는데 어려움이 있습니다.
이러한 정보를 가시화하는 것으로 그러한 장벽을 없애고 누구나 코딩할 때나 동작을 확인할 때 접근성을 의식할 수 있도록 하는 것이 Accessibility Visualizer의 목적입니다.

주의: Accessibility Visualizer 는 스크린 리더 등의 ** 실제 보조기술을 통한 확인 작업을 완전히 불필요하게 만드는 것이 아닙니다**. Accessibility Visualizer가 표시하는 정보는 보조적인 것으로, 중대한 오류를 간과할 가능성이 있습니다. Web 개발의 작업 플로우에 도입할 경우, **스크린 리더에 의한 확인을 병용하실 것을 권장합니다**.

## Accessibilty Visualizer 사용법

Accessibility Visualizer 를 설치하면 확장기능 메뉴 내에 Accessibility Visualizer 항목이 추가됩니다.
자주 사용하실 경우 브라우저 툴바에 고정하시는 것이 좋습니다. 툴바에 고정 하시면 Accessibility Visualizer 아이콘이 항상 표시됩니다.

![확장기능 메뉴를 열어놓은 상태의 스크린샷](./images/extensions_menu.png)

확장기능 메뉴 내에 Accessibility Visualizer 항목 또는 툴바에 고정 표시한 Accessibility Visualizer 아이콘을 클릭하면 Accessibility Visualizer 팝업이 열립니다.

![Accessibility Visualizer 팝업창을 띄운 스크린샷](./images/a11y_visualizer_popup.png)

### 팁의 표시

팝업 내 '팁 보기' 체크박스에 체크하면 열람 중인 웹 페이지에 '팁'으로 다양한 정보가 표시됩니다.

![「코마루시」의 로고와, 「지구 온난화 방지과」의 헤딩. 로고는 녹색 점선으로 둘러싸여 'alt 속성이 없는 이미지'의 빨간색 팁이 씌워져 있다. 로고와 헤딩은 파란색 점선으로 둘러싸여 있고, 그 위에 "헤딩 레벨 1"의 파란색 팁과 "지구온난화방지과"의 초록색 팁이 표시되어 있다](./images/tip_example_komaru_city.png)

(스크린샷은 [駒瑠市〜アクセシビリティ上の問題の体験サイト〜 (코마루시 ~접근성상의 문제 체험 사이트~)](https://a11yc.com/city-komaru/) 의 [たいへんな駒瑠市(힘든 코마루시)](https://a11yc.com/city-komaru/practice/?preset=ng-terrible1&wcagver=22)에서 팁을 표시한 것)

팁을 표시하는 대상은 팝업 내 체크박스에서 변경할 수 있습니다. 특정 대상을 자세히 확인하거나 계속 표시하고 있으면 웹브라우징이 불편한 경우 체크를 해제하시면서 조절하시면 됩니다.

- 이미지
- 버튼
- 링크
- 입력 서식
- 헤딩
- aria-hidden

「팁의 불투명도」슬라이더로, 팁의 표시의 색의 농도를 조절할 수 있습니다. 표시가 방해되는 경우에는 불투명도를 낮춰 주세요.

## 라이브리전

팝업 내의 '라이브리전을 안내하기'선택 시, [ARIA 라이브 리전](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) 에 변화가 있을 경우, 해당 내용을 화면 중앙 부근에 나타냅니다.
이것은 스크린 리더와 같은 보조기술 사용자에게 화면에서 일어나는 상태 변화 등을 실시간으로 전달하기 위해서 사용되는 라이브리전의 기능을, 스크린 리더 등을 사용하지 않고 체험하고 동작을 확인하기 위한 기능입니다.

![브라우저 중앙에 크게 일본어로 「지금 다운로드!당신의 PC를 고속화!」라고 표시되고 있다](../ja/images/a11y_visualizer_live_region.png)

(스크린샷은 ['aria-live がうるさい (aria-live가 시끄럽다)' (ARIA-Barriers)](https://shuaruta.github.io/ARIA-Barriers/2023/12/22/aria-live.html) 에서 공지사항을 표시한 것)

라이브리전은 그 글자 수가 많을수록 장시간 표시되게 되어 있습니다.
팝업 내에서 1자 당 초수와 안내 방송의 최장 길이를 변경할 수 있게 되어 있습니다. 라이브리전의 안내가 방해되는 경우에는 각각의 수치를 작게 조정해 주세요.
또한 라이브리전의 표시 색의 농도도 변경할 수 있습니다.

## 사용상의 주의점

- 팁의 표시 위치는 자주 어긋날 수 있습니다. 이 경우 팝업 내의 '다시보기' 버튼을 눌러주세요.
- 팁이나 라이브리전 안내를 표시하고 있으면 동작이 느려지는 웹 사이트가 있습니다. 이러한 사이트의 경우 「팁을 표시」 「라이브리전 안내하기」의 체크를 해제해 주세요.
  - 일부 동작이 느려지는 사이트에 대해서는, 확장 기능의 개발자측에서 동작하지 않도록 할 경우가 있습니다.
- 프레임을 사용하고 있는 부분에서는 기술적인 제약으로 라이브리전 기능을 지원하지 못할 수 있습니다.

## 팁으로 표시되는 정보의 상세 안내

여기에서는 팁으로 표시되는 정보에 대해 확인해야 할 포인트를 간단히 설명합니다.

팁에는 다음과 같은 종류가 있습니다

- 이름: 녹색으로 사람 모양 아이콘과 함께 표시됩니다. 내용이 적절한지 누락되지 않았는지 확인해 주세요.
- 설명: 회색으로 서류 아이콘과 함께 표시됩니다. 내용이 적절한지 누락되지 않았는지 확인해 주세요.
- 헤딩: 파란색으로 책갈피 아이콘과 함께 표시됩니다. 헤딩 레벨이 논리적으로 알맞게 사용되었는지 확인해 주세요.
- Landmark: Displayed in yellow-green with a flag icon. Check if the landmark role is appropriate
- 경고: 노란색으로 경고의 삼각형 아이콘과 함께 표시됩니다. 문제가 있을지도 모르는 부분을 나타내고 있습니다.
- 오류: 빨간색으로 오류 삼각형 아이콘과 함께 표시됩니다. 확실히 문제가 있는 부분을 나타내고 있습니다.
- 롤: 핑크색으로 꼬리표 아이콘과 함께 표시됩니다.
- 요소: 보라색으로, HTML 태그를 본뜬 `</>` 의 아이콘과 함께 표시됩니다.

"이름"은 "[접근 가능한 이름 (Accessible Name)](https://developer.mozilla.org/ko/docs/Glossary/Accessible_name) ", "설명"은 "[접근 가능한 설명 (Accessible Description)](https://developer.mozilla.org/en-US/docs/Glossary/Accessible_description)" 의 값이 표시됩니다. 이들은 스크린 리더 등의 보조기술 사용자가 그 요소를 인식하기 위해 사용되는 정보입니다.

### 이미지

「이미지」선택 시, `<img>`요소, `<svg>` 요소, `role="img"` 속성을 가지는 요소에 대해서 팁을 표시합니다.

- 이름 팁에서 대체 텍스트(alt 텍스트)가 표시됩니다
  - 이미지의 대체 텍스트는, 이미지 대신에 표시되어도 같은 정보가 전달되어야 하는 내용으로, 간결한 설명으로 제공하는 것이 바람직합니다.
  - `<img>`요소의 경우 보통 `alt` 속성이 사용되며 `<img>` 제공 시 해당 속성 자체는 반드시 들어가야합니다. (없는 경우 스크린 리더가 이미지의 경로를 읽게 됩니다.)
  - `<svg>` 요소의 경우, `<title>` 요소나 `aria-label` 속성、 `aria-labelledby` 속성이 사용되는 경우가 있습니다
  - 'role="img"'속성을 가지는 요소의 경우, 'aria-label' 속성、 `aria-labelledby` 속성이 사용되는 경우가 있습니다
- `<img>` 요소로 `alt=""`(alt속성이 공백)인 경우에는, 「alt=""의 이미지」이라고 하는 경고 팁이 표시됩니다. 이 상태의 이미지는 스크린 리더 등의 보조 기술에서 장식용 이미지로 판정하여 읽지 않기 때문에 실제 사용자는 이 이미지가 있는지 알 수 없습니다. **이 이미지가 장식 목적으로 배치된 경우 이외에는 대체 텍스트를 반드시 제공해 주세요.**
- 대체 텍스트가 제공되지 않고, 'aria-hidden' 또는 'alt=""`도 아닌 경우, **「alt 속성이 없는 이미지」 또는 「이름(라벨) 없음」으로 에러 팁**이 표시됩니다. 이 경우는 **수정이 필요합니다**

### 버튼

「버튼」선택 시, `<button>`요소, 「type」 속성이 `button` `submit` `reset` `image` 의 `<input>` 요소, `role="button"` 속성을 가지는 요소에 대해서 팁을 표시합니다.

- 이름의 팁으로 버튼 라벨이 표시됩니다. 누락의 유무나 적절한 버튼명이 제공되고 있는지 확인해 주세요.
- 이름이 주어지지 않은 경우, **「이름(라벨) 없음」의 에러 팁**이 표시됩니다. 이 경우에는 스크린 리더 등의 보조기술로는 버튼의 의미 및 동작, 기능을 예측할 수 없습니다. **수정이 필요합니다**
- 'role="button"' 속성을 가진, 표준에서는 포커스 할 수 없는 요소로, 'tabindex' 속성이 지정되어 있지 않은 경우, **「포커싱 불가(키보드 접근 불가)」의 에러 팁**이 표시됩니다. 이 상태에서는 키보드로 조작할 수 없기 때문에 **수정이 필요합니다**

### 링크

「링크」선택 시, 「`<a>`」 요소, `<area>` 요소, `role="link"` 속성을 가진 요소에 대해 팁을 표시합니다.

- 이름의 팁으로 링크 텍스트가 표시됩니다. 누락의 유무나 적절한 링크 텍스트가 제공되는지 확인해 주세요.
- 링크의 이름이 비어 있는 경우, **「이름(라벨) 없음」의 에러 팁**이 표시됩니다. 이 경우는 스크린 리더 등의 보조기술로는 링크의 목적을 알 수 없습니다. **수정이 필요합니다**
- `<a>` 요소나 `<area>` 요소에 `href` 속성이 없는 경우 브라우저는 링크로 취급하지 않아 키보드로 접근할 수 없습니다. `href 속성 없음` 경고 팁이 표시됩니다. 이 상태의 요소에 클릭 등에 의한 인터랙션이 설정되어 있는 경우, 키보드 조작을 할 수 없거나 스크린 리더 등의 지원기술의 사용자가 조작 대상임을 인식할 수 없기에 **이 경우 반드시 href 속성이 제공되도록 수정하셔야 합니다.**

### 입력 서식

「입력」선택 시, `type` 속성이 `hidden` `button` `submit` `reset` `image` 이외의 `<input>` 요소, `<textarea>` 요소, `<select>` 요소, `<label>` 요소, `<fieldset>` 요소, 'role' 속성에 'textbox' `combobox` `checkbox` 'radio' 'switch' 'menuitemcheckbox' 'menuitemradio' 중 하나가 지정되어 있는 요소에 대해 팁을 표시합니다.

- 이름의 팁으로 입력 서식의 라벨이 표시됩니다. 누락의 유무나 적절한 라벨이 되어 있는지를 확인해 주세요.
  - `<input>` `<select>` `<textarea>` 요소에는 해당 요소의 id와 연결된 `<label>` 요소가 제공되어야 합니다.
- 이름이 주어지지 않은 경우, **「이름(라벨) 없음」의 에러 팁**이 표시됩니다. 이 경우는 스크린 리더 등의 보조기술로는 입력 서식의 목적을 알 수 없습니다. **수정이 필요합니다**
- 표준으로는 포커스 할 수 없는 요소로, 'tabindex' 속성이 지정되어 있지 않은 경우, **「포커싱 불가(키보드 접근 불가)」의 에러 팁**이 표시됩니다. 이 상태에서는 키보드로 조작할 수 없기 때문에, **반드시 수정하셔야 합니다.**
- 라디오 버튼(`<input type="radio">`) 에서, 같은 'name' 속성이 없는 경우에는, **「name 속성 없음」의 에러 팁**이, 같은 `<form>` 요소내 또는 같은 문서내에 같은 「name」 속성을 가지는 라디오 버튼이 없는 경우에는, **「라디오 버튼 그룹 없음」의 에러 팁**이 표시됩니다. 이들은 라디오 버튼의 그룹화가 되어 있지 않고 키보드 조작으로 선택을 할 수 없거나 Tab 키로 이동을 예측할 수 없기 때문에 결과적으로 어떤 라디오 버튼이 같은 그룹인지를 인식하지 못할 우려가 있습니다. **수정이 필요합니다**
- `<label>` 요소에서 관련된 입력 서식이 존재하지 않거나 숨겨진 경우에는 **'입력 서식 없는 라벨' 경고 팁** 이 표시됩니다. 특히 체크박스나 라디오 버튼 등에 스타일을 맞추기 위해 숨긴 경우 키보드로 조작할 수 없을 가능성이 높아집니다. `display:none`, `visibility:hidden` 등을 입력 서식에 적용하지 않았는지**확인해주세요**

### 헤딩

「헤딩」선택 시, `<h1>` 에서 `<h6>` 요소와, `role="heading"` 속성을 가지는 요소에 대해서 팁을 표시합니다.

- 헤딩 레벨의 팁으로 헤딩 레벨이 표시됩니다.적절한 레벨 순서대로 제공되고 있는지, `<h1>`이 중복으로 제공되고 있는지 등을 확인해 주세요.
  - `<h1>` 에서 `<h6>` 요소는 헤딩의 레벨을 나타내기 위해 사용됩니다
  - 'role="heading"' 속성을 가진 요소에서는 헤딩의 레벨을 나타내기 위해서 'aria-level' 속성이 기술되어야 합니다.
- 'role="heading"' 속성을 가진 요소로, `aria-level` 속성이 존재하지 않는 경우, **「헤딩 레벨 없음」의 에러 팁**이 표시됩니다. 이 경우는 스크린 리더 등의 보조기술로 헤딩 레벨을 알 수 없습니다. **수정이 필요합니다**
- 이름의 팁으로 헤딩 텍스트가 표시됩니다. 누락의 유무나 적절한 텍스트가 되어 있는지 확인해 주세요.
- 헤딩에 이름이 주어지지 않은 경우, **「이름(라벨) 없음」의 에러 팁**이 표시됩니다. 이 경우는 스크린 리더 등의 보조기술로는 헤딩를 알 수 없습니다. **수정이 필요합니다**

### Sections

When "Sections" is checked, tips are displayed for `<article>` elements, `<section>` elements, `<nav>` elements, `<aside>` elements, `<main>` elements, `<form>` elements, `<search>` elements, and elements whose role attribute specifies `article`, `banner`, `complementary`, `contentinfo`, `main`, `form`, `navigation`, `region`, `search`, or `application`.

These elements are used to divide the content of the page into sections, and these helps users of assistive technologies such as screen readers to understand the page structure, and to skip some unnecesary contents.

- The landmark tip displays the landmark role. Please check if the landmark role is appropriate
- The name tip displays the section label if accesible name has been given by some ways. If it is displayed, please check if the content is appropriate, if there are any omissions, and if there are any other landmarks that has same name and same role.

### aria-hidden

「aria-hidden」선택 시, `aria-hidden="true"` 속성을 가진 요소에 대해 팁을 표시합니다.

- 경고의 팁으로, `aria-hidden="true"` 속성이 존재하는 것으로 표시됩니다. 이 속성이 지정되어 있는 요소는 스크린 리더 등의 보조기술에서 탐색되지 않기 때문에 사용자는 해당 요소가 제공되는지 알 수 없습니다. 화면에 표시되어 있어 사용자가 알 수 있는 정보가 제공되면서도 `aria-hidden="ture"` 가 선언되어 있는 요소는 스크린 리더 등의 보조기술 사용자만 그 정보를 제공받지 못하게 됩니다. 장식목적의 요소 이외에 시각적으로 제공되는 정보에 `aria-hidden` 이 선언되어 있는 요소가 있을 경우 **수정이 필요합니다**
