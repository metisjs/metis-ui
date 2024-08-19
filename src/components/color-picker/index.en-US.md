---
title: ColorPicker
description: Used for color selection.
demo:
  cols: 2
group:
  title: Data Entry
---

## When To Use

Used when the user needs to make a customized color selection.

## Examples

<!-- prettier-ignore -->
<code src="./demo/base.tsx">Basic Usage</code>
<code src="./demo/size.tsx">Trigger size</code>
<code src="./demo/controlled.tsx">controlled mode</code>
<code src="./demo/line-gradient.tsx">Line Gradient</code>
<code src="./demo/text-render.tsx">Rendering Trigger Text</code>
<code src="./demo/disabled.tsx">Disable</code>
<code src="./demo/disabled-alpha.tsx">Disabled Alpha</code>
<code src="./demo/allow-clear.tsx">Clear Color</code>
<code src="./demo/trigger.tsx">Custom Trigger</code>
<code src="./demo/trigger-event.tsx">Custom Trigger Event</code>
<code src="./demo/format.tsx">Color Format</code>
<code src="./demo/presets.tsx">Preset Colors</code>
<code src="./demo/panel-render.tsx">Custom Render Panel</code>

## API

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| :-- | :-- | :-- | :-- | :-- |
| allowClear | 	Allow clearing color selected | boolean | false | |
| arrow | Configuration for popup arrow | `boolean \| { pointAtCenter: boolean }` | true | |
| children | Trigger of ColorPicker | React.ReactNode | - | |
| defaultValue | Default value of color | string \| `Color` | - | |
| defaultFormat | Default format of color | `rgb` \| `hex` \| `hsb` | - |  |
| disabled | Disable ColorPicker | boolean | - | |
| disabledAlpha | Disable Alpha | boolean | - |  |
| destroyTooltipOnHide | Whether destroy popover when hidden | `boolean` | false |  |
| format | Format of color | `rgb` \| `hex` \| `hsb` | `hex` | |
| mode | Configure single or gradient color | `('single' \| 'gradient')[]` | `single` |  |
| open | Whether to show popup | boolean | - | |
| presets | Preset colors | `{ label: ReactNode, colors: Array<string \| Color>, defaultOpen?: boolean }[]` | - | `defaultOpen: ` |
| placement | Placement of popup | The design of the [placement](/components/tooltip/#api) parameter is the same as the `Tooltips` component. | `bottomLeft` | |
| panelRender | Custom Render Panel | `(panel: React.ReactNode, extra: { components: { Picker: FC; Presets: FC } }) => React.ReactNode` | - |  |
| showText | Show color text | boolean \| `(color: Color) => React.ReactNode` | - |  |
| size | Setting the trigger size | `large` \| `middle` \| `small` | `middle` |  |
| trigger | ColorPicker trigger mode | `hover` \| `click` | `click` | |
| value | Value of color | string \| `Color` | - | |
| onChange | Callback when `value` is changed | `(value: Color, hex: string) => void` | - | |
| onChangeComplete | Called when color pick ends   | `(value: Color) => void` | - |  |
| onFormatChange | Callback when `format` is changed | `(format: 'hex' \| 'rgb' \| 'hsb') => void` | - | |
| onOpenChange | Callback when `open` is changed | `(open: boolean) => void` | - | |
| onClear | Called when clear | `() => void` | - |  |

### Color

<!-- prettier-ignore -->
| Property | Description | Type | Version |
| :-- | :-- | :-- | :-- |
| toCssString | Convert to CSS support format | `() => string` |  |
| toHex | Convert to `hex` format characters, the return type like: `1677ff` | `() => string` | - |
| toHexString | Convert to `hex` format color string, the return type like: `#1677ff` | `() => string` | - |
| toHsb | Convert to `hsb` object  | `() => ({ h: number, s: number, b: number, a number })` | - |
| toHsbString | Convert to `hsb` format color string, the return type like: `hsb(215, 91%, 100%)` | `() => string` | - |
| toRgb | Convert to `rgb` object  | `() => ({ r: number, g: number, b: number, a number })` | - |
| toRgbString | Convert to `rgb` format color string, the return type like: `rgb(22, 119, 255)` | `() => string` | - |

## FAQ

### Questions about color assignment

The value of the color selector supports both string color values and selector-generated `Color` objects. However, since there is a precision error when converting color strings of different formats to each other, it is recommended to use selector-generated `Color` objects for assignment operations in controlled scenarios, so that the precision problem can be avoided and the values are guaranteed to be accurate and the selector can work as expected.
