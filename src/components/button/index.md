---
nav:
  title: 组件
  order: 1
title: Button
subtitle: 按钮
group:
  title: 通用
  order: 0
---

按钮用于开始一个即时操作。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">按钮类型</code>
<code src="./demo/icon.tsx">图标按钮</code>
<code src="./demo/size.tsx">按钮尺寸</code>
<code src="./demo/disabled.tsx">不可用状态</code>
<code src="./demo/loading.tsx">加载中状态</code>
<code src="./demo/ghost.tsx">幽灵按钮</code>
<code src="./demo/danger.tsx">危险按钮</code>

## API

通过设置 Button 的属性来产生不同的按钮样式，推荐顺序为：`type` -> `shape` -> `size` -> `loading` -> `disabled`。

按钮的属性说明如下：

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| danger | 设置危险按钮 | boolean | false |  |
| disabled | 按钮失效状态 | boolean | false |  |
| ghost | 幽灵属性，使按钮背景透明 | boolean | false |  |
| href | 点击跳转的地址，指定此属性 button 的行为和 a 链接一致 | string | - |  |
| htmlType | 设置 `button` 原生的 `type` 值，可选值请参考 [HTML 标准](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type) | string | `button` |  |
| icon | 设置按钮的图标组件 | ReactNode | - |  |
| loading | 设置按钮载入状态 | boolean \| { delay: number } | false |  |
| shape | 设置按钮形状 | `default` \| `round` | 'default' |  |
| size | 设置按钮大小 | `large` \| `middle` \| `small` | `middle` |  |
| target | 相当于 a 链接的 target 属性，href 存在时生效 | string | - |  |
| type | 设置按钮类型 | `primary` \| `link` \| `text` \| `default` | `default` |  |
| onClick | 点击按钮时的回调 | (event) => void | - |  |

支持原生 button 的其他所有属性。
