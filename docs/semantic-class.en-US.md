---
group:
  title: Advanced
  order: 1
order: 2
title: Semantic class-name
---

The `className` property of Metis UI components is not the common `string` type but supports multiple mixed types. This design aims to make it easier for users to override the default component styles using `tailwindcss`.

This article will guide you through the various types of `className` usage.

## String

Similar to traditional usage, `className` applies to the root node of the component.

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

## JSON Object

You can customize the styles of the component's child elements.

The specific types vary depending on the component. You can refer to the [Component API](/components/card#semantic-dom) for details.

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

## Function Object

You can define different styles based on the component's state.

The specific parameters vary depending on the component. You can refer to the [Component API](/components/tree#semantic-dom) for details.

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

> Translate by ChartGPT
