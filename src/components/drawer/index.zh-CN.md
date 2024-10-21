---
title: Drawer
subtitle: 抽屉
description: 屏幕边缘滑出的浮层面板。
group: 反馈
demo:
  cols: 2
---

## 何时使用

抽屉从父窗体边缘滑入，覆盖住部分父窗体内容。用户在抽屉内操作时不必离开当前任务，操作完成后，可以平滑地回到原任务。

- 当需要一个附加的面板来控制父窗体内容，这个面板在需要时呼出。比如，控制界面展示样式，往界面中添加内容。
- 当需要在当前任务流中插入临时任务，创建或预览附加内容。比如展示协议条款，创建子对象。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic-right.tsx">基础抽屉</code>
<code src="./demo/placement.tsx">自定义位置</code>
<code src="./demo/loading.tsx">加载中</code>
<code src="./demo/render-in-current.tsx">渲染在当前 DOM</code>
<code src="./demo/form-in-drawer.tsx">抽屉表单</code>
<code src="./demo/multi-level-drawer.tsx">多层抽屉</code>
<code src="./demo/custom-style.tsx">自定义内部样式</code>
<code src="./demo/config-provider.tsx" debug>ConfigProvider</code>
<code src="./demo/no-mask.tsx" debug>无遮罩</code>
<code src="./demo/scroll-debug.tsx" debug>滚动锁定调试</code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| afterOpenChange | 切换抽屉时动画结束后的回调 | function(open) | - |  |
| autoFocus | 抽屉展开后是否将焦点切换至其 DOM 节点 | boolean | true |  |
| className | 语义化结构 class | string \| Record&lt;'root' \| 'mask' \| 'wrapper' \| 'content' \| 'header' \| 'footer' \| 'body', string> | - |  |
| closable | 是否显示右上角的关闭按钮 | boolean \| { closeIcon?: React.ReactNode } | true |  |
| destroyOnClose | 关闭时销毁 Drawer 里的子元素 | boolean | false |  |
| drawerRender | 自定义渲染抽屉 | (node: ReactNode) => ReactNode | - |  |
| footer | 抽屉的页脚 | ReactNode | - |  |
| forceRender | 预渲染 Drawer 内元素 | boolean | false |  |
| getContainer | 指定 Drawer 挂载的节点，**并在容器内展现**，`false` 为挂载在当前位置 | HTMLElement \| () => HTMLElement \| Selectors \| false | body |  |
| height | 高度，在 `placement` 为 `top` 或 `bottom` 时使用 | string \| number | 448 |  |
| keyboard | 是否支持键盘 esc 关闭 | boolean | true |  |
| loading | 显示骨架屏 | boolean | false |  |
| mask | 是否展示遮罩 | boolean | true |  |
| maskClosable | 点击蒙层是否允许关闭 | boolean | true |  |
| open | Drawer 是否可见 | boolean | - |  |
| placement | 抽屉的方向 | `top` \| `right` \| `bottom` \| `left` | `right` |  |
| push | 用于设置多层 Drawer 的推动行为 | boolean \| { distance: string \| number } | { distance: 180 } | + |
| style | 设计 Drawer 容器样式，如果你只需要设置内容部分请使用 `bodyStyle` | CSSProperties | - |  |
| title | 标题 | ReactNode | - |  |
| width | 宽度 | string \| number | 448 |  |
| zIndex | 设置 Drawer 的 `z-index` | number | 1000 |  |
| onClose | 点击遮罩层或左上角叉或取消按钮的回调 | function(e) | - |  |
