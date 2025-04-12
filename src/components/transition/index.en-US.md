---
title: Transition
description: Allows you to add enter/leave transitions to conditionally rendered elements using CSS classes to control the transition styles at different stages.
group: Other
---

## Code Demonstration

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Show/Hide</code>
<code src="./demo/list.tsx">List</code>

## API

### Transition

| Parameter | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterEnter | Callback after the state transition | () => void | - | - |
| afterLeave | Callback after the state transition | () => void | - | - |
| appear | Whether the animation should run on initialization | boolean | true | - |
| beforeEnter | Callback before the state transition | () => void | - | - |
| beforeLeave | Callback before the state transition | () => void | - | - |
| enter | `enter` phase class or style added to the element | string, CSSProperties | - | - |
| enterFrom | Class or style added before the `enter` phase begins | string, CSSProperties | - | - |
| enterTo | Class or style added immediately after the `enter` phase begins | string, CSSProperties | - | - |
| leave | `leave` phase class or style added to the element | string, CSSProperties | - | - |
| leaveFrom | Class or style added before the `leave` phase begins | string, CSSProperties | - | - |
| leaveTo | Class or style added immediately after the `leave` phase begins | string, CSSProperties | - | - |
| removeOnLeave | Whether the element should be unmounted or hidden based on the visible state | boolean | true | - |
| visible | Whether the child element should be visible or hidden | boolean | - | - |
| onVisibleChanged | Callback after the visible changed | (visible: boolean) => void | - |  |

### TransitionList

Inherits all properties from [Transition](#Transition).

| Parameter | Description          | Type                        | Default | Version |
| --------- | -------------------- | --------------------------- | ------- | ------- |
| component | Wrapper component    | string, React.ComponentType | div     | -       |
| keys      | Transition list keys | React.Key\[]                | -       | -       |
