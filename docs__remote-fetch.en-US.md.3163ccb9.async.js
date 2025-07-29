"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[6806],{76054:function(r,n,t){t.r(n);var i=t(37496),u=t(82857),c=t(91238),m=t(83120),p=t(48415),h=t(95300),x=t(11024),v=t(65110),I=t(10006),f=t(18637),E=t(741),j=t(30166),s=t(91512),a=t(35055),o=t(30158),d=t(39546),_=t(1873),e=t(74132);function l(){return(0,e.jsx)(a.DumiPage,{children:(0,e.jsx)(d.Suspense,{fallback:(0,e.jsx)(o.Z,{}),children:(0,e.jsx)(e.Fragment,{children:(0,e.jsxs)("div",{className:"markdown",children:[(0,e.jsxs)("p",{children:[_.texts[0].value,(0,e.jsx)("code",{children:_.texts[1].value}),_.texts[2].value,(0,e.jsx)(a.Link,{to:"/components/auto-complete#auto-complete-demo-request",children:(0,e.jsx)("code",{children:_.texts[3].value})}),_.texts[4].value,(0,e.jsx)(a.Link,{to:"/components/cascader#cascader-demo-request",children:(0,e.jsx)("code",{children:_.texts[5].value})}),_.texts[6].value,(0,e.jsx)(a.Link,{to:"/components/list#list-demo-remote-load",children:(0,e.jsx)("code",{children:_.texts[7].value})}),_.texts[8].value,(0,e.jsx)(a.Link,{to:"/components/select#src-components-select-demo-request",children:(0,e.jsx)("code",{children:_.texts[9].value})}),_.texts[10].value,(0,e.jsx)(a.Link,{to:"/components/table#src-components-table-demo-request",children:(0,e.jsx)("code",{children:_.texts[11].value})}),_.texts[12].value,(0,e.jsx)(a.Link,{to:"/components/tree#src-components-tree-demo-remote",children:(0,e.jsx)("code",{children:_.texts[13].value})}),_.texts[14].value,(0,e.jsx)("code",{children:_.texts[15].value}),_.texts[16].value,(0,e.jsx)("code",{children:_.texts[17].value}),_.texts[18].value]}),(0,e.jsxs)("p",{children:[_.texts[19].value,(0,e.jsx)("code",{children:_.texts[20].value}),_.texts[21].value,(0,e.jsx)("a",{href:"https://ahooks.js.org/hooks/use-request/index",children:(0,e.jsx)("code",{children:_.texts[22].value})}),_.texts[23].value,(0,e.jsx)("code",{children:_.texts[24].value}),_.texts[25].value,(0,e.jsx)("code",{children:_.texts[26].value}),_.texts[27].value]}),(0,e.jsx)("p",{children:_.texts[28].value}),(0,e.jsx)(s.Z,{lang:"tsx",children:_.texts[29].value}),(0,e.jsx)("p",{children:_.texts[30].value}),(0,e.jsx)(s.Z,{lang:"tsx",children:_.texts[31].value}),(0,e.jsxs)("h2",{id:"basic-usage",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#basic-usage",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Basic Usage"]}),(0,e.jsx)(s.Z,{lang:"tsx",children:_.texts[32].value}),(0,e.jsxs)("h2",{id:"lazy-loading-or-pagination--search-filtering",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#lazy-loading-or-pagination--search-filtering",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Lazy Loading or Pagination + Search Filtering"]}),(0,e.jsx)("p",{children:_.texts[33].value}),(0,e.jsx)(s.Z,{lang:"tsx",children:_.texts[34].value}),(0,e.jsx)("blockquote",{children:(0,e.jsx)("p",{children:_.texts[35].value})})]})})})})}n.default=l},1873:function(r,n,t){t.r(n),t.d(n,{texts:function(){return i}});const i=[{value:"In ",paraId:0},{value:"metisui",paraId:0},{value:", data display components such as ",paraId:0},{value:"AutoComplete",paraId:1},{value:", ",paraId:0},{value:"Cascader",paraId:2},{value:", ",paraId:0},{value:"List",paraId:3},{value:", ",paraId:0},{value:"Select",paraId:4},{value:", ",paraId:0},{value:"Table",paraId:5},{value:", and ",paraId:0},{value:"Tree",paraId:6},{value:" all support automatic remote data loading via the ",paraId:0},{value:"request",paraId:0},{value:" property. The ",paraId:0},{value:"request",paraId:0},{value:" property automatically manages loading states and, when the component supports pagination or lazy loading, handles data concatenation and pagination logic internally, simplifying business development.",paraId:0},{value:"The internal implementation of ",paraId:7},{value:"request",paraId:7},{value:" is based on ",paraId:7},{value:"ahook/useRequest",paraId:7},{value:", supporting all properties except ",paraId:7},{value:"manual",paraId:7},{value:" and ",paraId:7},{value:"refreshDepsAction",paraId:7},{value:".",paraId:7},{value:"The expected API response type is:",paraId:8},{value:`type ResponseData<TData extends Record<string, []>> = {
  data: TData[]; // dataset
  total?: number; // required only for pagination or lazy loading
};
`,paraId:9},{value:"If your backend response type differs, you can define an adapter at the request layer to convert it.",paraId:10},{value:`/**
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
  if (Array.isArray(data?.list) && 'total' in data) {
    return {
      ...responseData,
      data: data.list,
      total: data.total,
    };
  }

  return responseData;
});
`,paraId:11},{value:`const fetchUsers = () => {...};

<Select options={[...]} request={fetchUsers}/>

// OR

<Select options={[...]} request={{
  service: fetchUsers,
  options: {
    ... // useRequest options
  }
}}/>
`,paraId:12,tocIndex:0},{value:"When lazy loading or pagination is enabled, pagination info will be passed as the first argument to the request function.",paraId:13,tocIndex:1},{value:`const fetchUsers = ({
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
`,paraId:14,tocIndex:1},{value:"Translate by ChartGPT",paraId:15,tocIndex:1}]}}]);
