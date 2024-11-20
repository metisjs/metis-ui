---
group: Data Display
title: List
description: Basic list display, which can carry text, lists, pictures, paragraphs.
---

## When To Use

A list can be used to display content related to a single subject. The content can consist of multiple elements of varying type and size.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic list</code>
<code src="./demo/remote-load.tsx">Remote load</code>
<code src="./demo/scroll-load.tsx">Scroll load</code>
<code src="./demo/virtual-list.tsx">Virtual list</code>

## API

### List

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| bordered | Toggles rendering of the border around the list | boolean | false |  |
| dataSource | DataSource array for list | any\[] | - |  |
| footer | List footer renderer | ReactNode | - |  |
| header | List header renderer | ReactNode | - |  |
| loading | Shows a loading indicator while the contents of the list are being fetched | boolean \| [SpinProps](/components/spin/#api) | false |  |
| locale | The i18n text | {emptyText?: string, noMoreText?: string} | {emptyText: `No Data`} |  |
| renderItem | Customize list item when using `dataSource` | (item) => ReactNode | - |  |
| rowKey | Item's unique value, could be an Item's key which holds a unique value of type `React.Key` or function that receives Item and returns a `React.Key` | `keyof` T \| (item: T) => `React.Key` | `"key"` |  |
| split | Toggles rendering of the split under the list item | boolean | true |  |
| lazyLoad | Scroll load, effective only when using the `request` configuration. | boolean | false |  |
| request | Method to fetch remote data | `RequestConfig` | - |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| virtual | Use virtual list | boolean \| [VirtuosoProps](https://virtuoso.dev/virtuoso-api/interfaces/VirtuosoProps/) | - |  |

### List.Item

| Property  | Description                       | Type                         | Default | Version |
| --------- | --------------------------------- | ---------------------------- | ------- | ------- |
| actions   | The actions content of list item. | Array&lt;ReactNode>          | -       |         |
| extra     | The extra content of list item.   | ReactNode                    | -       |         |
| className | Semantic DOM class                | [SemanticDOM](#semantic-dom) | -       |         |

### List.Item.Meta

| Property    | Description                  | Type                         | Default | Version |
| ----------- | ---------------------------- | ---------------------------- | ------- | ------- |
| avatar      | The avatar of list item      | ReactNode                    | -       |         |
| description | The description of list item | ReactNode                    | -       |         |
| title       | The title of list item       | ReactNode                    | -       |         |
| className   | Semantic DOM class           | [SemanticDOM](#semantic-dom) | -       |         |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
