---
title: Result
subtitle: 结果
description: 用于反馈一系列操作任务的处理结果。
group: 反馈
---

## 何时使用

当有重要操作需告知用户处理结果，且反馈内容较为复杂时使用。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/success.tsx">Success</code>
<code src="./demo/info.tsx">Info</code>
<code src="./demo/warning.tsx">Warning</code>
<code src="./demo/403.tsx">403</code>
<code src="./demo/404.tsx">404</code>
<code src="./demo/500.tsx">500</code>
<code src="./demo/error.tsx">Error</code>
<code src="./demo/customIcon.tsx">自定义 icon</code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| extra | 操作区 | ReactNode | - |  |
| icon | 自定义 icon | ReactNode | - |  |
| status | 结果的状态，决定图标和颜色 | `success`、 `error`、 `info`、 `warning`、 `404`、 `403`、 `500` | `info` |  |
| subTitle | subTitle 文字 | ReactNode | - |  |
| title | title 文字 | ReactNode | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
