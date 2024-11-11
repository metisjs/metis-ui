---
title: QRCode
description: Components that can convert text into QR codes, and support custom color and logo.
demo:
  cols: 2
group: Data Display
---

## When To Use

Used when the text needs to be converted into a QR Code.

## Examples

<!-- prettier-ignore -->
<code src="./demo/base.tsx">base</code>
<code src="./demo/icon.tsx">With Icon</code>
<code src="./demo/status.tsx">other status</code>
<code src="./demo/custom-status-render.tsx">custom status render</code>
<code src="./demo/type.tsx">Custom Render Type</code>
<code src="./demo/custom-size.tsx">Custom Size</code>
<code src="./demo/custom-color.tsx">Custom Color</code>
<code src="./demo/download.tsx">Download QRCode</code>
<code src="./demo/error-level.tsx">Error Level</code>
<code src="./demo/popover.tsx">Advanced Usage</code>

## API

| Property | Description | Type | Default | Version |
| :-- | :-- | :-- | :-- | :-- |
| value | scanned text | string | - |
| type | render type | `canvas \| svg ` | `canvas` |  |
| icon | include image url (only image link are supported) | string | - |
| size | QRCode size | number | 160 |
| iconSize | include image size | number \| { width: number; height: number } | 40 |  |
| color | QRCode Color | string | `#000` |
| bgColor | QRCode Background Color | string | `transparent` |  |
| bordered | Whether has border style | boolean | `true` |
| errorLevel | Error Code Level | `'L' \| 'M' \| 'Q' \| 'H' ` | `M` |
| status | QRCode status | `active \| expired \| loading \| scanned` | `active` | scanned: |
| statusRender | custom status render | `(info: \[StatusRenderInfo](/components/qr-code-cn#statusrenderinfo)) => React.ReactNode` |  |
| onRefresh | callback | `() => void` | - |

### StatusRenderInfo

```typescript
type StatusRenderInfo = {
  status: QRStatus;
  locale: Locale['QRCode'];
  onRefresh?: () => void;
};
```
