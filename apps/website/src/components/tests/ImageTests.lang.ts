export const en = {
  title: "Images",
  intro:
    "Images are a fundamental part of web content that must be accessible to users of assistive technologies such as screen readers. The following examples demonstrate various approaches to image accessibility, including both correct implementations and common mistakes.",
  sections: {
    imgElement: {
      title: "<img> element",
      desc: "The img element requires proper alternative text (alt) to be accessible.",
    },
    svgElement: {
      title: "<svg> element",
      desc: "Recently often used for icons. SVG elements can be made accessible using techniques including title elements, aria-label, and role attributes.",
    },
    roleImg: {
      title: 'role="img"',
      desc: 'Use role="img" to convey non-img elements as images. An accessible name must be provided using aria-label or aria-labelledby.',
    },
  },
  examples: {
    img: {
      withAlt: {
        title: "Image with alt text",
        desc: "Properly accessible image with descriptive alternative text. This is the correct way to make images accessible.",
      },
      withAltAndTitle: {
        title: "Image with alt and title",
        desc: "Image with both alt text and title attribute. The title attribute shows as a tooltip. Using tooltips can be problematic as users may not be aware of their existence or may not be able to see them at all.",
      },
      missingAlt: {
        title: "Image without alt attribute",
        desc: "❌ Missing alt attribute - this is problematic! Screen readers will announce the filename or 'image' instead of meaningful content.",
      },
      titleOnly: {
        title: "Image with title but no alt",
        desc: "❌ Alternative texts should be specified via alt attribute.",
      },
      decorativeEmptyAlt: {
        title: "Decorative image with empty alt",
        desc: "⚠️ Empty alt attribute indicates that the image does not contain any information. It is important to consider carefully wheter or not there is really any informaiton that users should know.",
      },
      decorativeEmptyAltWithTitle: {
        title: "Decorative image with empty alt and title",
        desc: "Decorative image marked properly with empty alt, assistive technologies may ingore it. However, the tooltip show by title attribute is only visible to mouse users, which is inappropriate.",
      },
      ariaHidden: {
        title: "Image with aria-hidden",
        desc: "Image hidden from assistive technologies using aria-hidden. This is another way to mark decorative images, though empty alt is more common.",
      },
    },
    svg: {
      withTitle: {
        title: "SVG with title element",
        desc: "⚠️ Using title element in svg element is the standard way to make SVG content accessible. But some screen readers and browsers may not support it well. It is better to set role to img.",
      },
      withTitleAndRole: {
        title: "SVG with title element and role=img",
        desc: "✅ Using title element to provide an accessible name and role=img to explicitly indicate it is an image. This makes it clear that the graphic is an image.",
      },
      noTitle: {
        title: "SVG without title element",
        desc: "❌ SVG without title or other accessibility attributes. Screen reader users cannot understand what this graphic represents.",
      },
      ariaHidden: {
        title: "SVG with aria-hidden",
        desc: "SVG hidden from assistive technologies. Use this for decorative graphics that don't convey any information.",
      },
      withAriaLabel: {
        title: "SVG with aria-label",
        desc: "⚠️ SVG with aria-label attribute. But some screen readers and browsers may not support it well. It is better to set role to img.",
      },
      withImgRole: {
        title: "SVG with img role",
        desc: "✅ SVG with explicit img role and aria-label. This clearly indicates the SVG is an image and provides its accessible name.",
      },
      withPresentationRole: {
        title: "SVG with presentation role",
        desc: "SVG marked as decorative using role='presentation'. This removes semantic meaning from the SVG.",
      },
    },
    roleImg: {
      withAriaLabel: {
        title: 'role="img" with aria-label',
        desc: "✅ Proper use of role='img' with descriptive aria-label. This technique is useful for text-based graphics or emoji.",
      },
      withoutAriaLabel: {
        title: 'role="img" without aria-label',
        desc: "❌ Missing accessible name. Screen readers may announce 'image' or read out the raw text characters, causing confusion.",
      },
    },
  },
} as const;

export const ja = {
  title: "画像",
  intro:
    "画像はスクリーンリーダーのような支援技術を使うユーザーにもアクセス可能である必要があります。以下では、適切な実装例とよくある間違いの双方を含む、画像アクセシビリティのさまざまな手法を示します。",
  sections: {
    imgElement: {
      title: "<img> 要素",
      desc: "img 要素は、アクセシブルにするために適切な代替テキスト（alt）が必要です。",
    },
    svgElement: {
      title: "<svg> 要素",
      desc: "最近はしばしばアイコンなどに使用されています。SVG は title 要素、aria-label、role 属性などの手法でアクセシブルにできます。",
    },
    roleImg: {
      title: 'role="img"',
      desc: 'img 以外の要素を画像として伝えるには role="img" を使用します。aria-label や aria-labelledby などでアクセシブルネームを付与しなければなりません。',
    },
  },
  examples: {
    img: {
      withAlt: {
        title: "alt テキスト付きの画像",
        desc: "説明的な代替テキストを持つ適切な実装例です。これは画像をアクセシブルにする正しい方法です。",
      },
      withAltAndTitle: {
        title: "alt と title を併用した画像",
        desc: "alt と title の両方を指定した例です。title はツールチップとして表示されます。ツールチップを使った情報の提示は、ユーザーがその存在に気付けなかったり、そもそも表示できなかったりと問題がつきものです。",
      },
      missingAlt: {
        title: "alt 属性のない画像",
        desc: "❌ alt が無いのは問題です。スクリーンリーダーはファイル名を読みあげたり、単に「画像」と読み上げたりして、意味のある内容が伝わりません。",
      },
      titleOnly: {
        title: "title のみで alt が無い画像",
        desc: "❌ 代替テキストは alt 属性によって指定するべきです。",
      },
      decorativeEmptyAlt: {
        title: "装飾目的で空の alt を持つ画像",
        desc: "⚠️ 空の alt はユーザーに伝えるべき情報がない画像であることを表現します。本当にユーザーに伝えるべき情報がないのかを、慎重に判断する必要があります。",
      },
      decorativeEmptyAltWithTitle: {
        title: "空の alt と title を併用した装飾画像",
        desc: "空の alt で装飾画像としてマークしているため、支援技術が無視することがあります。ツールチップが表示されることで、マウスのユーザーにだけ情報が伝わる状況であり、不適切です。",
      },
      ariaHidden: {
        title: "aria-hidden を用いた画像",
        desc: "aria-hidden で支援技術から非表示にする方法です。装飾画像には空の alt の方が一般的です。",
      },
    },
    svg: {
      withTitle: {
        title: "title 要素を持つ SVG",
        desc: "️⚠️ ️title 要素によりスクリーンリーダーへアクセシブルネームを提供できます。標準的な手法ですが、一部のスクリーンリーダーやブラウザでのサポートが不十分な場合があります。role を img に設定する方が望ましいです。",
      },
      withTitleAndRole: {
        title: "title 要素と role=img を持つ SVG",
        desc: "✅ title 要素によりアクセシブルネームを提供し、role=img により画像として扱うことを明示しています。図形が画像であることが明確になります。",
      },
      noTitle: {
        title: "title 要素のない SVG",
        desc: "❌ 要素や属性による名前付けの無い SVG。これが図形であることすらスクリーンリーダーのユーザーにはわかりません。",
      },
      ariaHidden: {
        title: "aria-hidden を持つ SVG",
        desc: "支援技術から隠す装飾的な図形に使用します。ユーザーに情報を伝えない場合に適します。",
      },
      withAriaLabel: {
        title: "aria-label を持つ SVG",
        desc: "⚠️ ️aria-label により title 要素を用いずにアクセシブルネームを提供できます。一部のスクリーンリーダーやブラウザでのサポートが不十分な場合があります。role を img に設定する方が望ましいです。",
      },
      withImgRole: {
        title: "role=img と aria-label を持つ SVG",
        desc: "✅ 明示的に画像として扱い、aria-label で名前を提供します。図形が画像であることが明確になります。",
      },
      withPresentationRole: {
        title: "role=presentation を持つ SVG",
        desc: "装飾として扱い、意味付けを取り除きます。",
      },
    },
    roleImg: {
      withAriaLabel: {
        title: 'role="img" と aria-label',
        desc: "✅ role='img' と説明的な aria-label の適切な使用例です。文字ベースのグラフィックや絵文字などに有用です。",
      },
      withoutAriaLabel: {
        title: 'role="img" かつ aria-label なし',
        desc: "❌ アクセシブルネームがありません。スクリーンリーダーは「画像」とだけ読み上げるかもしれせんし、テキストアート内の記号をそのまま読み上げるかもしれません。",
      },
    },
  },
} as const;
