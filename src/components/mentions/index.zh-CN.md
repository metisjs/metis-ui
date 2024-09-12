---
category: Components
group: 数据录入
title: Mentions
subtitle: 提及
description: 用于在输入中提及某人或某事。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*e4bXT7Uhi9YAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*pxR2S53P_xoAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用

用于在输入中提及某人或某事，常用于发布、聊天或评论功能。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本使用</code>
<code src="./demo/variant.tsx">形态变体</code>
<code src="./demo/async.tsx">异步加载</code>
<code src="./demo/form.tsx">配合 Form 使用</code>
<code src="./demo/prefix.tsx">自定义触发字符</code>
<code src="./demo/readonly.tsx">无效或只读</code>
<code src="./demo/placement.tsx">向上展开</code>
<code src="./demo/allow-clear.tsx">带移除图标</code>
<code src="./demo/auto-size.tsx">自动大小</code>
<code src="./demo/status.tsx">自定义状态</code>

## API

### Mentions

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 可以点击清除图标删除内容 | boolean \| { clearIcon?: ReactNode } | false |  |
| autoFocus | 自动获得焦点 | boolean | false |  |
| autoSize | 自适应内容高度，可设置为 true \| false 或对象：{ minRows: 2, maxRows: 6 } | boolean \| object | false |  |
| defaultValue | 默认值 | string | - |  |
| filterOption | 自定义过滤逻辑 | false \| (input: string, option: OptionProps) => boolean | - |  |
| getPopupContainer | 指定建议框挂载的 HTML 节点 | () => HTMLElement | - |  |
| notFoundContent | 当下拉列表为空时显示的内容 | ReactNode | `Not Found` |  |
| placement | 弹出层展示位置 | `top` \| `bottom` | `bottom` |  |
| prefix | 设置触发关键字 | string \| string\[] | `@` |  |
| split | 设置选中项前后分隔符 | string | ` ` |  |
| status | 设置校验状态 | 'error' \| 'warning' | - |  |
| validateSearch | 自定义触发验证逻辑 | (text: string, props: MentionsProps) => void | - |  |
| value | 设置值 | string | - |  |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` | `outlined` |  |
| onBlur | 失去焦点时触发 | () => void | - |  |
| onChange | 值改变时触发 | (text: string) => void | - |  |
| onClear | 按下清除按钮的回调 | () => void | - |  |
| onFocus | 获得焦点时触发 | () => void | - |  |
| onResize | resize 回调 | function({ width, height }) | - |  |
| onSearch | 搜索时触发 | (text: string, prefix: string) => void | - |  |
| onSelect | 选择选项时触发 | (option: OptionProps, prefix: string) => void | - |  |
| options | 选项配置 | [Options](#option) | [] |  |
| className | 语义化结构 class | string \| Record<'root' \| 'textarea' \| 'popup', string> | - |  |

### Mentions 方法

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

### Option

| 参数      | 说明           | 类型                | 默认值 |
| --------- | -------------- | ------------------- | ------ |
| value     | 选择时填充的值 | string              | -      |
| label     | 选项的标题     | React.ReactNode     | -      |
| key       | 选项的 key 值  | string              | -      |
| disabled  | 是否可选       | boolean             | -      |
| className | css 类名       | string              | -      |
| style     | 选项样式       | React.CSSProperties | -      |

### Mention.getMentions

```tsx
interface MentionsConfig {
  prefix?: string | string[];
  split?: string;
}

interface MentionsEntity {
  prefix: string;
  value: string;
}

type getMentions: (value: string, config?: MentionsConfig) => MentionsEntity[];
```
