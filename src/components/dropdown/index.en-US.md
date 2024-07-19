---
title: Dropdown
description: A dropdown list.
group: Navigation
demo:
  cols: 2
---

## When To Use

When there are more than a few options to choose from, you can wrap them in a `Dropdown`. By hovering or clicking on the trigger, a dropdown menu will appear, which allows you to choose an option and execute the relevant action.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/placement.tsx">Placement</code>
<code src="./demo/arrow.tsx">Arrow</code>
<code src="./demo/item.tsx">Other elements</code>
<code src="./demo/arrow-center.tsx">Arrow pointing at the center</code>
<code src="./demo/trigger.tsx">Trigger mode</code>
<code src="./demo/event.tsx">Click event</code>
<code src="./demo/dropdown-button.tsx">Button with dropdown menu</code>
<code src="./demo/custom-dropdown.tsx">Custom dropdown</code>
<code src="./demo/sub-menu.tsx">Cascading menu</code>
<code src="./demo/overlay-open.tsx">The way of hiding menu.</code>
<code src="./demo/context-menu.tsx">Context Menu</code>
<code src="./demo/loading.tsx">Loading</code>
<code src="./demo/selectable.tsx">Selectable Menu</code>
<code src="./demo/menu-full.tsx" debug>Menu full styles</code>
<code src="./demo/icon-debug.tsx" debug>Icon debug</code>

## API

### Dropdown

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| arrow | Whether the dropdown arrow should be visible | boolean \| { pointAtCenter: boolean } | false |  |
| autoAdjustOverflow | Whether to adjust dropdown placement automatically when dropdown is off screen | boolean | true |  |
| autoFocus | Focus element in `overlay` when opened | boolean | false |  |
| className | Semantic DOM class | string \| Record<'root' \| 'overlay' \| 'open', string> | - |  |
| disabled | Whether the dropdown menu is disabled | boolean | - |  |
| destroyPopupOnHide | Whether destroy dropdown when hidden | boolean | false |  |
| popupRender | Customize dropdown content | (menus: ReactNode) => ReactNode | - |  |
| getPopupContainer | To set the container of the dropdown menu. The default is to create a div element in body, but you can reset it to the scrolling area and make a relative reposition. | (triggerNode: HTMLElement) => HTMLElement | () => document.body |  |
| menu | The menu props | [MenuProps](/components/menu/#api) | - |  |
| placement | Placement of popup menu: `bottom` `bottomLeft` `bottomRight` `top` `topLeft` `topRight` | string | `bottomLeft` |  |
| trigger | The trigger mode which executes the dropdown action. Note that hover can't be used on touchscreens | Array&lt;`click`\|`hover`\|`contextMenu`> | \[`hover`] |  |
| open | Whether the dropdown menu is currently open | boolean | - |  |
| onOpenChange | Called when the open state is changed. Not trigger when hidden by click item. | (open: boolean) => void | - |  |

### Dropdown.Button

Same props from Dropdown. And includes additional props:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| buttonsRender | Custom buttons inside Dropdown.Button | (buttons: ReactNode\[]) => ReactNode\[] | - |  |
| loading | Set the loading status of button | boolean \| { delay: number } | false |  |
| danger | Set the danger status of button | boolean | - |  |
| icon | Icon (appears on the right) | ReactNode | - |  |
| size | Size of the button, the same as [Button](/components/button/#api) | string | `default` |  |
| type | Type of the button, the same as [Button](/components/button/#api) | string | `default` |  |
| onClick | The same as [Button](/components/button/#api): called when you click the button on the left | (event) => void | - |  |

## Note

Please ensure that the child node of `Dropdown` accepts `onMouseEnter`, `onMouseLeave`, `onFocus`, `onClick` events.

## FAQ

### How to prevent Dropdown from being squeezed when it exceeds the screen horizontally?

You can use `width: max-content` style to handle this.
