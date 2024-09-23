---
title: Steps
description: A navigation bar that guides users through the steps of a task.
group: Navigation
---

## When To Use

When a given task is complicated or has a certain sequence in the series of subtasks, we can decompose it into several steps to make things easier.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/small-size.tsx">Mini version</code>
<code src="./demo/icon.tsx">With icon</code>
<code src="./demo/step-next.tsx">Switch Step</code>
<code src="./demo/vertical.tsx">Vertical</code>
<code src="./demo/vertical-small.tsx">Vertical mini version</code>
<code src="./demo/error.tsx">Error status</code>
<code src="./demo/simple.tsx">Simple Steps</code>
<code src="./demo/clickable.tsx">Clickable</code>
<code src="./demo/nav.tsx">Navigation Steps</code>
<code src="./demo/progress.tsx">Steps with progress</code>
<code src="./demo/progress-debug.tsx" debug>Progress Debug</code>
<code src="./demo/steps-in-steps.tsx" debug>Steps inside Steps</code>

<!-- TODO: List组件待开发 -->
<!-- <code src="./demo/inline.tsx">Inline Steps</code> -->

## API

### Steps

The whole of the step bar.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | string \| Record<'root' \| 'item' \| 'title' \| 'description', string> | - |  |
| current | To set the current step, counting from 0. You can overwrite this state by using `status` of `Step` | number | 0 |  |
| direction | To specify the direction of the step bar, `horizontal` or `vertical` | string | `horizontal` |  |
| initial | Set the initial step, counting from 0 | number | 0 |  |
| percent | Progress circle percentage of current step in `process` status (only works on basic Steps) | number | - |  |
| responsive | Change to vertical direction when screen width smaller than `640px` | boolean | true |  |
| size | To specify the size of the step bar, `default` and `small` are currently supported | string | `default` |  |
| status | To specify the status of current step, can be set to one of the following values: `wait` `process` `finish` `error` | string | `process` |  |
| type | Type of steps, can be set to one of the following values: `default` `navigation` `inline` `simple` | string | `default` |  |
| onChange | Trigger when Step is changed | (current) => void | - |  |
| items | StepItem content | [StepItem](#stepitem) | [] |  |

### StepItem

A single step in the step bar.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| description | Description of the step, optional property | ReactNode | - |  |
| disabled | Disable click | boolean | false |  |
| icon | Icon of the step, optional property | ReactNode | - |  |
| status | To specify the status. It will be automatically set by `current` of `Steps` if not configured. Optional values are: `wait` `process` `finish` `error` | string | `wait` |  |
| title | Title of the step | ReactNode | - |  |
