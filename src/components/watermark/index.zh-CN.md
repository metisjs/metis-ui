---
title: Watermark
subtitle: 水印
description: 给页面的某个区域加上水印。
group: 反馈
demo:
  cols: 1
---

## 何时使用

- 页面需要添加水印标识版权时使用。
- 适用于防止信息盗用。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/multi-line.tsx">多行水印</code>
<code src="./demo/image.tsx">图片水印</code>
<code src="./demo/custom.tsx">自定义配置</code>
<code src="./demo/portal.tsx">Modal 与 Drawer</code>

## API

### Watermark

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| content | 水印文字内容 | string、 string\[] | - |  |
| font | 文字样式 | [Font](#font) | [Font](#font) |  |
| gap | 水印之间的间距 | \[number, number] | \[100, 100] |  |
| height | 水印的高度，`content` 的默认值为自身的高度 | number | 64 |  |
| image | 图片源，建议导出 2 倍或 3 倍图，优先级高 (支持 base64 格式) | string | - |  |
| inherit | 是否将水印传导给弹出组件如 Modal、Drawer | boolean | true |  |
| offset | 水印距离容器左上角的偏移量，默认为 `gap/2` | \[number, number] | \[gap\[0]/2, gap\[1]/2] |  |
| rotate | 水印绘制时，旋转的角度，单位 `°` | number | -22 |  |
| width | 水印的宽度，`content` 的默认值为自身的宽度 | number | 120 |  |
| zIndex | 追加的水印元素的 z-index | number | 9 |  |

### Font

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| color | 字体颜色 | [CanvasFillStrokeStyles.fillStyle](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fillStyle) | - |  |
| fontFamily | 字体类型 | string | sans-serif |  |
| fontSize | 字体大小 | number | 16 |  |
| fontStyle | 字体样式 | `none`、 `normal`、 `italic`、 `oblique` | normal |  |
| fontWeight | 字体粗细 | `normal`、 `light`、 `weight`、 number | normal |  |
| textAlign | 指定文本对齐方向 | [CanvasTextAlign](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/textAlign) |  |  |

## FAQ

### 处理异常图片水印

当使用图片水印且图片加载异常时，可以同时添加 `content` 防止水印失效。

```typescript jsx
<Watermark height={30} width={130} content="Metis UI" image="https://foo.png">
  <div style={{ height: 500 }} />
</Watermark>
```
