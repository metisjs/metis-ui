---
title: QRCode
subtitle: 二维码
description: 能够将文本转换生成二维码的组件，支持自定义配色和 Logo 配置。
demo:
  cols: 2
group: 数据展示
---

## 何时使用

当需要将文本转换成为二维码时使用。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/base.tsx">基本使用</code>
<code src="./demo/icon.tsx">带 Icon 的例子</code>
<code src="./demo/status.tsx">不同的状态</code>
<code src="./demo/custom-status-render.tsx">自定义状态渲染器</code>
<code src="./demo/type.tsx">自定义渲染类型</code>
<code src="./demo/custom-size.tsx">自定义尺寸</code>
<code src="./demo/custom-color.tsx">自定义颜色</code>
<code src="./demo/download.tsx">下载二维码</code>
<code src="./demo/error-level.tsx">纠错比例</code>
<code src="./demo/popover.tsx">高级用法</code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| :-- | :-- | :-- | :-- | :-- |
| value | 扫描后的文本 | string | - |
| type | 渲染类型 | `canvas \| svg ` | `canvas` |  |
| icon | 二维码中图片的地址（目前只支持图片地址） | string | - |
| size | 二维码大小 | number | 160 |
| iconSize | 二维码中图片的大小 | number \| { width: number; height: number } | 40 |  |
| color | 二维码颜色 | string | `#000` |
| bgColor | 二维码背景颜色 | string | `transparent` |  |
| bordered | 是否有边框 | boolean | `true` |
| errorLevel | 二维码纠错等级 | `'L' \| 'M' \| 'Q' \| 'H' ` | `M` |
| status | 二维码状态 | `active \| expired \| loading \| scanned` | `active` | scanned: |
| statusRender | 自定义状态渲染器 | (info: [StatusRenderInfo](/components/qr-code-cn#statusrenderinfo)) => React.ReactNode | - |  |
| onRefresh | 点击"点击刷新"的回调 | `() => void` | - |

### StatusRenderInfo

```typescript
type StatusRenderInfo = {
  status: QRStatus;
  locale: Locale['QRCode'];
  onRefresh?: () => void;
};
```
