---
title: Checkbox
description: Collect user's choices.
group: Data Entry
demo:
  cols: 2
---

## When To Use

- Used for selecting multiple values from several options.
- If you use only one checkbox, it is the same as using Switch to toggle between two states. The difference is that Switch will trigger the state change directly, but Checkbox just marks the state as changed and this needs to be submitted.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/disabled.tsx">Disabled</code>
<code src="./demo/controller.tsx">Controlled Checkbox</code>
<code src="./demo/group.tsx">Checkbox Group</code>
<code src="./demo/check-all.tsx">Check all</code>
<code src="./demo/layout.tsx">Use with Grid</code>

## API

#### Checkbox

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoFocus | If get focus when component mounted | boolean | false |  |
| checked | Specifies whether the checkbox is selected | boolean | false |  |
| className | Semantic DOM class | [SemanticDOM](#checkbox-2) | - |  |
| defaultChecked | Specifies the initial state: whether or not the checkbox is selected | boolean | false |  |
| disabled | If disable checkbox | boolean | false |  |
| indeterminate | The indeterminate checked state of checkbox | boolean | false |  |
| onChange | The callback function that is triggered when the state changes | (e: CheckboxChangeEvent) => void | - |  |

#### Checkbox Group

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | [SemanticDOM](#checkbox-group-1) | - |  |
| defaultValue | Default selected value | (string, number)\[] | \[] |  |
| disabled | If disable all checkboxes | boolean | false |  |
| name | The `name` property of all `input[type="checkbox"]` children | string | - |  |
| options | Specifies options | string\[], number\[], Option\[] | \[] |  |
| value | Used for setting the currently selected value | (string, number, boolean)\[] | \[] |  |
| onChange | The callback function that is triggered when the state changes | (checkedValue: T\[]) => void | - |  |

##### Option

```typescript
interface Option {
  label: string;
  value: string;
  disabled?: boolean;
  className?: string | { root?: string; checkbox?: string };
}
```

### Methods

#### Checkbox

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | Remove focus |         |
| focus() | Get focus    |         |

## Semantic DOM

### Checkbox

<code src="./demo/_semantic_basic.tsx" simplify></code>

### Checkbox Group

<code src="./demo/_semantic_group.tsx" simplify></code>
