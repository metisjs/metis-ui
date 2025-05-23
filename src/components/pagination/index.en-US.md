---
title: Pagination
description: A long list can be divided into several pages, and only one page will be loaded at a time.
group:
  title: Navigation
---

## When To Use

- When it will take a long time to load/render all items.
- If you want to browse the data by navigating through pages.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/more.tsx">More</code>
<code src="./demo/changer.tsx">Changer</code>
<code src="./demo/jump.tsx">Jumper</code>
<code src="./demo/size.tsx">Size</code>
<code src="./demo/simple.tsx">Simple mode</code>
<code src="./demo/controlled.tsx">Controlled</code>
<code src="./demo/total.tsx">Total number</code>
<code src="./demo/all.tsx">Show All</code>
<code src="./demo/item-render.tsx">Prev and next</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| current | Current page number | number | - |  |
| defaultCurrent | Default initial page number | number | 1 |  |
| defaultPageSize | Default number of data items per page | number | 10 |  |
| disabled | Disable pagination | boolean | - |  |
| hideOnSinglePage | Whether to hide pager on single page | boolean | false |  |
| itemRender | To customize item's innerHTML | (page, type: 'page', 'prev', 'next', originalElement) => React.ReactNode | - |  |
| pageSize | Number of data items per page | number | - |  |
| pageSizeOptions | Specify the sizeChanger options | string\[], number\[] | \[`10`, `20`, `50`, `100`] |  |
| responsive | If `size` is not specified, `Pagination` would resize according to the width of the window | boolean | - |  |
| showLessItems | Show less page items | boolean | false |  |
| showQuickJumper | Determine whether you can jump to pages directly | boolean | false |  |
| showSizeChanger | Determine whether to show `pageSize` select | boolean | - |  |
| showTitle | Show page item's title | boolean | true |  |
| showTotal | To display the total number and range | function(total, range) | - |  |
| simple | Whether to use simple mode | boolean, {readOnly: boolean} | - |  |
| size | Specify the size of `Pagination`, can be set to `small` and `mini` | `default`, `small`, `mini` | `default` |  |
| total | Total number of data items | number | 0 |  |
| onChange | Called when the page number or `pageSize` is changed, and it takes the resulting page number and pageSize as its arguments | function(page, pageSize) | - |  |
| onShowSizeChange | Called when `pageSize` is changed | function(current, size) | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
