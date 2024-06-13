---
title: Transition
subtitle: Animation Transitions
group:
  title: Others
  order: 6
---

Allows you to add enter/leave transitions to conditionally rendered elements using CSS classes to control the transition styles at different stages.

## Code Demonstration

<!-- prettier-ignore -->
<code src="./demo/basic.tsx" description="Transition accepts a `visible` prop to control whether it should show or hide, along with a set of lifecycle props (e.g., enterFrom and leaveTo) that allow you to add CSS classes at specific stages of the transition.">Show/Hide</code>
<code src="./demo/list.tsx" description="A set of animated lists">List</code>

## API

### Transition

| Parameter | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| visible | Whether the child element should be visible or hidden | boolean | - | - |
| appear | Whether the animation should run on initialization | boolean | false | - |
| removeOnLeave | Whether the element should be unmounted or hidden based on the visible state | boolean | true | - |
| enter | `enter` phase class or style added to the element | string \| CSSProperties | - | - |
| enterFrom | Class or style added before the `enter` phase begins | string \| CSSProperties | - | - |
| enterTo | Class or style added immediately after the `enter` phase begins | string \| CSSProperties | - | - |
| leave | `leave` phase class or style added to the element | string \| CSSProperties | - | - |
| leaveFrom | Class or style added before the `leave` phase begins | string \| CSSProperties | - | - |
| leaveTo | Class or style added immediately after the `leave` phase begins | string \| CSSProperties | - | - |
| beforeEnter | Callback before the state transition | () => void | - | - |
| afterEnter | Callback after the state transition | () => void | - | - |
| beforeLeave | Callback before the state transition | () => void | - | - |
| afterLeave | Callback after the state transition | () => void | - | - |
| onVisibleChanged | Callback after the visible changed | (visible: boolean) => void | - |  |

### TransitionList

Inherits all properties from [Transition](#Transition).

| Parameter | Description          | Type                          | Default | Version |
| --------- | -------------------- | ----------------------------- | ------- | ------- |
| keys      | Transition list keys | React.Key[]                   | -       | -       |
| component | Wrapper component    | string \| React.ComponentType | div     | -       |
