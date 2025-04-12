---
category: Components
group: General
title: FloatButton
description: A button that floats at the top of the page.
demo:
  cols: 2
---

## When To Use

- For global functionality on the site.
- Buttons that can be seen wherever you browse.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx" iframe="360">Basic</code>
<code src="./demo/type.tsx" iframe="360">Type</code>
<code src="./demo/shape.tsx" iframe="360">Shape</code>
<code src="./demo/description.tsx" iframe="360">Description</code>
<code src="./demo/tooltip.tsx" iframe="360">FloatButton with tooltip</code>
<code src="./demo/group.tsx" iframe="360">FloatButton Group</code>
<code src="./demo/group-menu.tsx" iframe="360">Menu mode</code>
<code src="./demo/controlled.tsx" iframe="360">Controlled mode</code>
<code src="./demo/placement.tsx" iframe="380" version="">placement</code>
<code src="./demo/back-top.tsx" iframe="360">BackTop</code>
<code src="./demo/badge.tsx" iframe="360">badge</code>

## API

### common API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| badge | Attach Badge to FloatButton. `status` and other props related are not supported. | [BadgeProps](/components/badge#api) | - |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| description | Text and other | ReactNode | - |  |
| href | The target of hyperlink | string | - |  |
| htmlType | Set the original html `type` of `button`, see: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#type) | `submit`, `reset`, `button` | `button` |  |
| icon | Set the icon component of button | ReactNode | - |  |
| shape | Setting button shape | `circle`, `square` | `circle` |  |
| target | Specifies where to display the linked URL | string | - |  |
| tooltip | The text shown in the tooltip | ReactNode, () => ReactNode |  |  |
| type | Setting button type | `default`, `primary` | `default` |  |
| onClick | Set the handler to handle `click` event | (event) => void | - |  |

### FloatButton.Group

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| closeIcon | Customize close button icon | React.ReactNode | `<CloseOutlined />` |  |
| open | Whether the menu is visible or not, use it with trigger | boolean | - |  |
| placement | Customize menu animation placement | `top`, `left`, `right`, `bottom` | `top` |  |
| shape | Setting button shape of children | `circle`, `square` | `circle` |  |
| trigger | Which action can trigger menu open/close | `click`, `hover` | - |  |
| onClick | Set the handler to handle `click` event (only work in `Menu mode`) | (event) => void | - |  |
| onOpenChange | Callback executed when active menu is changed, use it with trigger | (open: boolean) => void | - |  |

### FloatButton.BackTop

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| duration | Time to return to top（ms） | number | 450 |  |
| target | Specifies the scrollable area dom node | () => HTMLElement | () => window |  |
| visibilityHeight | The BackTop button will not show until the scroll height reaches this value | number | 400 |  |
| onClick | A callback function, which can be executed when you click the button | () => void | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
