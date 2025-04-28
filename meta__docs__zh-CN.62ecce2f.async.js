"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[2579],{21371:function(c,a,e){e.d(a,{b:function(){return m}});var i=e(39546),t=e(33101),b=e(87802),I=e(23506),o=e(18537),C=e(34706),g=e(89364),E=e(16013),s=e(41936),l=function(p){(0,E.Z)(v,p);var f=(0,s.Z)(v);function v(){return(0,C.Z)(this,v),f.apply(this,arguments)}return(0,g.Z)(v,[{key:"render",value:function(){return this.props.children}}]),v}(i.Component),u=null,r=e(65056),d={subtree:!0,childList:!0,attributeFilter:["style","class"]};function m(p,f){var v=arguments.length>2&&arguments[2]!==void 0?arguments[2]:d;i.useEffect(function(){if(!(!(0,r.Z)()||!p)){var h,P=Array.isArray(p)?p:[p];return"MutationObserver"in window&&(h=new MutationObserver(f),P.forEach(function(y){h.observe(y,v)})),function(){var y,O;(y=h)===null||y===void 0||y.takeRecords(),(O=h)===null||O===void 0||O.disconnect()}}},[v,p])}var n=function(f){var v=f.children,h=f.options,P=f.onMutate,y=P===void 0?function(){}:P,O=useEvent(y),S=React.useRef(null),T=React.useRef(null),D=React.isValidElement(v)&&supportRef(v),A=useComposeRef(T,D?v.ref:null),B=React.useState(null),R=_slicedToArray(B,2),N=R[0],U=R[1];return useMutateObserver(N,O,h),useLayoutEffect(function(){U(findDOMNode(T.current)||findDOMNode(S.current))}),v?React.createElement(DomWrapper,{ref:S},D?React.cloneElement(v,{ref:A}):v):null},M=null,x=null},90051:function(c,a,e){e.r(a),e.d(a,{demos:function(){return t}});var i=e(39546),t={}},18702:function(c,a,e){e.r(a),e.d(a,{demos:function(){return t}});var i=e(39546),t={}},7465:function(c,a,e){e.r(a),e.d(a,{demos:function(){return t}});var i=e(39546),t={}},56465:function(c,a,e){e.r(a),e.d(a,{demos:function(){return E}});var i=e(90228),t=e.n(i),b=e(87999),I=e.n(b),o=e(39546),C=e(44155),g=e(92475),E={"docs-semantic-class-demo-zh-cn-0":{component:o.memo(o.lazy(I()(t()().mark(function s(){var l,u,r,d;return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,Promise.resolve().then(e.bind(e,44155));case 2:return l=n.sent,u=l.MagnifyingGlassOutline,n.next=6,Promise.resolve().then(e.bind(e,92475));case 6:return r=n.sent,d=r.Button,n.abrupt("return",{default:function(){return o.createElement(d,{type:"primary",icon:o.createElement(u,null),className:"bg-pink-500 text-white enabled:hover:bg-pink-400"},"Search")}});case 9:case"end":return n.stop()}},s)})))),asset:{type:"BLOCK",id:"docs-semantic-class-demo-zh-cn-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { MagnifyingGlassOutline } from '@metisjs/icons';
import { Button } from 'metis-ui';

export default () => (
  <Button
    type="primary"
    icon={<MagnifyingGlassOutline />}
    className="bg-pink-500 text-white enabled:hover:bg-pink-400"
  >
    Search
  </Button>
);`},"@metisjs/icons":{type:"NPM",value:"1.0.1"},"metis-ui":{type:"NPM",value:"1.0.0"}},entry:"index.tsx"},context:{"@metisjs/icons":C,"metis-ui":g},renderOpts:{compile:function(){var s=I()(t()().mark(function u(){var r,d=arguments;return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.e(5893).then(e.bind(e,85893));case 2:return n.abrupt("return",(r=n.sent).default.apply(r,d));case 3:case"end":return n.stop()}},u)}));function l(){return s.apply(this,arguments)}return l}()}},"docs-semantic-class-demo-zh-cn-1":{component:o.memo(o.lazy(I()(t()().mark(function s(){var l,u;return t()().wrap(function(d){for(;;)switch(d.prev=d.next){case 0:return d.next=2,Promise.resolve().then(e.bind(e,92475));case 2:return l=d.sent,u=l.Card,d.abrupt("return",{default:function(){return o.createElement(u,{title:"Title",className:{root:"w-75",header:"bg-pink-400",body:"bg-pink-200 p-3",title:"text-primary"}},"Card content")}});case 5:case"end":return d.stop()}},s)})))),asset:{type:"BLOCK",id:"docs-semantic-class-demo-zh-cn-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { Card } from 'metis-ui';

export default () => (
  <Card
    title="Title"
    className={{
      root: 'w-75',
      header: 'bg-pink-400',
      body: 'bg-pink-200 p-3',
      title: 'text-primary',
    }}
  >
    Card content
  </Card>
);`},"metis-ui":{type:"NPM",value:"1.0.0"}},entry:"index.tsx"},context:{"metis-ui":g},renderOpts:{compile:function(){var s=I()(t()().mark(function u(){var r,d=arguments;return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.e(5893).then(e.bind(e,85893));case 2:return n.abrupt("return",(r=n.sent).default.apply(r,d));case 3:case"end":return n.stop()}},u)}));function l(){return s.apply(this,arguments)}return l}()}},"docs-semantic-class-demo-zh-cn-2":{component:o.memo(o.lazy(I()(t()().mark(function s(){var l,u,r;return t()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,Promise.resolve().then(e.bind(e,92475));case 2:return l=m.sent,u=l.clsx,r=l.Tree,m.abrupt("return",{default:function(){return o.createElement(r,{showIcon:!0,defaultExpandedKeys:["0-0"],defaultSelectedKeys:["0-0-0-0"],treeData:[{title:"parent 1",key:"0-0",children:[{title:"leaf",key:"0-0-0-0",disableCheckbox:!0},{title:"leaf",key:"0-0-0-1"}]}],className:{root:"w-[240px]",node:function(x){var p=x.selected,f=x.expanded,v=x.leaf,h=x.halfChecked,P=x.checked;return u({"bg-pink-200":p,"text-pink-500":p&&v})}}})}});case 6:case"end":return m.stop()}},s)})))),asset:{type:"BLOCK",id:"docs-semantic-class-demo-zh-cn-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { DocumentTextSolid, FolderCloseSolid, FolderOpenSolid } from '@metisjs/icons';
import { clsx, Tree } from 'metis-ui';

export default () => (
  <Tree
    showIcon
    defaultExpandedKeys={['0-0']}
    defaultSelectedKeys={['0-0-0-0']}
    treeData={[
      {
        title: 'parent 1',
        key: '0-0',
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
    ]}
    className={{
      root: 'w-[240px]',
      node: ({ selected, expanded, leaf, halfChecked, checked }) =>
        clsx({
          'bg-pink-200': selected,
          'text-pink-500': selected && leaf,
        }),
    }}
  />
);`},"metis-ui":{type:"NPM",value:"1.0.0"}},entry:"index.tsx"},context:{"metis-ui":g},renderOpts:{compile:function(){var s=I()(t()().mark(function u(){var r,d=arguments;return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.e(5893).then(e.bind(e,85893));case 2:return n.abrupt("return",(r=n.sent).default.apply(r,d));case 3:case"end":return n.stop()}},u)}));function l(){return s.apply(this,arguments)}return l}()}}}},11866:function(c,a,e){e.r(a),e.d(a,{demos:function(){return E}});var i=e(90228),t=e.n(i),b=e(87999),I=e.n(b),o=e(39546),C=e(44155),g=e(92475),E={"docs-style-override-demo-zh-cn-0":{component:o.memo(o.lazy(I()(t()().mark(function s(){var l,u,r,d,m,n,M;return t()().wrap(function(p){for(;;)switch(p.prev=p.next){case 0:return p.next=2,Promise.resolve().then(e.bind(e,44155));case 2:return l=p.sent,u=l.MagnifyingGlassOutline,p.next=6,Promise.resolve().then(e.bind(e,92475));case 6:return r=p.sent,d=r.Button,m=r.ConfigProvider,n=r.Input,M=r.Space,p.abrupt("return",{default:function(){return o.createElement(m,{button:{className:{root:"outline-primary rounded-xl",icon:"size-5"}},input:{className:{root:"outline-primary rounded-xl",prefix:"text-error",suffix:"text-error"}}},o.createElement(M,{vertical:!0},o.createElement(n,{prefix:"\uFFE5",suffix:"RMB"}),o.createElement(d,{icon:o.createElement(u,null)},"Submit")))}});case 12:case"end":return p.stop()}},s)})))),asset:{type:"BLOCK",id:"docs-style-override-demo-zh-cn-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { MagnifyingGlassOutline } from '@metisjs/icons';
import { Button, ConfigProvider, Input, Space } from 'metis-ui';

export default () => (
  <ConfigProvider
    button={{ className: { root: 'outline-primary rounded-xl', icon: 'size-5' } }}
    input={{
      className: { root: 'outline-primary rounded-xl', prefix: 'text-error', suffix: 'text-error' },
    }}
  >
    <Space vertical>
      <Input prefix="\uFFE5" suffix="RMB" />
      <Button icon={<MagnifyingGlassOutline />}>Submit</Button>
    </Space>
  </ConfigProvider>
);`},"@metisjs/icons":{type:"NPM",value:"1.0.1"},"metis-ui":{type:"NPM",value:"1.0.0"}},entry:"index.tsx"},context:{"@metisjs/icons":C,"metis-ui":g},renderOpts:{compile:function(){var s=I()(t()().mark(function u(){var r,d=arguments;return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.e(5893).then(e.bind(e,85893));case 2:return n.abrupt("return",(r=n.sent).default.apply(r,d));case 3:case"end":return n.stop()}},u)}));function l(){return s.apply(this,arguments)}return l}()}},"docs-style-override-demo-zh-cn-1":{component:o.memo(o.lazy(I()(t()().mark(function s(){var l,u,r,d;return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,Promise.resolve().then(e.bind(e,44155));case 2:return l=n.sent,u=l.MagnifyingGlassOutline,n.next=6,Promise.resolve().then(e.bind(e,92475));case 6:return r=n.sent,d=r.Button,n.abrupt("return",{default:function(){return o.createElement(d,{type:"primary",icon:o.createElement(u,null),className:"bg-pink-500 text-white enabled:hover:bg-pink-400"},"Search")}});case 9:case"end":return n.stop()}},s)})))),asset:{type:"BLOCK",id:"docs-style-override-demo-zh-cn-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { MagnifyingGlassOutline } from '@metisjs/icons';
import { Button } from 'metis-ui';

export default () => (
  <Button
    type="primary"
    icon={<MagnifyingGlassOutline />}
    className="bg-pink-500 text-white enabled:hover:bg-pink-400"
  >
    Search
  </Button>
);`},"@metisjs/icons":{type:"NPM",value:"1.0.1"},"metis-ui":{type:"NPM",value:"1.0.0"}},entry:"index.tsx"},context:{"@metisjs/icons":C,"metis-ui":g},renderOpts:{compile:function(){var s=I()(t()().mark(function u(){var r,d=arguments;return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.e(5893).then(e.bind(e,85893));case 2:return n.abrupt("return",(r=n.sent).default.apply(r,d));case 3:case"end":return n.stop()}},u)}));function l(){return s.apply(this,arguments)}return l}()}}}},39482:function(c,a,e){e.r(a),e.d(a,{demos:function(){return t}});var i=e(39546),t={}},51311:function(c,a,e){e.r(a),e.d(a,{demos:function(){return t}});var i=e(39546),t={}},58532:function(c,a,e){e.r(a),e.d(a,{demos:function(){return t}});var i=e(39546),t={}},89344:function(c,a,e){e.r(a),e.d(a,{demos:function(){return t}});var i=e(39546),t={}},18477:function(c,a,e){e.r(a),e.d(a,{texts:function(){return i}});const i=[{value:"metisui",paraId:0},{value:" \u76EE\u524D\u7684\u9ED8\u8BA4\u6587\u6848\u662F\u82F1\u6587\uFF0C\u5982\u679C\u9700\u8981\u4F7F\u7528\u5176\u4ED6\u8BED\u8A00\uFF0C\u53EF\u4EE5\u53C2\u8003\u4E0B\u9762\u7684\u65B9\u6848\u3002",paraId:0},{value:"metisui \u63D0\u4F9B\u4E86\u4E00\u4E2A React \u7EC4\u4EF6 ",paraId:1,tocIndex:0},{value:"ConfigProvider",paraId:2,tocIndex:0},{value:" \u7528\u4E8E\u5168\u5C40\u914D\u7F6E\u56FD\u9645\u5316\u6587\u6848\u3002",paraId:1,tocIndex:0},{value:`import zhCN from 'metis-ui/locale/zh_CN';

return (
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>
);
`,paraId:3,tocIndex:0},{value:"\u8BE6\u7EC6\u914D\u7F6E\u89C1\uFF1A",paraId:4,tocIndex:0},{value:"ConfigProvider",paraId:5,tocIndex:0},{value:"\u3002",paraId:4,tocIndex:0},{value:"\u6CE8\u610F\uFF1A",paraId:6,tocIndex:0},{value:"zh_CN",paraId:6,tocIndex:0},{value:" \u662F\u6587\u4EF6\u540D\uFF0C\u4EE5\u4E0B\u8868\u683C\u4E5F\u9075\u5FAA\u540C\u6837\u7684\u89C4\u5219\u3002",paraId:6,tocIndex:0},{value:"\u76EE\u524D\u652F\u6301\u4EE5\u4E0B\u8BED\u8A00\uFF1A",paraId:7,tocIndex:0},{value:"\u8BED\u8A00",paraId:8,tocIndex:0},{value:"\u6587\u4EF6\u540D",paraId:8,tocIndex:0},{value:"\u82F1\u8BED",paraId:8,tocIndex:0},{value:"en_US",paraId:8,tocIndex:0},{value:"\u7B80\u4F53\u4E2D\u6587",paraId:8,tocIndex:0},{value:"zh_CN",paraId:8,tocIndex:0},{value:"\u5177\u4F53\u7684\u4F7F\u7528\u65B9\u6CD5\u8BF7\u53C2\u8003 ",paraId:9,tocIndex:0},{value:"ConfigProvider \u6587\u6863",paraId:10,tocIndex:0},{value:"\u3002",paraId:9,tocIndex:0}]},66535:function(c,a,e){e.r(a),e.d(a,{texts:function(){return i}});const i=[{value:"\u5728\u5F00\u59CB\u4E4B\u524D\uFF0C\u63A8\u8350\u5148\u5B66\u4E60 ",paraId:0},{value:"React",paraId:0},{value:"\uFF0C\u8BF7\u786E\u4FDD\u9879\u76EE\u5DF2\u6EE1\u8DB3\u4EE5\u4E0B\u73AF\u5883\u8981\u6C42\uFF1A",paraId:0},{value:"Node.js",paraId:1},{value:" v16 \u6216\u4EE5\u4E0A",paraId:1},{value:"React",paraId:1},{value:" v18 \u6216\u4EE5\u4E0A",paraId:1},{value:"Tailwind CSS",paraId:1},{value:" v4 \u6216\u4EE5\u4E0A",paraId:1},{value:"\u5982\u679C\u9700\u8981\u4ECE\u96F6\u5F00\u59CB\u6784\u5EFA\u9879\u76EE\uFF0C\u53EF\u4EE5\u53C2\u8003\u5728 ",paraId:2},{value:"Vite",paraId:3},{value:"\u3001",paraId:2},{value:"Next.js",paraId:4},{value:"\u6216",paraId:2},{value:"Umi",paraId:5},{value:" \u4E2D\u4F7F\u7528\u6307\u5357\u3002",paraId:2},{value:"\u63A8\u8350\u4F7F\u7528 ",paraId:6,tocIndex:0},{value:"pnpm",paraId:6,tocIndex:0},{value:" \u7684\u65B9\u5F0F\u8FDB\u884C\u5F00\u53D1\u3002",paraId:6,tocIndex:0},{value:"\u5411\u4F60\u7684\u5165\u53E3 CSS \u6587\u4EF6\u6DFB\u52A0\u4E00\u4E2A ",paraId:7,tocIndex:1},{value:"@plugin",paraId:7,tocIndex:1},{value:" \u4EE5\u5BFC\u5165 Metis UI\u3002",paraId:7,tocIndex:1},{value:`@import 'tailwindcss';

@source './node_modules/metis-ui/es'; /* \u6B64\u5904\u53EA\u80FD\u4F7F\u7528\u76F8\u5BF9\u8DEF\u5F84\uFF0C\u9700\u8981\u6839\u636E\u5B9E\u9645\u5165\u53E3CSS\u8DEF\u5F84\u505A\u4FEE\u6539 */
@plugin 'metis-ui/plugin';
`,paraId:8,tocIndex:1}]},36105:function(c,a,e){e.r(a),e.d(a,{texts:function(){return i}});const i=[{value:"Metis UI \u7684\u76EE\u6807\u662F\u4E3A\u90A3\u4E9B\u559C\u6B22 Ant Design \u7684\u5F00\u53D1\u8005\u63D0\u4F9B\u4E00\u4E2A\u66F4\u7075\u6D3B\u7684\u9009\u62E9\uFF0C\u7279\u522B\u662F\u5E0C\u671B\u7ED3\u5408 Tailwind CSS \u7684\u5F00\u53D1\u8005\u3002\u6211\u4EEC\u5728\u4FDD\u7559 Ant Design \u7EC4\u4EF6\u8BBE\u8BA1\u903B\u8F91\u7684\u57FA\u7840\u4E0A\uFF0C\u63D0\u4F9B\u4E86\u4EE5\u4E0B\u6539\u8FDB\uFF1A",paraId:0},{value:"\u6837\u5F0F\u8986\u76D6\u66F4\u7075\u6D3B\u57FA\u4E8E Tailwind CSS \u7684\u6837\u5F0F\u4F53\u7CFB\uFF0C\u5F00\u53D1\u8005\u53EF\u4EE5\u65B9\u4FBF\u5730\u5BF9\u7EC4\u4EF6\u7684\u5404\u4E2A\u5143\u7D20\u8FDB\u884C\u6837\u5F0F\u8986\u76D6\uFF0C\u65E0\u9700\u7F16\u5199\u590D\u6742\u7684\u81EA\u5B9A\u4E49\u6837\u5F0F\uFF0C\u5FEB\u901F\u5B9E\u73B0\u4E2A\u6027\u5316\u8BBE\u8BA1\u3002",paraId:1},{value:"\u589E\u5F3A\u7684\u4EA4\u4E92\u529F\u80FD\u5185\u7F6E\u4E86\u4E00\u4E9B\u5E38\u7528\u7684\u4EA4\u4E92\u529F\u80FD\uFF0C\u4F8B\u5982\u8FDC\u7A0B\u6570\u636E\u8BF7\u6C42\u3001\u503C\u7C7B\u578B\u683C\u5F0F\u5316\u3001\u503C\u7C7B\u578B\u679A\u4E3E\u7B49\uFF0C\u51CF\u5C11\u5F00\u53D1\u8005\u5728\u8FD9\u4E9B\u573A\u666F\u4E0B\u7684\u91CD\u590D\u5DE5\u4F5C\u3002",paraId:1},{value:"\u8F7B\u91CF\u5316\u4E0E\u73B0\u4EE3\u5316\u901A\u8FC7 Tailwind CSS \u548C TypeScript \u7684\u7ED3\u5408\uFF0C\u63D0\u4F9B\u66F4\u73B0\u4EE3\u5316\u7684\u5F00\u53D1\u4F53\u9A8C\uFF0C\u540C\u65F6\u4FDD\u6301\u7EC4\u4EF6\u7684\u9AD8\u53EF\u5B9A\u5236\u6027\u548C\u4E00\u81F4\u6027\u3002",paraId:1},{value:"Metis UI \u662F\u4E3A\u90A3\u4E9B\u5E0C\u671B\u5728 Ant Design \u7684\u8BBE\u8BA1\u903B\u8F91\u57FA\u7840\u4E0A\uFF0C\u4EAB\u53D7 Tailwind CSS \u7075\u6D3B\u6027\u7684\u5F00\u53D1\u8005\u91CF\u8EAB\u5B9A\u5236\u7684\u89E3\u51B3\u65B9\u6848\u3002",paraId:2},{value:"\u{1F308} \u53C2\u8003 Ant Design \u7684\u7EC4\u4EF6\u8BBE\u8BA1\uFF0C\u62E5\u6709\u4E30\u5BCC\u7684\u7EC4\u4EF6\u652F\u6301\u3002",paraId:3,tocIndex:0},{value:"\u{1F3A8} \u57FA\u4E8E Tailwind CSS \u7684\u6837\u5F0F\uFF0C\u53EF\u4EE5\u5FEB\u901F\u8986\u76D6\u9ED8\u8BA4\u6837\u5F0F\u3002",paraId:3,tocIndex:0},{value:"\u{1F6E1} \u4F7F\u7528 TypeScript \u5F00\u53D1\uFF0C\u63D0\u4F9B\u5B8C\u6574\u7684\u7C7B\u578B\u5B9A\u4E49\u6587\u4EF6\u3002",paraId:3,tocIndex:0},{value:"\u2699\uFE0F \u6DF1\u5165\u6BCF\u4E2A\u7EC6\u8282\u7684\u4E3B\u9898\u6837\u5F0F\u5B9A\u5236\u80FD\u529B\u3002",paraId:3,tocIndex:0},{value:"Chrome 111+",paraId:4,tocIndex:1},{value:"Safari 16.4+",paraId:4,tocIndex:1},{value:"Firefox 128+",paraId:4,tocIndex:1},{value:"\u63A8\u8350\u4F7F\u7528 ",paraId:5,tocIndex:3},{value:"pnpm",paraId:5,tocIndex:3},{value:" \u7684\u65B9\u5F0F\u8FDB\u884C\u5F00\u53D1",paraId:5,tocIndex:3},{value:"\uFF0C\u4E0D\u4EC5\u53EF\u5728\u5F00\u53D1\u73AF\u5883\u8F7B\u677E\u8C03\u8BD5\uFF0C\u4E5F\u53EF\u653E\u5FC3\u5730\u5728\u751F\u4EA7\u73AF\u5883\u6253\u5305\u90E8\u7F72\u4F7F\u7528\uFF0C\u4EAB\u53D7\u6574\u4E2A\u751F\u6001\u5708\u548C\u5DE5\u5177\u94FE\u5E26\u6765\u7684\u8BF8\u591A\u597D\u5904\u3002",paraId:5,tocIndex:3}]},19074:function(c,a,e){e.r(a),e.d(a,{texts:function(){return i}});const i=[{value:"Metis UI \u7EC4\u4EF6 ",paraId:0},{value:"className",paraId:0},{value:" \u5C5E\u6027\u5E76\u975E\u6211\u4EEC\u5E38\u89C1\u7684 ",paraId:0},{value:"string",paraId:0},{value:" \u7C7B\u578B\uFF0C\u800C\u662F\u652F\u6301\u591A\u79CD\u7C7B\u578B\u7684\u6DF7\u5408\u7C7B\u578B\uFF0C\u8FD9\u6837\u505A\u7684\u76EE\u7684\u662F\u4E3A\u4E86\u65B9\u4FBF\u4F7F\u7528\u8005\u4F7F\u7528 ",paraId:0},{value:"tailwindcss",paraId:0},{value:" \u6837\u5F0F\u8986\u76D6\u9ED8\u8BA4\u7684\u7EC4\u4EF6\u6837\u5F0F\u3002",paraId:0},{value:"\u672C\u6587\u5C06\u5E26\u4F60\u4E86\u89E3 ",paraId:1},{value:"className",paraId:1},{value:" \u5404\u79CD\u7C7B\u578B\u7684\u4F7F\u7528\u65B9\u6CD5\u3002",paraId:1},{value:"\u548C\u4F20\u7EDF\u7528\u6CD5\u4E00\u81F4\uFF0CclassName\u4F1A\u4F5C\u7528\u4E8E\u7EC4\u4EF6\u7684\u6839\u8282\u70B9\u3002",paraId:2,tocIndex:0},{value:"\u53EF\u4EE5\u81EA\u5B9A\u4E49\u7EC4\u4EF6\u5B50\u5143\u7D20\u7684\u6837\u5F0F\u3002",paraId:3,tocIndex:1},{value:"\u5177\u4F53\u7C7B\u578B\u4F1A\u6839\u636E\u7EC4\u4EF6\u4E0D\u540C\uFF0C\u800C\u5404\u4E0D\u76F8\u540C\uFF0C\u4F60\u53EF\u4EE5\u901A\u8FC7",paraId:4,tocIndex:1},{value:"\u7EC4\u4EF6 API",paraId:5,tocIndex:1},{value:"\u4E86\u89E3\u3002",paraId:4,tocIndex:1},{value:"\u53EF\u4EE5\u6839\u636E\u7EC4\u4EF6\u4E0D\u540C\u72B6\u6001\uFF0C\u5B9A\u4E49\u4E0D\u540C\u7684\u6837\u5F0F\u3002",paraId:6,tocIndex:2},{value:"\u5177\u4F53\u53C2\u6570\u4F1A\u6839\u636E\u7EC4\u4EF6\u4E0D\u540C\uFF0C\u800C\u5404\u4E0D\u76F8\u540C\uFF0C\u4F60\u53EF\u4EE5\u901A\u8FC7",paraId:7,tocIndex:2},{value:"\u7EC4\u4EF6 API",paraId:8,tocIndex:2},{value:"\u4E86\u89E3\u3002",paraId:7,tocIndex:2}]},62814:function(c,a,e){e.r(a),e.d(a,{texts:function(){return i}});const i=[{value:"\u5B9E\u9645\u9879\u76EE\u4E2D\uFF0C\u5F00\u53D1\u8005\u5F80\u5F80\u9700\u8981\u5BF9\u7EC4\u4EF6\u8FDB\u884C\u5168\u5C40\u6216\u5C40\u90E8\u7684\u6837\u5F0F\u91CD\u5199\uFF0C\u4EE5\u6EE1\u8DB3\u7279\u5B9A\u7684\u8BBE\u8BA1\u9700\u6C42\u6216\u54C1\u724C\u89C4\u8303\u3002Metis UI \u63D0\u4F9B\u4E86\u591A\u79CD\u65B9\u5F0F\u6765\u5B9E\u73B0\u6837\u5F0F\u8986\u76D6\uFF0C\u65E2\u53EF\u4EE5\u7075\u6D3B\u8C03\u6574\u7EC4\u4EF6\u7684\u9ED8\u8BA4\u6837\u5F0F\uFF0C\u4E5F\u53EF\u4EE5\u9488\u5BF9\u7279\u5B9A\u573A\u666F\u8FDB\u884C\u5B9A\u5236\u3002",paraId:0},{value:"\u901A\u8FC7\u4FEE\u6539\u4E3B\u9898\u989C\u8272\uFF0C\u53EF\u4EE5\u5FEB\u901F\u8C03\u6574\u5168\u5C40\u6837\u5F0F\u4EE5\u9002\u914D\u54C1\u724C\u9700\u6C42\u3002\u5177\u4F53\u65B9\u6CD5\u8BF7\u53C2\u8003",paraId:1,tocIndex:1},{value:"\u4E3B\u9898\u6587\u6863",paraId:2,tocIndex:1},{value:"\u3002",paraId:1,tocIndex:1},{value:"ConfigProvider",paraId:3},{value:"ConfigProvider",paraId:4,tocIndex:2},{value:" \u7EC4\u4EF6\u5141\u8BB8\u5F00\u53D1\u8005\u901A\u8FC7\u914D\u7F6E\u7684\u65B9\u5F0F\u5168\u5C40\u8986\u76D6\u7EC4\u4EF6\u7684\u6837\u5F0F\u3002\u4F8B\u5982\uFF1A",paraId:4,tocIndex:2},{value:"Metis UI \u4FDD\u7559\u4E86\u4F20\u7EDF\u7EC4\u4EF6\u7684 class \u5C5E\u6027\uFF0C\u5141\u8BB8\u5F00\u53D1\u8005\u901A\u8FC7 CSS \u6587\u4EF6\u76F4\u63A5\u8986\u76D6\u6837\u5F0F\u3002\u4F8B\u5982\uFF1A",paraId:5,tocIndex:3},{value:`@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin 'metis-ui/plugin';

.metis-btn.metis-btn-default {
  @apply bg-pink-300;
}
`,paraId:6,tocIndex:3},{value:"\u5BF9\u4E8E\u5C40\u90E8\u6837\u5F0F\u7684\u8C03\u6574\uFF0C\u53EF\u4EE5\u901A\u8FC7\u7EC4\u4EF6\u7684 ",paraId:7,tocIndex:4},{value:"className",paraId:7,tocIndex:4},{value:" \u5C5E\u6027\u8FDB\u884C\u81EA\u5B9A\u4E49\uFF0C\u7075\u6D3B\u5730\u4E3A\u7EC4\u4EF6\u6DFB\u52A0\u81EA\u5B9A\u4E49\u6837\u5F0F\uFF0C\u6EE1\u8DB3\u5C40\u90E8\u6837\u5F0F\u8C03\u6574\u7684\u9700\u6C42\uFF0C",paraId:7,tocIndex:4},{value:"\u8BE6\u7EC6\u4ECB\u7ECD",paraId:8,tocIndex:4},{value:"\u3002\u4F8B\u5982\uFF1A",paraId:7,tocIndex:4}]},71457:function(c,a,e){e.r(a),e.d(a,{texts:function(){return i}});const i=[{value:"Metis UI \u53EA\u9488\u5BF9\u989C\u8272\u8FDB\u884C\u4E3B\u9898\u5B9A\u5236\uFF0C\u9ED8\u8BA4\u63D0\u4F9B\u4E86\u4E24\u5957\u4E3B\u9898\uFF1A",paraId:0},{value:"light",paraId:0},{value:" \u548C ",paraId:0},{value:"dark",paraId:0},{value:"\u3002\u60A8\u8FD8\u53EF\u4EE5\u521B\u5EFA\u81EA\u5DF1\u7684\u81EA\u5B9A\u4E49\u4E3B\u9898\u6216\u4FEE\u6539\u5185\u7F6E\u4E3B\u9898\u3002",paraId:0},{value:'\u60A8\u53EF\u4EE5\u5728 CSS \u6587\u4EF6\u4E2D\u7684 @plugin "metis-ui/plugin" \u540E\u6DFB\u52A0\u62EC\u53F7\u6765\u7BA1\u7406\u4E3B\u9898\u3002',paraId:1},{value:`@plugin 'metis-ui/plugin' {
  themes: light --default, dark --dark; /* --default: \u9ED8\u8BA4\u4E3B\u9898 --dark: \u9ED8\u8BA4\u6697\u8272\u4E3B\u9898\uFF0C\u9002\u914D prefers-color-scheme: dark */
}
`,paraId:2},{value:"\u901A\u8FC7 ",paraId:3},{value:"ConfigProvider",paraId:3},{value:" \u7EC4\u4EF6\u6765\u8BBE\u7F6E\u5F53\u524D\u4E3B\u9898\uFF0C\u9ED8\u8BA4\u53EF\u9009\u503C ",paraId:3},{value:"light",paraId:3},{value:"\u3001",paraId:3},{value:"dark",paraId:3},{value:"\u3001",paraId:3},{value:"system",paraId:3},{value:"\u3002",paraId:3},{value:`import React from 'react';
import { ConfigProvider } from 'metis-ui';

const App: React.FC = () => <ConfigProvider theme="dark">{/* ... */}</ConfigProvider>;

export default App;
`,paraId:4},{value:"\u7981\u7528\u4E00\u4E2A\u4E3B\u9898\u3002",paraId:5,tocIndex:0},{value:`@plugin './src/plugin' {
  themes: light --default;
}
`,paraId:6,tocIndex:0},{value:"\u7981\u7528\u6240\u6709\u4E3B\u9898\u3002",paraId:7,tocIndex:0},{value:`@plugin './src/plugin' {
  themes: false;
}
`,paraId:8,tocIndex:0},{value:"\u53EF\u4EE5\u5D4C\u5957\u4F7F\u7528 ",paraId:9,tocIndex:1},{value:"ConfigProvider",paraId:9,tocIndex:1},{value:" \u6765\u5B9E\u73B0\u5C40\u90E8\u4E3B\u9898\u7684\u66F4\u6362\u3002\u5728\u5B50\u4E3B\u9898\u4E2D\u672A\u88AB\u6539\u53D8\u7684 ",paraId:9,tocIndex:1},{value:"theme",paraId:9,tocIndex:1},{value:" \u5C06\u4F1A\u7EE7\u627F\u7236\u4E3B\u9898\u3002",paraId:9,tocIndex:1},{value:`import React from 'react';
import { Button, ConfigProvider, Space } from 'metis-ui';

const App: React.FC = () => (
  <ConfigProvider theme="dark">
    <Space>
      <Button type="primary">Theme 1</Button>
      <ConfigProvider theme="light">
        <Button type="primary">Theme 2</Button>
      </ConfigProvider>
    </Space>
  </ConfigProvider>
);

export default App;
`,paraId:10,tocIndex:1},{value:'\u8981\u6DFB\u52A0\u65B0\u4E3B\u9898\uFF0C\u8BF7\u5728 CSS \u6587\u4EF6\u4E2D\u4F7F\u7528 @plugin "metis-ui/theme" {}\uFF0C\u5176\u7ED3\u6784\u5982\u4E0B:',paraId:11,tocIndex:2},{value:`@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin "metis-ui/plugin";
@plugin "metis-ui/theme" {
  /* \u4E3B\u9898\u540D\u79F0 */
  name: 'custom-theme';
  /* \u9ED8\u8BA4\u4E3B\u9898*/
  default: true;
  /* \u9ED8\u8BA4\u6697\u8272\u4E3B\u9898\uFF0C\u8DDF\u968F\u7CFB\u7EDF\u81EA\u52A8\u5207\u6362 */
  dark: false;
  /* light \u6216 dark */
  color-scheme: light;

  /* \u54C1\u724C\u8272 */
  primary: 'indigo-600';
  /* \u54C1\u724C\u60AC\u6D6E\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  primary-hover: 'indigo-500';
  /* \u54C1\u724C\u6FC0\u6D3B\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  primary-active: 'indigo-700';
  /* \u54C1\u724C\u80CC\u666F\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  primary-bg: 'indigo-50';
  /* \u54C1\u724C\u80CC\u666F\u60AC\u6D6E\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  primary-bg-hover: 'indigo-200';
  /* \u54C1\u724C\u8FB9\u6846\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  primary-border: 'indigo-300';
  /* \u54C1\u724C\u6B21\u7EA7\u8FB9\u6846\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  primary-border-secondary: 'indigo-600/10';

  /* \u6210\u529F\u8272 */
  success: 'green-500';
  /* \u6210\u529F\u60AC\u6D6E\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  success-hover: 'green-400';
  /* \u6210\u529F\u6FC0\u6D3B\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  success-active: 'green-600';
  /* \u6210\u529F\u80CC\u666F\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  success-bg: 'green-50';
  /* \u6210\u529F\u80CC\u666F\u60AC\u6D6E\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  success-bg-hover: 'green-100';
  /* \u6210\u529F\u8FB9\u6846\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  success-border: 'green-300';
  /* \u6210\u529F\u6B21\u7EA7\u8FB9\u6846\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  success-border-secondary: 'green-500/20';

  /* \u8B66\u6212\u8272 */
  warning: 'yellow-500';
  /* \u8B66\u6212\u60AC\u6D6E\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  warning-hover: 'yellow-400';
  /* \u8B66\u6212\u6FC0\u6D3B\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  warning-active: 'yellow-600';
  /* \u8B66\u6212\u80CC\u666F\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  warning-bg: 'yellow-50';
  /* \u8B66\u6212\u80CC\u666F\u60AC\u6D6E\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  warning-bg-hover: 'yellow-100';
  /* \u8B66\u6212\u8FB9\u6846\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  warning-border: 'yellow-300';
  /* \u8B66\u6212\u6B21\u7EA7\u8FB9\u6846\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  warning-border-secondary: 'yellow-500/20';

  /* \u9519\u8BEF\u8272 */
  error: 'red-500';
  /* \u9519\u8BEF\u60AC\u6D6E\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  error-hover: 'red-400';
  /* \u9519\u8BEF\u6FC0\u6D3B\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  error-active: 'red-600';
  /* \u9519\u8BEF\u80CC\u666F\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  error-bg: 'red-50';
  /* \u9519\u8BEF\u80CC\u666F\u60AC\u6D6E\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  error-bg-hover: 'red-100';
  /* \u9519\u8BEF\u8FB9\u6846\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  error-border: 'red-300';
  /* \u9519\u8BEF\u6B21\u7EA7\u8FB9\u6846\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  error-border-secondary: 'red-500/20';

  /* \u4E00\u7EA7\u6587\u672C\u8272 */
  text: 'gray-950';
  /* \u4E8C\u7EA7\u6587\u672C\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  text-secondary: 'gray-500';
  /* \u4E09\u7EA7\u6587\u672C\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  text-tertiary: 'gray-400';
  /* \u56DB\u7EA7\u6587\u672C\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  text-quaternary: 'gray-300';

  /* \u4E00\u7EA7\u8FB9\u6846\u8272 */
  border: 'gray-300';
  /* \u4E8C\u7EA7\u8FB9\u6846\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  border-secondary: 'gray-200';
  /* \u4E09\u7EA7\u8FB9\u6846\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  border-tertiary: 'gray-100';

  /* \u4E00\u7EA7\u586B\u5145\u8272 */
  fill: 'gray-950/20';
  /* \u4E8C\u7EA7\u586B\u5145\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  fill-secondary: 'gray-950/15';
  /* \u4E09\u7EA7\u586B\u5145\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  fill-tertiary: 'gray-950/10';
  /* \u56DB\u7EA7\u586B\u5145\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  fill-quaternary: 'gray-950/5';
  /* \u4E94\u7EA7\u586B\u5145\u8272\uFF0C\u53EF\u9009\u5C5E\u6027\uFF0C\u53EF\u7531\u7CFB\u7EDF\u63A8\u5BFC\u751F\u6210 */
  fill-quinary: 'gray-950/2';

  /* \u7EC4\u4EF6\u5BB9\u5668\u80CC\u666F */
  container: 'white';

  /* \u5F15\u8D77\u6CE8\u610F\u7684\u80CC\u666F\u8272 */
  spotlight: 'gray-900/85';

  /* \u6D6E\u5C42\u7684\u80CC\u666F\u8499\u5C42\u8272 */
  mask: 'gray-900/45';

  /** \u6EDA\u52A8\u7EC4\u4EF6\u6EDA\u52A8\u6761\u989C\u8272 */
  scrollbar-track: 'black/5';
  scrollbar-thumb: 'black/50';
}
`,paraId:12,tocIndex:2},{value:"\u4E3B\u9898\u989C\u8272\u53EF\u4EE5\u662F ",paraId:13,tocIndex:2},{value:"Tailwindcss Color",paraId:13,tocIndex:2},{value:" \u6216\u8005 ",paraId:13,tocIndex:2},{value:"CSS Color",paraId:13,tocIndex:2},{value:"\u3002",paraId:13,tocIndex:2},{value:"\u652F\u6301\u7531 ",paraId:14,tocIndex:2},{value:"Tailwindcss Color",paraId:14,tocIndex:2},{value:" \u63A8\u5BFC\u751F\u6210\u6B21\u7EA7\u989C\u8272\uFF0C\u4F60\u53EF\u4EE5\u50CF\u8FD9\u6837\u7B80\u5316\u4E3B\u9898\u7684\u5B9A\u5236\uFF1A",paraId:14,tocIndex:2},{value:`@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin "metis-ui/plugin";
@plugin "metis-ui/theme" {
  /* \u4E3B\u9898\u540D\u79F0 */
  name: 'custom-theme';
  /* \u9ED8\u8BA4\u4E3B\u9898*/
  default: true;
  /* \u9ED8\u8BA4\u6697\u8272\u4E3B\u9898\uFF0C\u8DDF\u968F\u7CFB\u7EDF\u81EA\u52A8\u5207\u6362 */
  dark: false;
  /* light \u6216 dark */
  color-scheme: light;

  /* \u54C1\u724C\u8272 */
  primary: 'sky-600';
  /* \u6210\u529F\u8272 */
  success: 'green-500';
  /* \u8B66\u6212\u8272 */
  warning: 'yellow-500';
  /* \u9519\u8BEF\u8272 */
  error: 'red-500';
  /* \u4E00\u7EA7\u6587\u672C\u8272 */
  text: 'gray-950';
  /* \u4E00\u7EA7\u8FB9\u6846\u8272 */
  border: 'gray-300';
  /* \u4E00\u7EA7\u586B\u5145\u8272 */
  fill: 'gray-950/20';
  /* \u7EC4\u4EF6\u5BB9\u5668\u80CC\u666F */
  container: 'white';
  /* \u5F15\u8D77\u6CE8\u610F\u7684\u80CC\u666F\u8272 */
  spotlight: 'gray-900/85';
  /* \u6D6E\u5C42\u7684\u80CC\u666F\u8499\u5C42\u8272 */
  mask: 'gray-900/45';
  /** \u6EDA\u52A8\u7EC4\u4EF6\u6EDA\u52A8\u6761\u989C\u8272 */
  scrollbar-track: 'black/5';
  scrollbar-thumb: 'black/50';
}
`,paraId:15,tocIndex:2},{value:"\u8981\u81EA\u5B9A\u4E49\u5185\u7F6E\u4E3B\u9898\uFF0C\u60A8\u53EF\u4EE5\u4F7F\u7528\u4E0E\u6DFB\u52A0\u65B0\u4E3B\u9898\u76F8\u540C\u7684\u7ED3\u6784\uFF0C\u4F46\u4F7F\u7528\u4E0E\u5185\u7F6E\u4E3B\u9898\u76F8\u540C\u7684\u540D\u79F0\u3002",paraId:16,tocIndex:3},{value:"\u4F8B\u5982\uFF0C\u8981\u81EA\u5B9A\u4E49 light \u4E3B\u9898\uFF1A",paraId:17,tocIndex:3},{value:`@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin "metis-ui/plugin";
@plugin "metis-ui/theme" {
  /* \u4E3B\u9898\u540D\u79F0 */
  name: 'light';
  /* \u9ED8\u8BA4\u4E3B\u9898*/
  default: true;
  /* \u9ED8\u8BA4\u6697\u8272\u4E3B\u9898\uFF0C\u8DDF\u968F\u7CFB\u7EDF\u81EA\u52A8\u5207\u6362 */
  dark: false;
  /* light \u6216 dark */
  color-scheme: light;

  /* \u54C1\u724C\u8272 */
  primary: 'pink-600';
}
`,paraId:18,tocIndex:3},{value:"\u6240\u6709\u5176\u4ED6\u989C\u8272\u5C06\u4ECE\u539F\u4E3B\u9898\u7EE7\u627F\u3002",paraId:19,tocIndex:3}]},80512:function(c,a,e){e.r(a),e.d(a,{texts:function(){return i}});const i=[{value:"Next.js",paraId:0},{value:" \u662F\u76EE\u524D\u4E16\u754C\u4E0A\u6700\u6D41\u884C\u7684 React \u670D\u52A1\u7AEF\u540C\u6784\u6846\u67B6\uFF0C\u672C\u6587\u4F1A\u5C1D\u8BD5\u5728 Next.js \u521B\u5EFA\u7684\u5DE5\u7A0B\u4E2D\u4F7F\u7528 ",paraId:0},{value:"metis-ui",paraId:0},{value:" \u7EC4\u4EF6\u3002",paraId:0},{value:"\u5728\u5F00\u59CB\u4E4B\u524D\uFF0C\u4F60\u53EF\u80FD\u9700\u8981\u5B89\u88C5 ",paraId:1,tocIndex:0},{value:"yarn",paraId:1,tocIndex:0},{value:" \u6216\u8005 ",paraId:1,tocIndex:0},{value:"pnpm",paraId:1,tocIndex:0},{value:" \u6216\u8005 ",paraId:1,tocIndex:0},{value:"bun",paraId:1,tocIndex:0},{value:"\u3002",paraId:1,tocIndex:0},{value:"\u5DE5\u5177\u4F1A\u81EA\u52A8\u521D\u59CB\u5316\u4E00\u4E2A\u811A\u624B\u67B6\u5E76\u5B89\u88C5\u9879\u76EE\u7684\u5404\u79CD\u5FC5\u8981\u4F9D\u8D56\uFF0C\u5728\u5B89\u88C5\u8FC7\u7A0B\u4E2D\uFF0C\u6709\u4E00\u4E9B\u914D\u7F6E\u9879\u9700\u8981\u81EA\u884C\u9009\u62E9\uFF0C\u5176\u4E2D",paraId:2},{value:"Tailwind CSS",paraId:2},{value:"\u9009\u62E9\u5F00\u542F\uFF0C\u5982\u679C\u5728\u8FC7\u7A0B\u4E2D\u51FA\u73B0\u7F51\u7EDC\u95EE\u9898\uFF0C\u8BF7\u5C1D\u8BD5\u914D\u7F6E\u4EE3\u7406\uFF0C\u6216\u4F7F\u7528\u5176\u4ED6 npm registry\uFF0C\u4F8B\u5982\uFF0C\u4F60\u53EF\u4EE5\u5207\u6362\u5230\u6DD8\u5B9D\u955C\u50CF\u6E90\uFF1A",paraId:2},{value:"npm config set registry https://registry.npmmirror.com",paraId:2},{value:"\u3002",paraId:2},{value:"\u521D\u59CB\u5316\u5B8C\u6210\u540E\uFF0C\u6211\u4EEC\u8FDB\u5165\u9879\u76EE\u5E76\u542F\u52A8\u3002",paraId:3},{value:`$ cd metis-ui-demo
$ npm run dev
`,paraId:4},{value:"\u6B64\u65F6\u4F7F\u7528\u6D4F\u89C8\u5668\u8BBF\u95EE ",paraId:5},{value:"http://localhost:3000/",paraId:5},{value:" \uFF0C\u770B\u5230 NEXT \u7684 logo \u5C31\u7B97\u6210\u529F\u4E86\u3002",paraId:5},{value:"\u73B0\u5728\u4ECE yarn \u6216 npm \u6216 pnpm \u6216 bun \u5B89\u88C5\u5E76\u5F15\u5165 metis-ui\u3002",paraId:6,tocIndex:1},{value:"\u4FEE\u6539 ",paraId:7},{value:"src/app/globals.css",paraId:7},{value:"\u3002",paraId:7},{value:`@import 'tailwindcss';

@source '../../node_modules/metis-ui/es'; /* \u6B64\u5904\u53EA\u80FD\u4F7F\u7528\u76F8\u5BF9\u8DEF\u5F84\uFF0C\u5982\u679C\u6CA1src\u76EE\u5F55\uFF0C\u4F7F\u7528 ../node_modules/metis-ui/es \u66FF\u6362 */
@plugin 'metis-ui/plugin';
`,paraId:8},{value:"\u4FEE\u6539 ",paraId:9},{value:"src/app/page.tsx",paraId:9},{value:"\uFF0C\u5F15\u5165 metis-ui \u7684\u6309\u94AE\u7EC4\u4EF6\u3002",paraId:9},{value:`import React from 'react';
import { Button } from 'metis-ui';

const Home = () => (
  <div className="App">
    <Button type="primary">Button</Button>
  </div>
);

export default Home;
`,paraId:10},{value:"\u597D\u4E86\uFF0C\u73B0\u5728\u4F60\u5E94\u8BE5\u80FD\u770B\u5230\u9875\u9762\u4E0A\u5DF2\u7ECF\u6709\u4E86 ",paraId:11},{value:"metis-ui",paraId:11},{value:" \u7684\u84DD\u8272\u6309\u94AE\u7EC4\u4EF6\uFF0C\u63A5\u4E0B\u6765\u5C31\u53EF\u4EE5\u7EE7\u7EED\u9009\u7528\u5176\u4ED6\u7EC4\u4EF6\u5F00\u53D1\u5E94\u7528\u4E86\u3002\u5176\u4ED6\u5F00\u53D1\u6D41\u7A0B\u4F60\u53EF\u4EE5\u53C2\u8003 Next.js \u7684",paraId:11},{value:"\u5B98\u65B9\u6587\u6863",paraId:11},{value:"\u3002",paraId:11},{value:"\u6CE8\u610F: Next.js App Router \u5F53\u524D\u4E0D\u652F\u6301\u76F4\u63A5\u4F7F\u7528 ",paraId:12},{value:".",paraId:12},{value:" \u5F15\u5165\u7684\u5B50\u7EC4\u4EF6\uFF0C\u5982 ",paraId:12},{value:"<Avatar.Group />",paraId:12},{value:"\u3001",paraId:12},{value:"<DatePicker.RangePicker />",paraId:12},{value:" \u7B49\uFF0C\u9700\u8981\u4ECE\u8DEF\u5F84\u5F15\u5165\u8FD9\u4E9B\u5B50\u7EC4\u4EF6\u6765\u907F\u514D\u9519\u8BEF\u3002",paraId:12}]},61729:function(c,a,e){e.r(a),e.d(a,{texts:function(){return i}});const i=[{value:"Umi",paraId:0},{value:"\uFF0C\u662F\u8682\u8681\u96C6\u56E2\u7684\u5E95\u5C42\u524D\u7AEF\u6846\u67B6\uFF0C\u540C\u65F6\u652F\u6301\u914D\u7F6E\u5F0F\u8DEF\u7531\u548C\u7EA6\u5B9A\u5F0F\u8DEF\u7531\uFF0C\u4FDD\u8BC1\u8DEF\u7531\u7684\u529F\u80FD\u5B8C\u5907\uFF0C\u5E76\u4EE5\u6B64\u8FDB\u884C\u529F\u80FD\u6269\u5C55\u3002\u7136\u540E\u914D\u4EE5\u751F\u547D\u5468\u671F\u5B8C\u5584\u7684\u63D2\u4EF6\u4F53\u7CFB\uFF0C\u8986\u76D6\u4ECE\u6E90\u7801\u5230\u6784\u5EFA\u4EA7\u7269\u7684\u6BCF\u4E2A\u751F\u547D\u5468\u671F\uFF0C\u652F\u6301\u5404\u79CD\u529F\u80FD\u6269\u5C55\u548C\u4E1A\u52A1\u9700\u6C42\u3002",paraId:0},{value:"\u672C\u6587\u4F1A\u5F15\u5BFC\u4F60\u4F7F\u7528 Umi\u3001Metis UI \u4ECE 0 \u5F00\u59CB\u521B\u5EFA\u4E00\u4E2A\u7B80\u5355\u5E94\u7528\u3002",paraId:1},{value:"\u5728\u5F00\u59CB\u4E4B\u524D\uFF0C\u4F60\u53EF\u80FD\u9700\u8981\u5B89\u88C5 ",paraId:2,tocIndex:0},{value:"yarn",paraId:2,tocIndex:0},{value:" \u6216\u8005 ",paraId:2,tocIndex:0},{value:"pnpm",paraId:2,tocIndex:0},{value:" \u6216\u8005 ",paraId:2,tocIndex:0},{value:"bun",paraId:2,tocIndex:0},{value:"\u3002",paraId:2,tocIndex:0},{value:"\u8FD9\u91CC\u9009\u300CSimple App\u300D\u3002",paraId:3},{value:`? Pick Umi App Template \u203A - Use arrow-keys. Return to submit.
\u276F   Simple App
    Ant Design Pro
    Vue Simple App
    Umi Plugin
`,paraId:4},{value:"\u5176\u4ED6\u9009\u9879\u53EF\u6839\u636E\u5B9E\u9645\u9700\u6C42\u81EA\u884C\u9009\u62E9\u3002",paraId:5},{value:"\u7136\u540E\u5DE5\u5177\u4F1A\u81EA\u52A8\u5B89\u88C5\u4F9D\u8D56\uFF0C\u5E76\u6267\u884C Umi \u7684\u521D\u59CB\u5316\u811A\u672C\u3002",paraId:6},{value:"\u73B0\u5728\u4ECE yarn \u6216 npm \u6216 pnpm \u6216 bun \u5B89\u88C5\u5E76\u5F15\u5165 metis-ui\uFF0C\u4EE5\u53CA\u4E00\u4E9B\u672C\u6559\u7A0B\u4F1A\u7528\u5230\u7684\u4F9D\u8D56\u3002",paraId:7,tocIndex:1},{value:"\u5176\u4E2D ",paraId:8},{value:"@metisjs/umi-plugins",paraId:8},{value:" \u662F metis \u6839\u636E Umi \u6846\u67B6\u7814\u53D1\u7684\u63D2\u4EF6\u96C6\uFF0C\u53EF\u8BA9\u7528\u6237\u901A\u8FC7\u914D\u7F6E\u7684\u65B9\u5F0F\u4E00\u952E\u5F00\u542F\u548C\u4F7F\u7528 ",paraId:8},{value:"metis-ui",paraId:8},{value:"\u3001",paraId:8},{value:"locale",paraId:8},{value:"(\u4E0E",paraId:8},{value:"@umijs/plugins/locale",paraId:8},{value:"\u529F\u80FD\u7C7B\u4F3C)",paraId:8},{value:"\u5B8C\u6210\u540E\uFF0C\u6267\u884C\u4EE5\u4E0B\u547D\u4EE4\u542F\u52A8\u9879\u76EE\u3002",paraId:9},{value:`$ pnpm run dev
umi dev
info  - Umi v4.0.46
        \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
        \u2551 App listening at:                                  \u2551
        \u2551  >   Local: http://localhost:8000                  \u2551
ready - \u2551  > Network: http://*********:8000                  \u2551
        \u2551                                                    \u2551
        \u2551 Now you can open browser with the above addresses\u2191 \u2551
        \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D
`,paraId:10},{value:"\u8DDF\u7740\u63D0\u793A\u70B9\u51FB\u547D\u4EE4\u884C\u91CC\u7684 url\uFF0C\u4F1A\u81EA\u52A8\u6253\u5F00\u6D4F\u89C8\u5668\u3002\u5982\u679C\u987A\u5229\uFF0C\u4F60\u4F1A\u770B\u5230 ",paraId:11},{value:"Yay! Welcome to Umi!",paraId:11},{value:"\u4FEE\u6539 ",paraId:12},{value:".umirc.ts",paraId:12},{value:"\u3002",paraId:12},{value:`import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: 'index' },
    { path: '/docs', component: 'docs' },
  ],
  npmClient: 'pnpm',
  metisui: { theme: 'system' },
  plugins: ['@metisjs/umi-plugins/dist/metisui'],
});
`,paraId:13},{value:"metisui",paraId:14},{value:" \u652F\u6301 ",paraId:14},{value:"ConfigProvider",paraId:15},{value:" \u7684\u6240\u6709\u914D\u7F6E\u3002",paraId:14},{value:"\u6839\u76EE\u5F55\u4E0B\u65B0\u5EFA ",paraId:16},{value:"tailwind.css",paraId:16},{value:`@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin 'metis-ui/plugin';
`,paraId:17},{value:"\u4FEE\u6539 ",paraId:18},{value:"src/pages/index.tsx",paraId:18},{value:`import { Alert } from 'metis-ui';

export default function HomePage() {
  return (
    <div className="h-screen w-screen">
      <Alert type="info" banner message="Hello" description="Welcome to metis-ui" />
    </div>
  );
}
`,paraId:19},{value:"\u597D\u4E86\uFF0C\u73B0\u5728\u4F60\u5E94\u8BE5\u80FD\u770B\u5230\u9875\u9762\u4E0A\u5DF2\u7ECF\u6709\u4E86 metis-ui \u7684 Alert \u7EC4\u4EF6\uFF0C\u63A5\u4E0B\u6765\u5C31\u53EF\u4EE5\u7EE7\u7EED\u5F00\u53D1\u5E94\u7528\u4E86\u3002",paraId:20},{value:"\u5728 ",paraId:21,tocIndex:2},{value:".umirc.ts",paraId:21,tocIndex:2},{value:" \u4E2D\uFF0C\u901A\u8FC7 ",paraId:21,tocIndex:2},{value:"metisui",paraId:21,tocIndex:2},{value:" \u914D\u7F6E\u5168\u5C40 ",paraId:21,tocIndex:2},{value:"ConfigProvider",paraId:22,tocIndex:2},{value:"\u3002",paraId:21,tocIndex:2},{value:`import { defineConfig } from 'umi';

export default defineConfig({
  // ...
  metisui: { theme: 'system', componentSize: 'small' },
  plugins: ['@metisjs/umi-plugins/dist/metisui'],
});
`,paraId:23,tocIndex:2},{value:"\u5728 ",paraId:24,tocIndex:3},{value:"src/app.ts(x)",paraId:24,tocIndex:3},{value:" \u8FD0\u884C\u65F6\u914D\u7F6E\u4E2D\u53EF\u4EE5\u4FEE\u6539 ConfigProvider \u7684\u503C\uFF0C\u6BD4\u5982\u53EF\u4EE5\u4ECE localStorage\u8BFB\u53D6\u4E3B\u9898\u3002",paraId:24,tocIndex:3},{value:`import { RuntimeMetisUIConfig } from 'umi';

export const metisui: RuntimeMetisUIConfig = (memo) => {
  const theme = localStorage.getItem('theme');
  if (theme) {
    memo.theme = theme;
  }

  return memo;
};
`,paraId:25,tocIndex:3},{value:"\u901A\u8FC7 ",paraId:26,tocIndex:4},{value:"useMetisUIConfig",paraId:26,tocIndex:4},{value:" \u65B9\u6CD5\u6765\u52A8\u6001\u83B7\u53D6\u3001\u4FEE\u6539 ConfigProvider \u914D\u7F6E\uFF0C\u901A\u5E38\u53EF\u7528\u4E8E\u52A8\u6001\u4FEE\u6539\u4E3B\u9898\u3002",paraId:26,tocIndex:4},{value:"\u65B0\u5EFA ",paraId:27,tocIndex:4},{value:"src/components/ThemeSwitch.tsx",paraId:27,tocIndex:4},{value:" \u7EC4\u4EF6\u3002",paraId:27,tocIndex:4},{value:`import type { FC } from 'react';
import { ComputerDesktopOutline, MoonSparklesOutline, SunOutline } from '@metisjs/icons';
import { Dropdown } from 'metis-ui';
import { MenuClickEventHandler } from 'metis-ui/es/menu/interface';
import { useMetisUIConfig } from 'umi';

export type ThemeName = 'system' | 'light' | 'dark';

const themes = [
  {
    name: 'light',
    icon: <SunOutline />,
    label: '\u4EAE\u8272\u6A21\u5F0F',
  },
  {
    name: 'dark',
    icon: <MoonSparklesOutline />,
    label: '\u6697\u8272\u6A21\u5F0F',
  },
  {
    name: 'system',
    icon: <ComputerDesktopOutline />,
    label: '\u8DDF\u968F\u7CFB\u7EDF',
  },
];

const ThemeSwitch: FC = () => {
  const [config, setConfig] = useMetisUIConfig();

  const onThemeChange: MenuClickEventHandler = ({ key }) => {
    setConfig({ theme: key as ThemeName });
    localStorage.setItem('theme', key as ThemeName);
  };

  const currentTheme = themes.find((theme) => theme.name === (config.theme ?? 'system'));

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: themes.map((theme) => ({
          key: theme.name,
          label: theme.label,
          icon: theme.icon,
        })),
        selectable: true,
        selectedKeys: [currentTheme!.name],
        onClick: onThemeChange,
        className: { item: { icon: '-ms-1 size-5' } },
      }}
    >
      <button className="text-text m-6 flex items-center *:size-10">{currentTheme?.icon}</button>
    </Dropdown>
  );
};

export default ThemeSwitch;
`,paraId:28,tocIndex:4},{value:"\u518D\u6B21\u4FEE\u6539 ",paraId:29,tocIndex:4},{value:"src/pages/index.tsx",paraId:29,tocIndex:4},{value:"\uFF0C\u5F15\u5165 ",paraId:29,tocIndex:4},{value:"ThemeSwitch",paraId:29,tocIndex:4},{value:`import { Alert } from 'metis-ui';
import ThemeSwitch from '@/components/ThemeSwitch';

export default function HomePage() {
  return (
    <div className="h-screen w-screen">
      <Alert type="info" banner message="Hello" description="Welcome to metis-ui" />
      <ThemeSwitch />
    </div>
  );
}
`,paraId:30,tocIndex:4},{value:"\u73B0\u5728\u4F60\u5E94\u8BE5\u80FD\u770B\u5230\u9875\u9762\u4E0A\u5DF2\u7ECF\u6709\u4E86\u6837\u5F0F\u5207\u6362\u7684\u56FE\u6807\u4E86\uFF0C\u8BD5\u8BD5\u5207\u6362\u4E0D\u540C\u7684\u6837\u5F0F\u5427\u3002",paraId:31,tocIndex:4},{value:"\u5982\u679C\u4F60\u9700\u8981\u5728\u5E94\u7528\u4E2D\u5F00\u542F\u56FD\u9645\u5316\u529F\u80FD\uFF0C\u4F7F\u7528 ",paraId:32,tocIndex:5},{value:"@metisjs/umi-plugins/dist/locale",paraId:32,tocIndex:5},{value:" \u66FF\u6362 ",paraId:32,tocIndex:5},{value:"@umijs/plugins/dist/locale",paraId:32,tocIndex:5},{value:" \u63D2\u4EF6\uFF0C\u4F7F\u7528\u65B9\u6CD5\u53EF",paraId:32,tocIndex:5},{value:"\u53C2\u8003",paraId:32,tocIndex:5},{value:"\u3002",paraId:32,tocIndex:5},{value:`import { defineConfig } from 'umi';

export default defineConfig({
  // ...
  locale: { metisui: true, default: 'zh-CN' },
  plugins: [
    '@metisjs/umi-plugins/dist/metisui',
    '@metisjs/umi-plugins/dist/locale'
  ],
});
`,paraId:33,tocIndex:5},{value:"\u597D\u4E86\uFF0C\u73B0\u5728\u4F60\u53EF\u4EE5\u7EE7\u7EED\u9009\u7528\u5176\u4ED6\u7EC4\u4EF6\u5F00\u53D1\u5E94\u7528\u4E86\u3002\u5176\u4ED6\u5F00\u53D1\u6D41\u7A0B\u4F60\u53EF\u4EE5\u53C2\u8003 Umi \u7684",paraId:34,tocIndex:5},{value:"\u5B98\u65B9\u6587\u6863",paraId:34,tocIndex:5},{value:"\u3002",paraId:34,tocIndex:5}]},4823:function(c,a,e){e.r(a),e.d(a,{texts:function(){return i}});const i=[{value:"Vite",paraId:0},{value:" \u662F\u4E1A\u754C\u6700\u4F18\u79C0\u7684 React \u5E94\u7528\u5F00\u53D1\u5DE5\u5177\u4E4B\u4E00\uFF0C\u672C\u6587\u4F1A\u5C1D\u8BD5\u5728 Vite \u521B\u5EFA\u7684\u5DE5\u7A0B\u4E2D\u4F7F\u7528 ",paraId:0},{value:"metis-ui",paraId:0},{value:" \u7EC4\u4EF6\uFF0C\u5E76\u81EA\u5B9A\u4E49 Vite \u7684\u914D\u7F6E\u4EE5\u6EE1\u8DB3\u5404\u7C7B\u5DE5\u7A0B\u5316\u9700\u6C42\u3002",paraId:0},{value:"\u5728\u5F00\u59CB\u4E4B\u524D\uFF0C\u4F60\u53EF\u80FD\u9700\u8981\u5B89\u88C5 ",paraId:1,tocIndex:0},{value:"yarn",paraId:1,tocIndex:0},{value:" \u6216\u8005 ",paraId:1,tocIndex:0},{value:"pnpm",paraId:1,tocIndex:0},{value:" \u6216\u8005 ",paraId:1,tocIndex:0},{value:"bun",paraId:1,tocIndex:0},{value:"\u3002",paraId:1,tocIndex:0},{value:"\u5DE5\u5177\u4F1A\u81EA\u52A8\u521D\u59CB\u5316\u4E00\u4E2A\u811A\u624B\u67B6\u5E76\u5B89\u88C5 React \u9879\u76EE\u7684\u5404\u79CD\u5FC5\u8981\u4F9D\u8D56\uFF0C\u5982\u679C\u5728\u8FC7\u7A0B\u4E2D\u51FA\u73B0\u7F51\u7EDC\u95EE\u9898\uFF0C\u8BF7\u5C1D\u8BD5\u914D\u7F6E\u4EE3\u7406\uFF0C\u6216\u4F7F\u7528\u5176\u4ED6 npm registry\u3002",paraId:2},{value:"\u7136\u540E\u6211\u4EEC\u8FDB\u5165\u9879\u76EE\u5B89\u88C5\u4F9D\u8D56\u5E76\u542F\u52A8\u3002",paraId:3},{value:`$ cd metis-ui-demo
$ npm install
$ npm run dev
`,paraId:4},{value:"\u6B64\u65F6\u4F7F\u7528\u6D4F\u89C8\u5668\u8BBF\u95EE ",paraId:5},{value:"http://localhost:5173/",paraId:5},{value:" \uFF0C\u770B\u5230 ",paraId:5},{value:"Vite + React",paraId:5},{value:" \u7684\u754C\u9762\u5C31\u7B97\u6210\u529F\u4E86\u3002",paraId:5},{value:"\u5B89\u88C5 ",paraId:6,tocIndex:1},{value:"metis-ui",paraId:6,tocIndex:1},{value:"\u3001",paraId:6,tocIndex:1},{value:"tailwindcss",paraId:6,tocIndex:1},{value:" \u548C ",paraId:6,tocIndex:1},{value:"@tailwindcss/vite",paraId:6,tocIndex:1},{value:"\u3002",paraId:6,tocIndex:1},{value:"vite \u914D\u7F6E\u4E2D\u6DFB\u52A0 ",paraId:7},{value:"@tailwindcss/vite",paraId:7},{value:" \u63D2\u4EF6\u3002",paraId:7},{value:`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
  ],
});
`,paraId:8},{value:"\u6839\u76EE\u5F55\u4E0B\u65B0\u5EFA ",paraId:9},{value:"tailwind.css",paraId:9},{value:"\u3002",paraId:9},{value:`@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin 'metis-ui/plugin';
`,paraId:10},{value:"\u4FEE\u6539",paraId:11},{value:"index.html",paraId:11},{value:"\uFF0C\u5F15\u5165tailwindcss\u3002",paraId:11},{value:`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/tailwind.css" rel="stylesheet" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"><\/script>
  </body>
</html>
`,paraId:12},{value:"\u4FEE\u6539 ",paraId:13},{value:"src/App.ts",paraId:13},{value:"\uFF0C\u5F15\u5165 metis-ui \u7684\u6309\u94AE\u7EC4\u4EF6\u3002",paraId:13},{value:`import { Alert } from 'metis-ui';

const App = () => (
  <div className="h-screen w-screen">
    <Alert type="info" banner message="Hello" description="Welcome to metis-ui" />
  </div>
);

export default App;
`,paraId:14},{value:"\u597D\u4E86\uFF0C\u73B0\u5728\u4F60\u5E94\u8BE5\u80FD\u770B\u5230\u9875\u9762\u4E0A\u5DF2\u7ECF\u6709\u4E86 ",paraId:15},{value:"metis-ui",paraId:15},{value:" \u7684 ",paraId:15},{value:"Alert",paraId:15},{value:" \u7EC4\u4EF6\uFF0C\u63A5\u4E0B\u6765\u5C31\u53EF\u4EE5\u7EE7\u7EED\u9009\u7528\u5176\u4ED6\u7EC4\u4EF6\u5F00\u53D1\u5E94\u7528\u4E86\u3002\u5176\u4ED6\u5F00\u53D1\u6D41\u7A0B\u4F60\u53EF\u4EE5\u53C2\u8003 Vite \u7684",paraId:15},{value:"\u5B98\u65B9\u6587\u6863",paraId:15},{value:"\u3002",paraId:15},{value:"\u6211\u4EEC\u73B0\u5728\u5DF2\u7ECF\u628A metis-ui \u7EC4\u4EF6\u6210\u529F\u8FD0\u884C\u8D77\u6765\u4E86\uFF0C\u5F00\u59CB\u5F00\u53D1\u4F60\u7684\u5E94\u7528\u5427\uFF01",paraId:16}]}}]);
