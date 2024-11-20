---
group: 数据展示
title: Image
subtitle: 图片
description: 可预览的图片。
cols: 2
---

## 何时使用

- 需要展示图片时使用。
- 加载显示大图或加载失败时容错处理。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本用法</code>
<code src="./demo/fallback.tsx">容错处理</code>
<code src="./demo/placeholder.tsx">渐进加载</code>
<code src="./demo/preview-group.tsx">多张图片预览</code>
<code src="./demo/preview-group-visible.tsx">相册模式</code>
<code src="./demo/preview-src.tsx">自定义预览图片</code>
<code src="./demo/controlled-preview.tsx">受控的预览</code>
<code src="./demo/toolbar-render.tsx">自定义工具栏</code>
<code src="./demo/image-render.tsx">自定义预览内容</code>
<code src="./demo/preview-mask.tsx" debug>自定义预览文本</code>
<code src="./demo/nested.tsx">嵌套</code>
<code src="./demo/preview-group-top-progress.tsx" debug>多图预览时顶部进度自定义</code>
<code src="./demo/preview-imgInfo.tsx" debug>在渲染函数中获取图片信息</code>

## API

### Image

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| alt | 图像描述 | string | - |  |
| className | 语义化结构 class | [SemanticDOM](#image-1) | - |  |
| fallback | 加载失败容错地址 | string | - |  |
| height | 图像高度 | string \| number | - |  |
| placeholder | 加载占位，为 `true` 时使用默认占位 | ReactNode | - |  |
| preview | 预览参数，为 `false` 时禁用 | boolean \| [PreviewType](#previewtype) | true |  |
| src | 图片地址 | string | - |  |
| width | 图像宽度 | string \| number | - |  |
| onError | 加载错误回调 | (event: Event) => void | - |  |

其他属性见 [&lt;img>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes)

### PreviewType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| closeIcon | 自定义关闭 Icon | React.ReactNode | - |  |
| destroyOnClose | 关闭预览时销毁子元素 | boolean | false |  |
| forceRender | 强制渲染预览图 | boolean | - | - |
| getContainer | 指定预览挂载的节点，但依旧为全屏展示，false 为挂载在当前位置 | string \| HTMLElement \| (() => HTMLElement) \| false | - |  |
| imageRender | 自定义预览内容 | (originalNode: React.ReactElement, info: { transform: [TransformType](#transformtype), image: [ImgInfo](#imginfo) }) => React.ReactNode | - |  |
| mask | 缩略图遮罩 | ReactNode | - |  |
| maxScale | 最大放大倍数 | number | 50 |  |
| minScale | 最小缩放倍数 | number | 1 |  |
| movable | 是否可移动 | boolean | true |  |
| open | 是否显示 | boolean | - | - |
| scaleStep | `1 + scaleStep` 为缩放放大的每步倍数 | number | 0.5 | - |
| src | 自定义预览 src | string | - |  |
| toolbarRender | 自定义工具栏 | (originalNode: React.ReactElement, info: Omit&lt;[ToolbarRenderInfoType](#toolbarrenderinfotype), 'current' \| 'total'>) => React.ReactNode | - |  |
| onOpenChange | 当 `open` 发生改变时的回调 | (open: boolean, prevOpen: boolean) => void | - | - |
| onTransform | 预览图 transform 变化的回调 | { transform: [TransformType](#transformtype), action: [TransformAction](#transformaction) } | - |  |

## PreviewGroup

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 语义化结构 class | [SemanticDOM](#imagepreviewgroup) | - |  |
| fallback | 加载失败容错地址 | string | - |  |
| items | 预览数组 | string\[] \| { src: string, crossOrigin: string, ... }\[] | - |  |
| preview | 预览参数，为 `false` 时禁用 | boolean \| [PreviewGroupType](#previewgrouptype) | true |  |

### PreviewGroupType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| closeIcon | 自定义关闭 Icon | React.ReactNode | - |  |
| countRender | 自定义预览计数内容 | (current: number, total: number) => React.ReactNode | - |  |
| current | 当前预览图的 index | number | - |  |
| forceRender | 强制渲染预览图 | boolean | - | - |
| getContainer | 指定预览挂载的节点，但依旧为全屏展示，false 为挂载在当前位置 | string \| HTMLElement \| (() => HTMLElement) \| false | - |  |
| imageRender | 自定义预览内容 | (originalNode: React.ReactElement, info: { transform: [TransformType](#transformtype), image: [ImgInfo](#imginfo), current: number }) => React.ReactNode | - |  |
| mask | 缩略图遮罩 | ReactNode | - |  |
| maxScale | 最大放大倍数 | number | 50 |  |
| minScale | 最小缩放倍数 | number | 1 |  |
| movable | 是否可移动 | boolean | true |  |
| open | 是否显示 | boolean | - | - |
| scaleStep | `1 + scaleStep` 为缩放放大的每步倍数 | number | 0.5 | - |
| toolbarRender | 自定义工具栏 | (originalNode: React.ReactElement, info: [ToolbarRenderInfoType](#toolbarrenderinfotype)) => React.ReactNode | - |  |
| onChange | 切换预览图的回调 | (current: number, prevCurrent: number) => void | - |  |
| onOpenChange | 当 `open` 发生改变时的回调 | (open: boolean, prevOpen: boolean, current: number) => void | - |  |
| onTransform | 预览图 transform 变化的回调 | { transform: [TransformType](#transformtype), action: [TransformAction](#transformaction) } | - |  |

## Interface

### TransformType

```typescript
{
  x: number;
  y: number;
  rotate: number;
  scale: number;
  flipX: boolean;
  flipY: boolean;
}
```

### TransformAction

```typescript
type TransformAction =
  | 'flipY'
  | 'flipX'
  | 'rotateLeft'
  | 'rotateRight'
  | 'zoomIn'
  | 'zoomOut'
  | 'close'
  | 'prev'
  | 'next'
  | 'wheel'
  | 'doubleClick'
  | 'move'
  | 'dragRebound'
  | 'reset';
```

### ToolbarRenderInfoType

```typescript
{
  icons: {
    flipYIcon: React.ReactNode;
    flipXIcon: React.ReactNode;
    rotateLeftIcon: React.ReactNode;
    rotateRightIcon: React.ReactNode;
    zoomOutIcon: React.ReactNode;
    zoomInIcon: React.ReactNode;
  };
  actions: {
    onFlipY: () => void;
    onFlipX: () => void;
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onZoomOut: () => void;
    onZoomIn: () => void;
    onReset: () => void; //  之后支持
    onClose: () => void;
  };
  transform: TransformType,
  current: number;
  total: number;
  image: ImgInfo
}
```

### ImgInfo

```typescript
{
  url?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}
```

## Semantic DOM

### Image

<code src="./demo/_semantic_basic.tsx" simplify></code>

### Image.PreviewGroup

<code src="./demo/_semantic_group.tsx" simplify></code>
