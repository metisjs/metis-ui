---
group:
  title: 进阶使用
order: 7
title: 加载远程数据
---

在 `metisui` 中，数据展示类组件如 [`AutoComplete`](/components/auto-complete-cn#auto-complete-demo-request)、[`Cascader`](/components/cascader-cn#cascader-demo-request)、[`List`](/components/list-cn#list-demo-remote-load)、[`Select`](/components/select-cn#src-components-select-demo-request)、[`Table`](/components/table-cn#src-components-table-demo-request) 和 [`Tree`](/components/tree-cn#src-components-tree-demo-remote) 均支持通过配置 `request` 属性自动加载远程数据。`request` 会自动管理加载状态，并在组件支持分页或懒加载时，内部处理数据拼接和分页逻辑，从而简化业务开发流程。

`request` 内部实现基于[`ahook/useRequest`](https://ahooks.js.org/zh-CN/hooks/use-request/index), 支持除 `manual` 和 `refreshDepsAction` 之外的所有属性。

我们约定的准备的接口返回类型为：

```tsx
type ResponseData<TData extends Record<string, []>> = {
  data: TData[]; // 数据集
  total?: number; // 只有在分页或懒加载时需要
};
```

如果你的后端数据返回类型和我们的不一样，可以在请求层定义一个适配器来转换它。

```tsx
/**
 *  假设返回类型为:
 *  {
 *    success: true,
 *    data: {
 *      list: [...],
 *      total: 100
 *    }
 *  }
 */
const request = axios.create({
  baseURL: import.meta.env.VITE_API_PREFIX,
  timeout: 10000,
});

request.interceptors.response.use((response) => {
  const { data: responseData } = response;
  const { success, data } = responseData;

  // 判断分页接口，根据实际情况调整
  if (Array.isArray(data?.list) && 'total' in data) {
    return {
      ...responseData,
      data: data.list,
      total: data.total,
    };
  }

  return responseData;
});
```

## 基础使用

```tsx
const fetchUsers = () => {...};

<Select options={[...]} request={fetchUsers}/>

// OR

<Select options={[...]} request={{
  service: fetchUsers
  options:{
    ... // useRequest options
  }
}}/>
```

## 懒加载或分页 + 搜索过滤

当开启懒加载或分页时，分页信息将作为第一个参数传递给请求方法。

```tsx
const fetchUsers = ({
  current: number;
  pageSize: number;
  filters: { [key: string]: string };
},/* 其他传入参数 */) => {...};

<Select options={[...]} request={fetchUsers} lazyLoad/>

// OR

<Select options={[...]} request={{
  service: fetchUsers
  options:{
    ... // useRequest options
  }
}}
lazyLoad
/>
```
