---
title: Breadcrumb
group:
  title: Navigation
  order: 2
---

Display the current location within a hierarchy. And allow going back to states higher up in the hierarchy.

## When To Use

- When the system has more than two layers in a hierarchy.
- When you need to inform the user of where they are.
- When the user may need to navigate back to a higher level.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic Usage</code>
<code src="./demo/withIcon.tsx">With an Icon</code>
<code src="./demo/separator.tsx">Configuring the Separator</code>
<code src="./demo/overlay.tsx">Bread crumbs with drop down menu</code>
<code src="./demo/separator-component.tsx">Configuring the Separator Independently</code>

## API

### Breadcrumb

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | string \| Record<'root' \| 'item' \| 'separator' , string> | - |  |
| itemRender | Custom item renderer | (item, params, items, paths, isLast) => ReactNode | - |  |
| params | Routing parameters | object | - |  |
| items | The routing stack information of router | [ItemType\[\]](#ItemType) | - |  |
| separator | Custom separator | ReactNode | `/` |  |

### ItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | The additional css class | string | - |  |
| dropdownProps | The dropdown props | [Dropdown](/components/dropdown) | - |  |
| href | Target of hyperlink. Can not work with `path` | string | - |  |
| path | Connected path. Each path will connect with prev one. Can not work with `href` | string | - |  |
| menu | The menu props | [MenuProps](/components/menu/#api) | - |  |
| onClick | Set the handler to handle click event | (e:MouseEvent) => void | - |  |
| title | item name | ReactNode | - |  |

### Use with browserHistory

The link of Breadcrumb item targets `#` by default, you can use `itemRender` to make a `ConfigProvider` Link.

```jsx
import React from 'react';
import { ConfigProvider } from 'metis-ui';

// ...
const Demo: React.FC = () => (
  <ConfigProvider link={{ history: 'browser', base: '/' }}>
    <App />
  </ConfigProvider>
);

export default Demo;
```
