---
group:
  title: 进阶使用
  order: 1
order: 2
title: 结构化 class-name
---

Metis UI 组件 `className` 属性并非我们常见的 `string` 类型，而是支持多种类型的混合类型，这样做的目的是为了方便使用者使用 `tailwindcss` 样式覆盖默认的组件样式。

本文将带你了解 `className` 各种类型的使用方法。

## 字符串

和传统用法一致，className会作用于组件的根节点。

```tsx | demo
/**
 * readonly: true
 */
import { MagnifyingGlassOutline } from '@metisjs/icons';
import { Button } from 'metis-ui';

export default () => (
  <Button
    type="primary"
    icon={<MagnifyingGlassOutline />}
    className="bg-pink-500 text-white enabled:hover:bg-pink-400"
  >
    Search
  </Button>
);
```

## JSON 对象

可以自定义组件子元素的样式。

具体类型会根据组件不同，而各不相同，你可以通过[组件 API](/components/card-cn#semantic-dom)了解。

```tsx | demo
/**
 * readonly: true
 */
import { Card } from 'metis-ui';

export default () => (
  <Card
    title="Title"
    className={{
      root: 'w-75',
      header: 'bg-pink-400',
      body: 'bg-pink-200 p-3',
      title: 'text-primary',
    }}
  >
    Card content
  </Card>
);
```

## Function 对象

可以根据组件不同状态，定义不同的样式。

具体参数会根据组件不同，而各不相同，你可以通过[组件 API](/components/tree-cn#semantic-dom)了解。

```tsx | demo
/**
 * readonly: true
 */
import { DocumentTextSolid, FolderCloseSolid, FolderOpenSolid } from '@metisjs/icons';
import { clsx, Tree } from 'metis-ui';

export default () => (
  <Tree
    showIcon
    defaultExpandedKeys={['0-0']}
    defaultSelectedKeys={['0-0-0-0']}
    treeData={[
      {
        title: 'parent 1',
        key: '0-0',
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
    ]}
    className={{
      root: 'w-[240px]',
      node: ({ selected, expanded, leaf, halfChecked, checked }) =>
        clsx({
          'bg-pink-200': selected,
          'text-pink-500': selected && leaf,
        }),
    }}
  />
);
```
