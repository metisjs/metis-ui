---
title: Breadcrumb
subtitle: 面包屑
group:
  title: 导航
  order: 2
---

显示当前页面在系统层级结构中的位置，并能向上返回。

## 何时使用

- 当系统拥有超过两级以上的层级结构时；
- 当需要告知用户『你在哪里』时；
- 当需要向上导航的功能时。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/withIcon.tsx">带有图标的</code>
<code src="./demo/separator.tsx">分隔符</code>
<code src="./demo/overlay.tsx">带下拉菜单的面包屑</code>
<code src="./demo/separator-component.tsx">独立的分隔符</code>

## API

### Breadcrumb

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 语义化结构 class | string \| Record<'root' \| 'item' \| 'separator' , string> | - |  |
| itemRender | 自定义链接函数 | (item, params, items, paths, isLast) => ReactNode | - |  |
| params | 路由的参数 | object | - |  |
| items | 路由栈信息 | [items\[\]](#ItemType) | - |  |
| separator | 分隔符自定义 | ReactNode | `/` |  |

### ItemType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 自定义类名 | string | - |  |
| dropdownProps | 弹出下拉菜单的自定义配置 | [Dropdown](/components/dropdown-cn) | - |  |
| href | 链接的目的地，不能和 `path` 共用 | string | - |  |
| path | 拼接路径，每一层都会拼接前一个 `path` 信息。不能和 `href` 共用 | string | - |  |
| menu | 菜单配置项 | [MenuProps](/components/menu-cn/#api) | - |  |
| onClick | 单击事件 | (e:MouseEvent) => void | - |  |
| title | 名称 | ReactNode | - |  |

### 和 browserHistory 配合

和 react-router 一起使用时，默认生成的 url 路径是带有 `#` 的，如果和 browserHistory 一起使用的话，你可以使用 `ConfigProvider` 属性定义面包屑链接。

```jsx
import React from 'react';
import { ConfigProvider } from 'antd';

// ...
const Demo: React.FC = () => (
  <ConfigProvider link={{ history: 'browser', base: '/' }}>
    <App />
  </ConfigProvider>
);

export default Demo;
```
