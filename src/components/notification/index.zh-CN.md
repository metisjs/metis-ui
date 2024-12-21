---
title: Notification
subtitle: 通知提醒框
description: 全局展示通知提醒信息。
demo:
  cols: 2
group: 反馈
---

## 何时使用

在系统四个角显示通知提醒信息。经常用于以下情况：

- 较为复杂的通知内容。
- 带有交互的通知，给出用户下一步的行动点。
- 系统主动推送。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/duration.tsx">自动关闭的延时</code>
<code src="./demo/with-icon.tsx">带有图标的通知提醒框</code>
<code src="./demo/with-btn.tsx">自定义按钮</code>
<code src="./demo/custom-icon.tsx">自定义图标</code>
<code src="./demo/placement.tsx">位置</code>
<code src="./demo/custom-style.tsx">自定义样式</code>
<code src="./demo/update.tsx">更新消息内容</code>
<code src="./demo/stack.tsx" >堆叠</code>
<code src="./demo/show-with-progress.tsx" >显示进度条</code>
<code src="./demo/hooks.tsx">Hooks 调用 </code>

## API

- `notification.success(config)`
- `notification.error(config)`
- `notification.info(config)`
- `notification.warning(config)`
- `notification.open(config)`
- `notification.destroy(key?: String)`

config 参数如下：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| btn | 自定义关闭按钮 | ReactNode | - | - |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| closable | 可关闭配置 | boolean \| ({ closeIcon?: React.ReactNode } & React.AriaAttributes) | `false` |  |
| description | 通知提醒内容，必选 | ReactNode | - | - |
| duration | 默认 4.5 秒后自动关闭，配置为 0 则不自动关闭 | number | 4.5 | - |
| icon | 自定义图标 | ReactNode | - | - |
| key | 当前通知唯一标志 | string | - | - |
| message | 通知提醒标题，必选 | ReactNode | - | - |
| pauseOnHover | 悬停时是否暂停计时器 | boolean | true |  |
| placement | 弹出位置，可选 `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | string | `topRight` | - |
| props | 透传至通知 `div` 上的 props 对象，支持传入 `data-*` `aria-*` 或 `role` 作为对象的属性。需要注意的是，虽然在 TypeScript 类型中声明的类型支持传入 `data-*` 作为对象的属性，但目前只允许传入 `data-testid` 作为对象的属性。 详见 <https://github.com/microsoft/TypeScript/issues/28960> | Object | - | - |
| role | 供屏幕阅读器识别的通知内容语义，默认为 `alert`。此情况下屏幕阅读器会立即打断当前正在阅读的其他内容，转而阅读通知内容 | `alert \| status` | `alert` |  |
| showProgress | 显示自动关闭通知框的进度条 | boolean |  |  |
| onClick | 点击通知时触发的回调函数 | function | - | - |
| onClose | 当通知关闭时触发 | function | - | - |

- `notification.useNotification(config)`

config 参数如下：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bottom | 消息从底部弹出时，距离底部的位置，单位像素 | number | 24 |  |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| closable | 可关闭配置 | boolean \| ({ closeIcon?: React.ReactNode } & React.AriaAttributes) | `false` |  |
| duration | 默认自动关闭延时，单位秒 | number | 4.5 |  |
| getContainer | 配置渲染节点的输出位置，但依旧为全屏展示 | () => HTMLNode | () => document.body |  |
| maxCount | 最大显示数，超过限制时，最早的消息会被自动关闭 | number | - |  |
| pauseOnHover | 悬停时是否暂停计时器 | boolean | true |  |
| placement | 弹出位置，可选 `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | string | `topRight` |  |
| props | 透传至通知 `div` 上的 props 对象，支持传入 `data-*` `aria-*` 或 `role` 作为对象的属性。需要注意的是，虽然在 TypeScript 类型中声明的类型支持传入 `data-*` 作为对象的属性，但目前只允许传入 `data-testid` 作为对象的属性。 详见 <https://github.com/microsoft/TypeScript/issues/28960> | Object | - | - |
| showProgress | 显示自动关闭通知框的进度条 | boolean |  |  |
| stack | 堆叠模式，超过阈值时会将所有消息收起 | boolean \| `{ threshold: number; offset: number; gap: number }` | `{ threshold: 3, offset: 8, gap: 16 }` |  |
| top | 消息从顶部弹出时，距离顶部的位置，单位像素 | number | 24 |  |
| transition | 动画配置 | [TransitionProps](/components/transition-cn) \| (placement: Placement) => [TransitionProps](/components/transition-cn) |  |  |
| onAllRemoved | 通知框全消失时触发 | VoidFunction |  |  |

### 全局配置

还提供了一个全局配置方法，在调用前提前配置，全局一次生效。

`notification.config(options)`

> options 参数同 useNotification 的参数。

```js
notification.config({
  placement: 'bottomRight',
  bottom: 50,
  duration: 3,
});
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>

## FAQ

### 为什么 notification 不能获取 context、redux 的内容和 ConfigProvider 的 `locale/prefixCls` 等配置？

直接调用 notification 方法，metis-ui 会通过 `ReactDOM.render` 动态创建新的 React 实体。其 context 与当前代码所在 context 并不相同，因而无法获取 context 信息。

当你需要 context 信息（例如 ConfigProvider 配置的内容）时，可以通过 `notification.useNotification` 方法会返回 `api` 实体以及 `contextHolder` 节点。将其插入到你需要获取 context 位置即可：

```tsx
const [api, contextHolder] = notification.useNotification();

return (
  <Context1.Provider value="Metis">
    {/* contextHolder 在 Context1 内，它可以获得 Context1 的 context */}
    {contextHolder}
    <Context2.Provider value="UI">
      {/* contextHolder 在 Context2 外，因而不会获得 Context2 的 context */}
    </Context2.Provider>
  </Context1.Provider>
);
```

**异同**：通过 hooks 创建的 `contextHolder` 必须插入到子元素节点中才会生效，当你不需要上下文信息时请直接调用。
