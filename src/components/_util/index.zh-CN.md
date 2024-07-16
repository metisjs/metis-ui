---
title: Util
subtitle: 工具类
description: 辅助开发，提供一些常用的工具方法。
demo:
  cols: 2
group:
  title: 其他
  order: 99
---

## GetRef

获取组件的 `ref` 属性定义，这对于未直接暴露或者子组件的 `ref` 属性定义非常有用。

```tsx
import type { GetRef } from 'metis-ui';
import { Select } from 'metis-ui';

type SelectRefType = GetRef<typeof Select>; // BaseSelectRef
```

## GetProps

获取组件的 `props` 属性定义：

```tsx
import type { GetProps } from 'metis-ui';
import { Checkbox } from 'metis-ui';

type CheckboxGroupType = GetProps<typeof Checkbox.Group>;
```

## GetProp

获取组件的单个 `props` 属性定义。它已经将 `NonNullable` 进行了封装，所以不用在考虑为空的情况：

```tsx
import type { GetProp, SelectProps } from 'metis-ui';
import { Select } from 'metis-ui';

// 以下两种都可以生效
type SelectOptionType1 = GetProp<SelectProps, 'options'>[number];
type SelectOptionType2 = GetProp<typeof Select, 'options'>[number];
```
