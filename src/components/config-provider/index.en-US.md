---
category: Components
group: Other
title: ConfigProvider
description: Provide a uniform configuration support for components.
---

## Examples

<!-- prettier-ignore -->
<code src="./demo/locale.tsx">Locale</code>
<code src="./demo/size.tsx">Component size</code>
<code src="./demo/theme.tsx" compact>Theme</code>
<code src="./demo/style-override.tsx">Override</code>
<code src="./demo/holder-render.tsx">Static function</code>
<code src="./demo/prefix-cls.tsx" debug>prefixCls</code>
<code src="./demo/use-config.tsx" debug>useConfig</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| componentDisabled | Config antd component `disabled` | boolean | - |  |
| componentSize | Config antd component size | `mini`, `small`, `middle`, `large` | - |  |
| getPopupContainer | To set the container of the popup element. The default is to create a `div` element in `body` | function(triggerNode) | () => document.body |  |
| getTargetContainer | Config Affix, Anchor scroll target container | () => HTMLElement | () => window |  |
| locale | Language package setting | object | - |  |
| popupMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean, number | - |  |
| popupOverflow | Select like component popup logic. Can set to show in viewport or follow window scroll | 'viewport', 'scroll' | 'viewport' |  |
| prefixCls | Set prefix className | string | `metis` |  |
| renderEmpty | Set empty content of components. Ref [Empty](/components/empty/) | function(componentName: string): ReactNode | - |  |
| theme | Set theme，when use `system` will automatically switch the theme between `default-theme` and `dark-theme` based on the system. [How to set theme?](/docs/theme) | string\| { value: string; target: React.RefObject&lt;HTMLElement&gt; } | `system` |  |
| variant | Set variant of data entry components | `outlined`, `filled`, `borderless` | - |  |
| virtual | Disable virtual scroll when set to `false` | boolean | - |  |

> When theme nesting is needed, you can set `theme.target` to manually specify the `data-theme`

### ConfigProvider.config()

Setting `Modal`、`Message`、`Notification` static config. Not work on hooks.

```tsx
ConfigProvider.config({
  holderRender: (children) => <ConfigProvider prefixCls="metis">{children}</ConfigProvider>,
});
```

### ConfigProvider.useConfig()

Get the value of the parent `Provider`. Such as `DisabledContextProvider`, `SizeContextProvider`.

```jsx
const { componentDisabled, componentSize } = ConfigProvider.useConfig();
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| componentDisabled | antd component disabled state | boolean | - |  |
| componentSize | antd component size state | `mini`, `small`, `middle`, `large` | - |  |
