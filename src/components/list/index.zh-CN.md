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
<code src="./demo/virtual-list.tsx">大数据，虚拟渲染</code>

## API

### List

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bordered | 是否展示边框 | boolean | false |  |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| dataSource | 列表数据源 | any\[] | - |  |
| footer | 列表底部 | ReactNode | - |  |
| header | 列表头部 | ReactNode | - |  |
| lazyLoad | 滚动加载，仅使用 `request` 配置时有效 boolean | false |  |  |
| loading | 当卡片内容还在加载中时，可以用 `loading` 展示一个占位 | boolean、 [object](/components/spin-cn#api) | false |  |
| locale | 默认文案设置 | {emptyText?: string, noMoreText?: string} | {emptyText: `暂无数据`} |  |
| renderItem | 当使用 dataSource 时，可以用 `renderItem` 自定义渲染列表项 | (item) => ReactNode | - |  |
| request | 远程获取 options 方法 | [`RequestConfig`](/docs/remote-fetch-cn) | - |  |
| rowKey | 当 `renderItem` 自定义渲染列表项有效时，自定义每一行的 `key` 的获取方式 | `keyof` T、 (item: T) => `React.Key` | `"key"` |  |
| split | 是否展示分割线 | boolean | true |  |
| virtual | 虚拟滚动 | boolean、 [VirtuosoProps](https://virtuoso.dev/virtuoso-api/interfaces/VirtuosoProps/) | - |  |

### List.Item

| 参数      | 说明             | 类型                         | 默认值 | 版本 |
| --------- | ---------------- | ---------------------------- | ------ | ---- |
| actions   | 列表操作组       | Array&lt;ReactNode>          | -      |      |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | -      |      |
| extra     | 额外内容         | ReactNode                    | -      |      |

### List.Item.Meta

| 参数        | 说明               | 类型                         | 默认值 | 版本 |
| ----------- | ------------------ | ---------------------------- | ------ | ---- |
| avatar      | 列表元素的图标     | ReactNode                    | -      |      |
| className   | 语义化结构 class   | [SemanticDOM](#semantic-dom) | -      |      |
| description | 列表元素的描述内容 | ReactNode                    | -      |      |
| title       | 列表元素的标题     | ReactNode                    | -      |      |

### List ref

| 参数 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| getScrollInfo | 获取滚动信息 | () => {left: number; top: number;} |  |
| reload | 重新加载数据，仅使用 `request` 获取远程数据时有效 | () => void |  |
| scrollTo | 滚动到目标位置 | (config : [ScrollConfig](#scrollconfig)) => void |  |

#### ScrollConfig

```tsx
type ScrollTo = (arg: number | ScrollConfig) => void;

type ScrollConfig = ScrollTarget | ScrollPos;

type ScrollTarget =
  | {
      index: number;
      align?: ScrollAlign;
      behavior?: ScrollBehavior;
      offset?: number;
    }
  | {
      key: React.Key;
      align?: ScrollAlign;
      behavior?: ScrollBehavior;
      offset?: number;
    };

type ScrollPos = {
  left?: number;
  top?: number;
};

type ScrollAlign = 'start' | 'center' | 'end';

type ScrollBehavior = 'auto' | 'smooth';
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
