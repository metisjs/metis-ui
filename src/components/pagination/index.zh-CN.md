---
title: Pagination
subtitle: 分页
description: 分页器用于分隔长列表，每次只加载一个页面。
group:
  title: 导航
---

## 何时使用

- 当加载/渲染所有数据将花费很多时间时；
- 可切换页码浏览数据。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/more.tsx">更多</code>
<code src="./demo/changer.tsx">改变</code>
<code src="./demo/jump.tsx">跳转</code>
<code src="./demo/size.tsx">多种尺寸</code>
<code src="./demo/simple.tsx">简洁</code>
<code src="./demo/controlled.tsx">受控</code>
<code src="./demo/total.tsx">总数</code>
<code src="./demo/all.tsx">全部展示</code>
<code src="./demo/item-render.tsx">上一步和下一步</code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| current | 当前页数 | number | - |  |
| defaultCurrent | 默认的当前页数 | number | 1 |  |
| defaultPageSize | 默认的每页条数 | number | 10 |  |
| disabled | 禁用分页 | boolean | - |  |
| hideOnSinglePage | 只有一页时是否隐藏分页器 | boolean | false |  |
| itemRender | 用于自定义页码的结构，可用于优化 SEO | (page, type: 'page'、 'prev'、 'next', originalElement) => React.ReactNode | - |  |
| pageSize | 每页条数 | number | - |  |
| pageSizeOptions | 指定每页可以显示多少条 | string\[]、 number\[] | \[`10`, `20`, `50`, `100`] |  |
| responsive | 当 size 未指定时，根据屏幕宽度自动调整尺寸 | boolean | - |  |
| showLessItems | 是否显示较少页面内容 | boolean | false |  |
| showQuickJumper | 是否可以快速跳转至某页 | boolean | false |  |
| showSizeChanger | 是否展示 `pageSize` 切换器 | boolean | - |  |
| showTitle | 是否显示原生 tooltip 页码提示 | boolean | true |  |
| showTotal | 用于显示数据总量和当前数据顺序 | function(total, range) | - |  |
| simple | 当添加该属性时，显示为简单分页 | boolean、 {readOnly: boolean} | - |  |
| size | 不同尺寸 | `default`、 `small`、 `mini` | `default` |  |
| total | 数据总数 | number | 0 |  |
| onChange | 页码或 `pageSize` 改变的回调，参数是改变后的页码及每页条数 | function(page, pageSize) | - |  |
| onShowSizeChange | pageSize 变化的回调 | function(current, size) | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
