---
title: Radio
description: Radio.
group: Data Entry
---

## When To Use

- Used to select a single state from multiple options.
- The difference from Select is that Radio is visible to the user and can facilitate the comparison of choice, which means there shouldn't be too many of them.

## Examples

<!-- prettier-ignore-start -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/disabled.tsx">disabled</code>
<code src="./demo/radiogroup.tsx">Radio Group</code>
<code src="./demo/radiogroup-more.tsx">Vertical Radio.Group</code>
<code src="./demo/radiogroup-options.tsx">Radio.Group group - optional</code>
<code src="./demo/radiogroup-with-name.tsx">Radio.Group with name</code>
<!-- prettier-ignore-end -->

## API

### Radio

| Property | Description | Type | Default |
| --- | --- | --- | --- | --- |
| autoFocus | Whether get focus when component mounted | boolean | false |
| checked | Specifies whether the radio is selected | boolean | false |
| className | Semantic DOM class | string \|Record<'root' \| 'radio', string> | - |  |
| defaultChecked | Specifies the initial state: whether or not the radio is selected | boolean | false |
| disabled | Disable radio | boolean | false |
| value | According to value for comparison, to determine whether the selected | any | - |

### RadioGroup

Radio group can wrap a group of `Radio`。

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | Default selected value | any | - |  |
| disabled | Disable all radio buttons | boolean | false |  |
| name | The `name` property of all `input[type="radio"]` children | string | - |  |
| options | Set children optional | string\[] \| number\[] \| Option\[]> | - |  |
| value | Used for setting the currently selected value | any | - |  |
| onChange | The callback function that is triggered when the state changes | function(e:Event) | - |  |

#### Option

```typescript
interface Option {
  label: string;
  value: string;
  disabled?: boolean;
  className?: string | { root?: string; radio?: string };
}
```

## Methods

### Radio

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |
