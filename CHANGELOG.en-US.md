---
order: 2
title: Changelog
timeline: true
---

Follows [Semantic Versioning 2.0.0](http://semver.org/).

## 1.4.0

`2026-03-22`

- 💄 Added `filters` and `sorter` parameters to `Table` component `toolbar` when it's a function type.

## 1.3.0

`2026-03-22`

- 💄 Added `responseData` parameter to `extraRender` of `Table` component to return original request data.
- 🐞 Fixed `message` component transparent overlay blocking lower layer elements from receiving events.

## 1.2.1

`2025-09-17`

- 🐞 Fixed incorrect reverse scroll loading position in `List` when virtual rendering is disabled.

## 1.2.0

`2025-08-07`

- 💄 Added `alignToBottom`, `atEdgeThreshold`, `followOutput` properties to `List`, `lazyLoad` now supports setting scroll loading direction.
- 💄 Added `setDataSource` method to `List`.
- 💄 Added `setDataSource` method to `Table`.
- 💄 Added `setTreeData` method to `Tree`.
- 🔧 Refactored the internal `VirtualList` component implementation logic.
- 💄 `Image` styles now support `img` element configuration.

## 1.1.5

`2025-07-29`

- 🐞 Fixed the issue where the `ellipsis.showTitle` property of the `Table` component was ineffective.
- 🐞 Fixed a style error in the `Select` component after packaging, caused by the use of the `rc-overflow` patch.

## 1.1.4

`2025-07-28`

- 🔧 Added `reload` method to `List`.
- 🐞 Fixed some style issues with `Modal`.
- 🐞 Fixed ineffective scroll loading in `List`.
- 🐞 Fixed file status update error in `Upload` caused by closure.

## 1.1.3

`2025-07-25`

- 🐞 Fixed type definition issue for `request` parameters within components.

## 1.1.2

`2025-07-24`

- 💄 Changed theme color `text` from `gray-950` to `gray-900`.
- 💄 Optimized some styles of the `table` component.
- 🐞 Fixed style error when `table` is in fullscreen mode.

## 1.1.1

`2025-07-22`

- 🐞 Fixed missing type definitions for some components after build and release.
- 🐞 Fixed some style issues with `tabs`.
- 🐞 Fixed some style issues with `segmented`.
- 🐞 Fixed animation style issue with `badge`.

## 1.1.0

`2025-07-10`

- 🐞 Fix `Tree` switcher icon not displaying issue in Safari browser.
- 💄 Add `elevated` background color to theme for floating layers, affecting dark theme styles of `Select`, `Dropdown`, `Popover`, and `Tour` components.
- 🔧 Removed support for the `route` property in the `ConfigProvider` component.

## 1.0.4

`2025-06-10`

- 💄 Adjusted styles for `Button` component with `type=text`.
- 💄 Adjusted styles for `Layout.sider` component with `theme=dark`.
- 💄 Adjusted styles for `Menu` component with `theme=dark`.

## 1.0.3

`2025-06-09`

- 🐞 Fix incorrect `locale` file path.
- 💄 Adjust selected state styles for the `Menu` component.

## 1.0.2

`2025-05-21`

- 🐞 Fix the error when customizing the `footer` in `Modal.confirm`.[#6](https://github.com/metisjs/metis-ui/issues/6)
- 💄 Fix the mask style issue of `QRCode` in dark theme.
- 💄 Fix some style issues of `Notification`.

## 1.0.1

`2025-04-29`

🐞 Fix `TimePicker` style error.[#2](https://github.com/metisjs/metis-ui/issues/2)

## 1.0.0

`2025-04-28`

🎉 🎉 🎉 After a year of development, version 1.0 is finally released! the project will continue to be actively maintained and iterated. Any issues will be addressed promptly. Come and give it a try!
