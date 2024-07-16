---
title: Util
description: Utilities are used to assist development and provide some common utility methods.
demo:
  cols: 2
group:
  title: Other
---

## GetRef

Get the `ref` property definition of the component, which is very useful for components that are not directly exposed or child components.

```tsx
import type { GetRef } from 'metis-ui';
import { Select } from 'metis-ui';

type SelectRefType = GetRef<typeof Select>; // BaseSelectRef
```

## GetProps

Get the `props` property definition of the component:

```tsx
import type { GetProps } from 'metis-ui';
import { Checkbox } from 'metis-ui';

type CheckboxGroupType = GetProps<typeof Checkbox.Group>;
```

## GetProp

Get the single `props` property definition of the component. It has encapsulated `NonNullable`, so you don't have to worry about it being empty:

```tsx
import type { GetProp, SelectProps } from 'metis-ui';
import { Select } from 'metis-ui';

// Both of these can work
type SelectOptionType1 = GetProp<SelectProps, 'options'>[number];
type SelectOptionType2 = GetProp<typeof Select, 'options'>[number];
```
