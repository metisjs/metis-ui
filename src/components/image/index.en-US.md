---
group: Data Display
title: Image
description: Preview-able image.
cols: 2
---

## When To Use

- When you need to display pictures.
- Display when loading a large image or fault tolerant handling when loading fail.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic Usage</code>
<code src="./demo/fallback.tsx">Fault tolerant</code>
<code src="./demo/placeholder.tsx">Progressive Loading</code>
<code src="./demo/preview-group.tsx">Multiple image preview</code>
<code src="./demo/preview-group-visible.tsx">Preview from one image</code>
<code src="./demo/preview-src.tsx">Custom preview image</code>
<code src="./demo/controlled-preview.tsx">Controlled Preview</code>
<code src="./demo/toolbar-render.tsx">Custom toolbar render</code>
<code src="./demo/image-render.tsx">Custom preview render</code>
<code src="./demo/preview-mask.tsx" debug>Custom preview mask</code>
<code src="./demo/nested.tsx">nested</code>
<code src="./demo/preview-group-top-progress.tsx" debug>Top progress customization when previewing multiple images</code>
<code src="./demo/preview-imgInfo.tsx" debug>Gets image info in the render function</code>

## API

### Image

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | string \| Record<'root' \| 'image', string> | - |  |
| alt | Image description | string | - |  |
| fallback | Load failure fault-tolerant src | string | - |  |
| height | Image height | string \| number | - |  |
| placeholder | Load placeholder, use default placeholder when set `true` | ReactNode | - |  |
| preview | preview config, disabled when `false` | boolean \| [PreviewType](#previewtype) | true |  |
| src | Image path | string | - |  |
| width | Image width | string \| number | - |  |
| onError | Load failed callback | (event: Event) => void | - |  |

Other attributes [&lt;img>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes)

### PreviewType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | string \| Record<'root' \| 'body' \| 'mask' \| 'content' \| 'image' \| 'operations', string> | - |  |
| open | Whether the preview dialog is open or not | boolean | - | - |
| src | Custom preview src | string | - |  |
| getContainer | The mounted node for preview dialog but still display at fullScreen | string \| HTMLElement \| (() => HTMLElement) \| false | - |  |
| movable | whether can be moved | boolean | true |  |
| mask | Thumbnail mask | ReactNode | - |  |
| scaleStep | `1 + scaleStep` is the step to increase or decrease the scale | number | 0.5 | - |
| minScale | Min scale | number | 1 |  |
| maxScale | Max scale | number | 50 |  |
| closeIcon | Custom close icon | React.ReactNode | - |  |
| forceRender | Force render preview dialog | boolean | - | - |
| toolbarRender | Custom toolbar render | (originalNode: React.ReactElement, info: Omit<[ToolbarRenderInfoType](#toolbarrenderinfotype), 'current' \| 'total'>) => React.ReactNode | - |  |
| imageRender | Custom preview content | (originalNode: React.ReactElement, info: { transform: [TransformType](#transformtype), image: [ImgInfo](#imginfo) }) => React.ReactNode | - |  |
| destroyOnClose | Destroy child elements when closing preview | boolean | false |  |
| onTransform | Callback when the transform of image changed | { transform: [TransformType](#transformtype), action: [TransformAction](#transformaction) } | - |  |
| onOpenChange | Callback when `open` changed | (open: boolean, prevOpen: boolean) => void | - | - |

## PreviewGroup

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| preview | Preview config, `disabled` when false | boolean \| [PreviewGroupType](#previewgrouptype) | true |  |
| items | Preview items | string[] \| { src: string, crossOrigin: string, ... }[] | - |  |
| fallback | Load failure fault-tolerant src | string | - |  |

### PreviewGroupType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| open | Whether the preview dialog is open or not | boolean | - | - |
| getContainer | The mounted node for preview dialog but still display at fullScreen | string \| HTMLElement \| (() => HTMLElement) \| false | - |  |
| movable | whether can be moved | boolean | true |  |
| current | The index of the current preview | number | - |  |
| mask | Thumbnail mask | ReactNode | - |  |
| scaleStep | `1 + scaleStep` is the step to increase or decrease the scale | number | 0.5 | - |
| minScale | Min scale | number | 1 |  |
| maxScale | Max scale | number | 50 |  |
| closeIcon | Custom close icon | React.ReactNode | - |  |
| forceRender | Force render preview dialog | boolean | - | - |
| countRender | Custom preview count content | (current: number, total: number) => React.ReactNode | - |  |
| toolbarRender | Custom toolbar render | (originalNode: React.ReactElement, info: [ToolbarRenderInfoType](#toolbarrenderinfotype)) => React.ReactNode | - |  |
| imageRender | Custom preview content | (originalNode: React.ReactElement, info: { transform: [TransformType](#transformtype), image: [ImgInfo](#imginfo), current: number }) => React.ReactNode | - |  |
| onTransform | Callback when the transform of image changed | { transform: [TransformType](#transformtype), action: [TransformAction](#transformaction) } | - |  |
| onChange | Callback when switch preview image | (current: number, prevCurrent: number) => void | - |  |
| onOpenChange | Callback when `open` changed | (open: boolean, prevOpen: boolean, current: number) => void | - |  |

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
  | 'dragRebound';
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
    onReset: () => void; // support after
    onClose: () => void;
  };
  transform: TransformType,
  current: number;
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