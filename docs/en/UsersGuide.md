# Accessibility Visualizer User's Guide

## Introduction

Thank you for your interest in Accessibility Visualizer.
Accessibility Visualizer is a browser extension that aims to visualize important but visually invisible information to improve the accessibility of web pages.
It is currently distributed for Google Chrome at [Chrome Web Store](https://chromewebstore.google.com/detail/accessibility-visualizer/idcacekakoknnpbfjcdhnkffgfbddnhk) and for Mozilla Firefox at [Firefox Add-Ons](https://addons.mozilla.org/ja/firefox/addon/accessibility-visualizer/).

## What you can do with Accessibility Visualizer

- Image alt text, heading levels, form labeling, and other situations can be displayed overlays on web pages
- A warning message will be displayed for any of these that are clearly problematic or should be used with caution.
- `role="status"` `role="alert"` `role="log"` `aria-live` attribute, to notify visually of changes in the live region created by the `<output>` element To do

Until now, this information has only been available through reading the accessibility tree (Accessibility Object Model) in the browser's developer tools, reading the source code, or actually interacting with it using a screen reader.

Knowledge is required to decipher the accessibility tree and the source code. Screen readers are unfamiliar to most people, and their unique controls can be confusing.
The goal of Accessibility Visualizer is to visualize this information to eliminate these barriers and enable everyone to be aware of accessibility when coding or checking operation.

Note: Accessibility Visualizer does not completely eliminate the need for actual assistive technology verification, such as screen readers. The information Accessibility Visualizer displays is supplementary and may cause you to miss important issues. **We recommend using screen reader confirmation** to incorporate it into your web development workflow.

## How to use Accessibility Visualizer

After installing Accessibility Visualizer, an Accessibility Visualizer item will appear in the extension menu.
If you use it often, we recommend pinning it to your browser's toolbar. If you pin it to the toolbar, the Accessibility Visualizer icon will always be displayed.

![Screenshot of extensions menu open](./images/extensions_menu.png)

When you click the Accessibility Visualizer item in the extension menu or the Accessibility Visualizer icon pinned to the toolbar, the Accessibility Visualizer pop-up opens.

![Screenshot of Accessibility Visualizer popup opened](./images/a11y_visualizer_popup.png)

### Tip display

If you check the "Show tips" checkbox in the popup, various information will be displayed as a "tip" on the web page you are viewing.

!["Komaru City" logo and the heading "Global Warming Prevention Division." The logo is surrounded by a green dotted line and covered by a red chip that says ``Image without alt attribute.'' The logo and headline are surrounded by a blue dotted line, and above them are a blue tip for ``Heading level 1'' and a green tip for ``Global Warming Prevention Division''](./images/tip_example_komaru_city.png)

(The screenshots is from [たいへんな駒瑠市 (Very difficult Komaru City)](https://a11yc.com/city-komaru/practice/?preset=ng-terrible1&wcagver=22) of [駒瑠市〜アクセシビリティ上の問題の体験サイト〜 (Komaru City - Experience site for accessibility issues -)](https://a11yc.com/city-komaru/))

You can change the target for which tips are displayed using the checkboxes in the popup. If you want to check a specific target in detail, or if you find it difficult to browse the web if it is left open, uncheck it and make adjustments.

- image
- button
- Link
- form controls
- Heading
- aria-hidden

The "Tips opacity" slider allows you to adjust the color intensity of the tip display. If the display is distracting, lower the opacity.

## Live region announcement

When "Announce live regions" was checked in the popup, there was a change in [ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) The content will now be displayed near the center of the screen.
This is a function that allows users of assistive technology such as screen readers to experience and check the operation of the live region function, which is used to inform users of changes in screen status, etc., without using screen readers. .

![A large message "Download now! Speed up your PC!" is displayed in the center of the browser](../ja/images/a11y_visualizer_live_region.png)

(The screenshot is from ["aria-live がうるさい (aria-live is noisy)" (ARIA-Barriers)](https://shuaruta.github.io/ARIA-Barriers/2023/12/22/aria-live.html), which displays the announcement. )

The longer the number of characters in a live region announcement, the longer it will be displayed.
Within the popup, you can now change the number of seconds per character and the maximum length of the announcement. If live region announcements are a nuisance, please adjust each value to a smaller value.
You can also change the color intensity of live region announcements.

## Usage notes

- The display position of the tip may sometimes shift. In that case, please press the "Refresh" button in the popup
- There are some websites that slow down when displaying tips or announcements. When viewing such sites, please uncheck "Show tip" and "Announce live region".
- For some sites that are unavoidably slow, extension developers may take measures to prevent them from working.
- Live region announcements may not be possible due to technical limitations where frames are used.

## Tip display details

Here we briefly explain the points you should check regarding the information displayed on the tip.

There are following types of tips

- Name: Appears in green with a humanoid icon. Please check that the content is appropriate and that there are no omissions.
- Description: Appears in gray with a document icon. Please check that the content is appropriate and that there are no omissions.
- Heading: Displayed in blue with a bookmark icon. Check if the heading level is appropriate
- Landmark: Displayed in yellow-green with a flag icon. Check if the landmark role is appropriate
- Warning: Displayed in yellow with a warning triangle icon. Indicates where there may be a problem
- Error: Displayed in red with an error triangle icon. Definitely indicates where the problem is
- Role: pink and displayed with a tag icon
- Element: Purple and displayed with a `</>` icon that mimics an HTML tag

"Name" is "[Accessible Name](https://developer.mozilla.org/en-US/docs/Glossary/Accessible_name)" and "Description" is "[Accessible Description](https://developer.mozilla.org/en-US/docs/Glossary/Accessible_description)" value is displayed. These are pieces of information that help users of assistive technologies, such as screen readers, recognize the element.

### Images

When "Images" is checked, tips are displayed for `<img>` elements, `<svg>` elements, and elements with the `role="img"` attribute.

- So-called alternative text (alt text) is displayed in the name tip
  - Image alt text should be a concise description that conveys much of the same information even if the image were displayed instead.
  - For `<img>` elements, the `alt` attribute is usually used
  - For `<svg>` element, `<title>` element, `aria-label` attribute, `aria-labelledby` attribute may be used
  - For elements with `role="img"` attribute, `aria-label` attribute, `aria-labelledby` attribute may be used
- If `alt=""` is specified in the `<img>` element, a warning tip "Image with alt="" will be displayed. Images in this state cannot be perceived by assistive technologies such as screen readers. **Please provide alt text unless this image is placed for decorative purposes**
- If no alternative text is specified and it is not `aria-hidden` or `alt=""`, the error tip `Image without alt attribute'' or `No name (label)'' will be displayed. . In this case, **Modification is required**

### Buttons

When "Buttons" is checked, tips are displayed for`<button>` element, `<input>` element with `type` attribute of `button` `submit` `reset` `image`, and any elements with `role="button"` attribute.

- The name tip displays the button label. Please check if there are any omissions or if the labels are appropriate.
- If no name is given, a **``No name (label)'' error tip** will be displayed. In this case, assistive technologies such as screen readers cannot predict the behavior of the button. **Modification required**
- If the element has the `role="button"` attribute and is not focusable by default, and the `tabindex` attribute is not specified, a **``Unfocusable'' error tip** will be displayed. In this state, you cannot operate with the keyboard, so **Modification is required**

### Links

When "Links" is checked, tips are displayed for `<a>` elements, `<area>` elements, and elements with the `role="link"` attribute.

- The text of the link will be displayed in the name tip. Please check if there are any omissions or if the text is appropriate.
- If the link name becomes empty, a **"No name (label)" error tip** will be displayed. In this case, assistive technologies such as screen readers cannot perceive the purpose of the link. **Modification required**
- If the `<a>` or `<area>` element does not have the `href` attribute, the browser will not treat it as a link. You will see a warning tip with "No href attribute". If an interaction such as clicking is set for the `<a>` element in this state, keyboard operations may not be possible, or users of assistive technology such as screen readers may not be able to recognize that it is the target of the operation. **In that case, modification is required**

### Form controls

When "Form controls" is checked, tips are displayed for `<input>` elements whose `type` attribute is `hidden` `button` `submit` `reset` `image`, `<textarea>` elements, `<select>` elements, `<label>` elements, `<fieldset>` elements, and elements whose `role` attribute specifies `textbox`, `combobox`, `checkbox`, `radio`, `switch`, `menuitemcheckbox` or `menuitemradio` .

- Name tip displays form control labels. Please check if there are any omissions or if the labels are appropriate.
  - Typically, the `<label>` element is used for the `<input>` `<select>` `<textarea>` element
- If no name is given, a **``No name (label)'' error tip** will be displayed. In this case, assistive technologies such as screen readers cannot perceive the purpose of the form control. **Modification required**
- If the element is not focusable by default and the `tabindex` attribute is not specified, a **``Unfocusable'' error tip** will be displayed. In this state, you cannot operate with the keyboard, so **Modification is required**
- If the radio button (`<input type="radio">`) does not have the same `name` attribute, a **"No name attribute" error tip** will be displayed. If there are no radio buttons with the same `name` attribute in the same `<form>` element or the same document, a **"No radiobutton group" error tip** will be displayed. These are not grouped as radio buttons, so users cannot select them with the keyboard or predict movement with the Tab key, and users may not be able to recognize which radio buttons are in the same group. **Modification required**
- If `<label>` element does not have an associated form control or is hidden, a **"No control for label" warning tip** will be displayed. Especially when hidden for styling checkboxes or radio buttons, the possibility of not being able to operate with the keyboard is high. **Please check**

### Headings

When "Headings" is checked, tips are displayed for elements `<h1>` to `<h6>` and elements with the `role="heading"` attribute.

- The heading level tip displays the heading level. Please make sure it is at the appropriate level.
  - `<h1>` to `<h6>` elements are used to indicate heading levels
  - Elements with the `role="heading"` attribute use the `aria-level` attribute to indicate the heading level
- If an element has the `role="heading"` attribute and the `aria-level` attribute does not exist, a **``No heading level'' error tip** will be displayed. In this case, assistive technologies such as screen readers cannot perceive the level of the heading. **Modification required**
- The name tip displays the heading text. Please check if there are any omissions or if the text is appropriate.
- If a heading is not given a name, a ``No name (label)'' error tip will be displayed. In this case, assistive technologies such as screen readers will not be able to perceive the heading. **Modification required**

### Sections

When "Sections" is checked, tips are displayed for `<article>` elements, `<section>` elements, `<nav>` elements, `<aside>` elements, `<main>` elements, `<form>` elements, `<search>` elements, and elements whose role attribute specifies `article`, `banner`, `complementary`, `contentinfo`, `main`, `form`, `navigation`, `region`, `search`, or `application`.

These elements are used to divide the content of the page into sections, and these helps users of assistive technologies such as screen readers to understand the page structure, and to skip some unnecesary contents.

- The landmark tip displays the landmark role. Please check if the landmark role is appropriate
- The name tip displays the section label if accesible name has been given by some ways. If it is displayed, please check if the content is appropriate, if there are any omissions, and if there are any other landmarks that has same name and same role.

### aria-hidden

When "aria-hidden" is checked, tips are displayed for elements with the `aria-hidden="true"` attribute.

- A warning tip indicates that the `aria-hidden="true"` attribute is present. Elements with this attribute are invisible to users of assistive technologies such as screen readers. If there is information displayed on the screen that the user can perceive, but `aria-hidden="true"` is specified, only users of assistive technology such as screen readers will not be able to perceive that information. If there is an element that is visually visible but marked as `aria-hidden` except for decorative elements, **needs modification**
