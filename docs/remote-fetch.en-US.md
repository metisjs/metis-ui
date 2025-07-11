---
group:
  title: Advanced
order: 7
title: Fetch remote data
---

In `metisui`, data display components such as [`AutoComplete`](/components/auto-complete#auto-complete-demo-request), [`Cascader`](/components/cascader#cascader-demo-request), [`List`](/components/list#list-demo-remote-load), [`Select`](/components/select#src-components-select-demo-request), [`Table`](/components/table#src-components-table-demo-request), and [`Tree`](/components/tree#src-components-tree-demo-remote) all support automatic remote data loading via the `request` property. The `request` property automatically manages loading states and, when the component supports pagination or lazy loading, handles data concatenation and pagination logic internally, simplifying business development.

The internal implementation of `request` is based on [`ahook/useRequest`](https://ahooks.js.org/hooks/use-request/index), supporting all properties except `manual` and `refreshDepsAction`.

The expected API response type is:

```tsx
type ResponseData<TData extends Record<string, []>> = {
  data: TData[]; // dataset
  total?: number; // required only for pagination or lazy loading
};
```

If your backend response type differs, you can define an adapter at the request layer to convert it.

```tsx
/**
 *  Suppose the response type is:
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

  // Check for paginated API, adjust as needed
  if (Array.isArray(data.list) && 'total' in data) {
    return {
      ...responseData,
      data: data.list,
      total: data.total,
    };
  }

  return responseData;
});
```

## Basic Usage

```tsx
const fetchUsers = () => {...};

<Select options={[...]} request={fetchUsers}/>

// OR

<Select options={[...]} request={{
  service: fetchUsers,
  options: {
    ... // useRequest options
  }
}}/>
```

## Lazy Loading or Pagination + Search Filtering

When lazy loading or pagination is enabled, pagination info will be passed as the first argument to the request function.

```tsx
const fetchUsers = ({
  current: number,
  pageSize: number,
  filters: { [key: string]: string },
}, /* other parameters */) => {...};

<Select options={[...]} request={fetchUsers} lazyLoad/>

// OR

<Select options={[...]} request={{
  service: fetchUsers,
  options: {
    ... // useRequest options
  }
}}
lazyLoad
/>
```

> Translate by ChartGPT
