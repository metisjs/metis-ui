---
title: Watermark
description: Add specific text or patterns to the page.
group: Feedback
demo:
  cols: 1
---

## When To Use

- Use when the page needs to be watermarked to identify the copyright.
- Suitable for preventing information theft.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/multi-line.tsx">Multi-line watermark</code>
<code src="./demo/image.tsx">Image watermark</code>

<!-- TODO: InputNumber、Form、ColorPicker 待开发 -->
<!-- <code src="./demo/custom.tsx">Custom configuration</code> -->

<code src="./demo/portal.tsx">Modal or Drawer</code>

## API

### Watermark

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| width | The width of the watermark, the default value of `content` is its own width | number | 120 |  |
| height | The height of the watermark, the default value of `content` is its own height | number | 64 |  |
| inherit | Pass the watermark to the pop-up component such as Modal, Drawer | boolean | true |  |
| rotate | When the watermark is drawn, the rotation Angle, unit `°` | number | -22 |  |
| zIndex | The z-index of the appended watermark element | number | 9 |  |
| image | Image source, it is recommended to export 2x or 3x image, high priority (support base64 format) | string | - |  |
| content | Watermark text content | string \| string[] | - |  |
| font | Text style | [Font](#font) | [Font](#font) |  |
| gap | The spacing between watermarks | \[number, number\] | \[100, 100\] |  |
| offset | The offset of the watermark from the upper left corner of the container. The default is `gap/2` | \[number, number\] | \[gap\[0\]/2, gap\[1\]/2\] |  |

### Font

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | font color | [CanvasFillStrokeStyles.fillStyle](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fillStyle) | - |  |
| fontSize | font size | number | 16 |  |
| fontWeight | font weight | `normal` \| `light` \| `weight` \| number | normal |  |
| fontFamily | font family | string | sans-serif |  |
| fontStyle | font style | `none` \| `normal` \| `italic` \| `oblique` | normal |  |
| textAlign | specify the text alignment direction | [CanvasTextAlign](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/textAlign) | `center` |  |

## FAQ

### Handle abnormal image watermarks

When using an image watermark and the image loads abnormally, you can add `content` at the same time to prevent the watermark from becoming invalid (since ).

```typescript jsx
<Watermark height={30} width={130} content="Metis UI" image="https://foo.png">
  <div style={{ height: 500 }} />
</Watermark>
```
