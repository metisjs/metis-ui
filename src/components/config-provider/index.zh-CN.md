---
category: Components
subtitle: 全局化配置
group: 其他
title: ConfigProvider
description: 为组件提供统一的全局化配置。
---

## 使用

ConfigProvider 使用 React 的 [context](https://facebook.github.io/react/docs/context.html) 特性，只需在应用外围包裹一次即可全局生效。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/locale.tsx">国际化</code>
<code src="./demo/size.tsx">组件尺寸</code>
<code src="./demo/theme.tsx" compact>主题</code>
<code src="./demo/style-override.tsx">组件样式覆盖</code>
<code src="./demo/holder-render.tsx">静态方法</code>
<code src="./demo/prefix-cls.tsx" debug>前缀</code>
<code src="./demo/use-config.tsx" debug>获取配置</code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| componentDisabled | 设置 组件禁用状态 | boolean | - |  |
| componentSize | 设置 组件大小 | `mini`、 `small`、 `middle`、 `large` | - |  |
| getPopupContainer | 弹出框（Select, Tooltip, Menu 等等）渲染父节点，默认渲染到 body 上。 | function(triggerNode) | () => document.body |  |
| getTargetContainer | 配置 Affix、Anchor 滚动监听容器。 | () => HTMLElement | () => window |  |
| locale | 语言包配置 | object | - |  |
| popupMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。`false` 时会关闭虚拟滚动 | boolean、 number | - |  |
| popupOverflow | Select 类组件弹层展示逻辑，默认为可视区域滚动，可配置成滚动区域滚动 | 'viewport'、 'scroll' | 'viewport' |  |
| prefixCls | 设置统一样式前缀 | string | `metis` |  |
| renderEmpty | 自定义组件空状态。参考 [空状态](/components/empty-cn) | function(componentName: string): ReactNode | - |  |
| theme | 设置主题，设置 `system` 则主题会随系统在 `default-theme` 与 `dark-theme` 之前自动切换。[如何定制主题?](/docs/theme) | string、 { value: string; target: React.RefObject&lt;HTMLElement&gt; } | `system` |  |
| variant | 设置全局输入组件形态变体 | `outlined`、 `filled`、 `borderless` | - |  |
| virtual | 设置 `false` 时关闭虚拟滚动 | boolean | - |  |

> 当需要主题嵌套时，可设置 `theme.target` 手动指定 `data-theme` 节点

### ConfigProvider.config()

设置 `Modal`、`Message`、`Notification` 静态方法配置，只会对非 hooks 的静态方法调用生效。

```tsx
ConfigProvider.config({
  holderRender: (children) => <ConfigProvider prefixCls="metis">{children}</ConfigProvider>,
});
```

### ConfigProvider.useConfig()

获取父级 `Provider` 的值。如 `DisabledContextProvider`、`SizeContextProvider`。

```jsx
const { componentDisabled, componentSize } = ConfigProvider.useConfig();
```

<!-- prettier-ignore -->
| 返回值 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| componentDisabled | 组件禁用状态 | boolean | - |   |
| componentSize | 组件大小状态 | `mini`、 `small`、 `middle`、 `large` | - |   |
