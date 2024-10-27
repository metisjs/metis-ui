---
group: 数据展示
title: List
subtitle: 列表
description: 最基础的列表展示，可承载文字、列表、图片、段落。
---

## 何时使用

最基础的列表展示，可承载文字、列表、图片、段落，常用于后台数据展示页面。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基础列表</code>
<code src="./demo/remote-load.tsx">加载远程数据</code>
<code src="./demo/scroll-load.tsx">滚动加载</code>

## API

### List

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bordered | 是否展示边框 | boolean | false |  |
| dataSource | 列表数据源 | any\[] | - |  |
| footer | 列表底部 | ReactNode | - |  |
| grid | 列表栅格配置 | [object](#list-grid-props) | - |  |
| header | 列表头部 | ReactNode | - |  |
| itemLayout | 设置 `List.Item` 布局，设置成 `vertical` 则竖直样式显示，默认横排 | string | - |  |
| loading | 当卡片内容还在加载中时，可以用 `loading` 展示一个占位 | boolean \| [object](/components/spin-cn#api) ([更多](https://github.com/ant-design/ant-design/issues/8659)) | false |  |
| loadMore | 加载更多 | ReactNode | - |  |
| locale | 默认文案设置，目前包括空数据文案 | object | {emptyText: `暂无数据`} |  |
| pagination | 对应的 `pagination` 配置，设置 false 不显示 | boolean \| object | false |  |
| renderItem | 当使用 dataSource 时，可以用 `renderItem` 自定义渲染列表项 | (item) => ReactNode | - |  |
| rowKey | 当 `renderItem` 自定义渲染列表项有效时，自定义每一行的 `key` 的获取方式 | `keyof` T \| (item: T) => `React.Key` | `"key"` |  |
| size | list 的尺寸 | `default` \| `large` \| `small` | `default` |  |
| split | 是否展示分割线 | boolean | true |  |

### List.Item

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actions | 列表操作组，根据 `itemLayout` 的不同，位置在卡片底部或者最右侧 | Array&lt;ReactNode> | - |  |
| classNames | 语义化结构 className | [`Record<actions \| extra, string>`](#semantic-dom) | - | 5.18.0 |
| extra | 额外内容，通常用在 `itemLayout` 为 `vertical` 的情况下，展示右侧内容; `horizontal` 展示在列表元素最右侧 | ReactNode | - |  |
| styles | 语义化结构 style | [`Record<actions \| extra, CSSProperties>`](#semantic-dom) | - | 5.18.0 |

### List.Item.Meta

| 参数        | 说明               | 类型      | 默认值 | 版本 |
| ----------- | ------------------ | --------- | ------ | ---- |
| avatar      | 列表元素的图标     | ReactNode | -      |      |
| description | 列表元素的描述内容 | ReactNode | -      |      |
| title       | 列表元素的标题     | ReactNode | -      |      |
