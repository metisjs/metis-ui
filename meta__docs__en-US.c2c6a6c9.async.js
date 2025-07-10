"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[7430],{21371:function(i,a,e){e.d(a,{b:function(){return m}});var t=e(39546),r=e(33101),M=e(87802),I=e(23506),u=e(18537),b=e(34706),h=e(89364),w=e(16013),c=e(41936),d=function(p){(0,w.Z)(v,p);var f=(0,c.Z)(v);function v(){return(0,b.Z)(this,v),f.apply(this,arguments)}return(0,h.Z)(v,[{key:"render",value:function(){return this.props.children}}]),v}(t.Component),s=null,o=e(65056),l={subtree:!0,childList:!0,attributeFilter:["style","class"]};function m(p,f){var v=arguments.length>2&&arguments[2]!==void 0?arguments[2]:l;t.useEffect(function(){if(!(!(0,o.Z)()||!p)){var g,T=Array.isArray(p)?p:[p];return"MutationObserver"in window&&(g=new MutationObserver(f),T.forEach(function(x){g.observe(x,v)})),function(){var x,P;(x=g)===null||x===void 0||x.takeRecords(),(P=g)===null||P===void 0||P.disconnect()}}},[v,p])}var n=function(f){var v=f.children,g=f.options,T=f.onMutate,x=T===void 0?function(){}:T,P=useEvent(x),E=React.useRef(null),S=React.useRef(null),k=React.isValidElement(v)&&supportRef(v),D=useComposeRef(S,k?v.ref:null),A=React.useState(null),O=_slicedToArray(A,2),R=O[0],j=O[1];return useMutateObserver(R,P,g),useLayoutEffect(function(){j(findDOMNode(S.current)||findDOMNode(E.current))}),v?React.createElement(DomWrapper,{ref:E},k?React.cloneElement(v,{ref:D}):v):null},C=null,y=null},16718:function(i,a,e){e.r(a),e.d(a,{demos:function(){return r}});var t=e(39546),r={}},29496:function(i,a,e){e.r(a),e.d(a,{demos:function(){return r}});var t=e(39546),r={}},66508:function(i,a,e){e.r(a),e.d(a,{demos:function(){return r}});var t=e(39546),r={}},61702:function(i,a,e){e.r(a),e.d(a,{demos:function(){return r}});var t=e(39546),r={}},57984:function(i,a,e){e.r(a),e.d(a,{demos:function(){return r}});var t=e(39546),r={}},3425:function(i,a,e){e.r(a),e.d(a,{demos:function(){return r}});var t=e(39546),r={}},87905:function(i,a,e){e.r(a),e.d(a,{demos:function(){return r}});var t=e(39546),r={}},65502:function(i,a,e){e.r(a),e.d(a,{demos:function(){return r}});var t=e(39546),r={}},42924:function(i,a,e){e.r(a),e.d(a,{demos:function(){return r}});var t=e(39546),r={}},67811:function(i,a,e){e.r(a),e.d(a,{demos:function(){return w}});var t=e(90228),r=e.n(t),M=e(87999),I=e.n(M),u=e(39546),b=e(11801),h=e(92475),w={"docs-semantic-class-demo-en-us-0":{component:u.memo(u.lazy(I()(r()().mark(function c(){var d,s,o,l;return r()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,Promise.resolve().then(e.bind(e,11801));case 2:return d=n.sent,s=d.MagnifyingGlassOutline,n.next=6,Promise.resolve().then(e.bind(e,92475));case 6:return o=n.sent,l=o.Button,n.abrupt("return",{default:function(){return u.createElement(l,{type:"primary",icon:u.createElement(s,null),className:"bg-pink-500 text-white enabled:hover:bg-pink-400"},"Search")}});case 9:case"end":return n.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-semantic-class-demo-en-us-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { MagnifyingGlassOutline } from '@metisjs/icons';
import { Button } from 'metis-ui';

export default () => (
  <Button
    type="primary"
    icon={<MagnifyingGlassOutline />}
    className="bg-pink-500 text-white enabled:hover:bg-pink-400"
  >
    Search
  </Button>
);`},"@metisjs/icons":{type:"NPM",value:"1.1.0"},"metis-ui":{type:"NPM",value:"1.1.0"}},entry:"index.tsx"},context:{"@metisjs/icons":b,"metis-ui":h},renderOpts:{compile:function(){var c=I()(r()().mark(function s(){var o,l=arguments;return r()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.e(1317).then(e.bind(e,61317));case 2:return n.abrupt("return",(o=n.sent).default.apply(o,l));case 3:case"end":return n.stop()}},s)}));function d(){return c.apply(this,arguments)}return d}()}},"docs-semantic-class-demo-en-us-1":{component:u.memo(u.lazy(I()(r()().mark(function c(){var d,s;return r()().wrap(function(l){for(;;)switch(l.prev=l.next){case 0:return l.next=2,Promise.resolve().then(e.bind(e,92475));case 2:return d=l.sent,s=d.Card,l.abrupt("return",{default:function(){return u.createElement(s,{title:"Title",className:{root:"w-75",header:"bg-pink-400",body:"bg-pink-200 p-3",title:"text-primary"}},"Card content")}});case 5:case"end":return l.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-semantic-class-demo-en-us-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { Card } from 'metis-ui';

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
);`},"metis-ui":{type:"NPM",value:"1.1.0"}},entry:"index.tsx"},context:{"metis-ui":h},renderOpts:{compile:function(){var c=I()(r()().mark(function s(){var o,l=arguments;return r()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.e(1317).then(e.bind(e,61317));case 2:return n.abrupt("return",(o=n.sent).default.apply(o,l));case 3:case"end":return n.stop()}},s)}));function d(){return c.apply(this,arguments)}return d}()}},"docs-semantic-class-demo-en-us-2":{component:u.memo(u.lazy(I()(r()().mark(function c(){var d,s,o;return r()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,Promise.resolve().then(e.bind(e,92475));case 2:return d=m.sent,s=d.clsx,o=d.Tree,m.abrupt("return",{default:function(){return u.createElement(o,{showIcon:!0,defaultExpandedKeys:["0-0"],defaultSelectedKeys:["0-0-0-0"],treeData:[{title:"parent 1",key:"0-0",children:[{title:"leaf",key:"0-0-0-0",disableCheckbox:!0},{title:"leaf",key:"0-0-0-1"}]}],className:{root:"w-[240px]",node:function(y){var p=y.selected,f=y.expanded,v=y.leaf,g=y.halfChecked,T=y.checked;return s({"bg-pink-200":p,"text-pink-500":p&&v})}}})}});case 6:case"end":return m.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-semantic-class-demo-en-us-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { DocumentTextSolid, FolderCloseSolid, FolderOpenSolid } from '@metisjs/icons';
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
);`},"metis-ui":{type:"NPM",value:"1.1.0"}},entry:"index.tsx"},context:{"metis-ui":h},renderOpts:{compile:function(){var c=I()(r()().mark(function s(){var o,l=arguments;return r()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.e(1317).then(e.bind(e,61317));case 2:return n.abrupt("return",(o=n.sent).default.apply(o,l));case 3:case"end":return n.stop()}},s)}));function d(){return c.apply(this,arguments)}return d}()}}}},83982:function(i,a,e){e.r(a),e.d(a,{demos:function(){return w}});var t=e(90228),r=e.n(t),M=e(87999),I=e.n(M),u=e(39546),b=e(11801),h=e(92475),w={"docs-style-override-demo-en-us-0":{component:u.memo(u.lazy(I()(r()().mark(function c(){var d,s,o,l,m,n,C;return r()().wrap(function(p){for(;;)switch(p.prev=p.next){case 0:return p.next=2,Promise.resolve().then(e.bind(e,11801));case 2:return d=p.sent,s=d.MagnifyingGlassOutline,p.next=6,Promise.resolve().then(e.bind(e,92475));case 6:return o=p.sent,l=o.Button,m=o.ConfigProvider,n=o.Input,C=o.Space,p.abrupt("return",{default:function(){return u.createElement(m,{button:{className:{root:"outline-primary rounded-xl",icon:"size-5"}},input:{className:{root:"outline-primary rounded-xl",prefix:"text-error",suffix:"text-error"}}},u.createElement(C,{vertical:!0},u.createElement(n,{prefix:"\uFFE5",suffix:"RMB"}),u.createElement(l,{icon:u.createElement(s,null)},"Submit")))}});case 12:case"end":return p.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-style-override-demo-en-us-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { MagnifyingGlassOutline } from '@metisjs/icons';
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
);`},"@metisjs/icons":{type:"NPM",value:"1.1.0"},"metis-ui":{type:"NPM",value:"1.1.0"}},entry:"index.tsx"},context:{"@metisjs/icons":b,"metis-ui":h},renderOpts:{compile:function(){var c=I()(r()().mark(function s(){var o,l=arguments;return r()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.e(1317).then(e.bind(e,61317));case 2:return n.abrupt("return",(o=n.sent).default.apply(o,l));case 3:case"end":return n.stop()}},s)}));function d(){return c.apply(this,arguments)}return d}()}},"docs-style-override-demo-en-us-1":{component:u.memo(u.lazy(I()(r()().mark(function c(){var d,s,o,l;return r()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,Promise.resolve().then(e.bind(e,11801));case 2:return d=n.sent,s=d.MagnifyingGlassOutline,n.next=6,Promise.resolve().then(e.bind(e,92475));case 6:return o=n.sent,l=o.Button,n.abrupt("return",{default:function(){return u.createElement(l,{type:"primary",icon:u.createElement(s,null),className:"bg-pink-500 text-white enabled:hover:bg-pink-400"},"Search")}});case 9:case"end":return n.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-style-override-demo-en-us-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { MagnifyingGlassOutline } from '@metisjs/icons';
import { Button } from 'metis-ui';

export default () => (
  <Button
    type="primary"
    icon={<MagnifyingGlassOutline />}
    className="bg-pink-500 text-white enabled:hover:bg-pink-400"
  >
    Search
  </Button>
);`},"@metisjs/icons":{type:"NPM",value:"1.1.0"},"metis-ui":{type:"NPM",value:"1.1.0"}},entry:"index.tsx"},context:{"@metisjs/icons":b,"metis-ui":h},renderOpts:{compile:function(){var c=I()(r()().mark(function s(){var o,l=arguments;return r()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.e(1317).then(e.bind(e,61317));case 2:return n.abrupt("return",(o=n.sent).default.apply(o,l));case 3:case"end":return n.stop()}},s)}));function d(){return c.apply(this,arguments)}return d}()}}}},9525:function(i,a,e){e.r(a),e.d(a,{demos:function(){return r}});var t=e(39546),r={}},57875:function(i,a,e){e.r(a),e.d(a,{demos:function(){return r}});var t=e(39546),r={}},92338:function(i,a,e){e.r(a),e.d(a,{demos:function(){return r}});var t=e(39546),r={}},83074:function(i,a,e){e.r(a),e.d(a,{demos:function(){return r}});var t=e(39546),r={}},99543:function(i,a,e){e.r(a),e.d(a,{texts:function(){return t}});const t=[{value:"The default language of ",paraId:0},{value:"metisui",paraId:0},{value:" is English. If you need to use other languages, you can refer to the following solutions.",paraId:0},{value:"metisui",paraId:1,tocIndex:0},{value:" provides a React component ",paraId:1,tocIndex:0},{value:"ConfigProvider",paraId:2,tocIndex:0},{value:" for globally configuring internationalization.",paraId:1,tocIndex:0},{value:`import zhCN from 'metis-ui/locale/zh_CN';

return (
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>
);
`,paraId:3,tocIndex:0},{value:"For detailed configuration, see: ",paraId:4,tocIndex:0},{value:"ConfigProvider",paraId:5,tocIndex:0},{value:".",paraId:4,tocIndex:0},{value:"Note: zh_CN is the file name, and the following table follows the same naming convention.",paraId:6,tocIndex:0},{value:"Currently supported languages:",paraId:7,tocIndex:0},{value:"Language",paraId:8,tocIndex:0},{value:"File Name",paraId:8,tocIndex:0},{value:"English",paraId:8,tocIndex:0},{value:"en_US",paraId:8,tocIndex:0},{value:"Simplified Chinese",paraId:8,tocIndex:0},{value:"zh_CN",paraId:8,tocIndex:0},{value:"For specific usage, please refer to the ",paraId:9,tocIndex:0},{value:"ConfigProvider",paraId:10,tocIndex:0},{value:" documentation.",paraId:9,tocIndex:0},{value:"Translate by ChartGPT",paraId:11,tocIndex:0}]},41158:function(i,a,e){e.r(a),e.d(a,{texts:function(){return t}});const t=[{value:"Before getting started, it is recommended to learn ",paraId:0},{value:"React",paraId:0},{value:". Please ensure your project meets the following requirements:",paraId:0},{value:"Node.js",paraId:1},{value:" v16 or above",paraId:1},{value:"React",paraId:1},{value:" v18 or above",paraId:1},{value:"Tailwind CSS",paraId:1},{value:" v4 or above",paraId:1},{value:"If you need to build a project from scratch, you can refer to the usage guides for ",paraId:2},{value:"Vite",paraId:3},{value:", ",paraId:2},{value:"Next.js",paraId:4},{value:", or ",paraId:2},{value:"Umi",paraId:5},{value:".",paraId:2},{value:"It is recommended to use ",paraId:6,tocIndex:0},{value:"pnpm",paraId:6,tocIndex:0},{value:" for development.",paraId:6,tocIndex:0},{value:"Add a ",paraId:7,tocIndex:1},{value:"@plugin",paraId:7,tocIndex:1},{value:" to your entry CSS file to import Metis UI.",paraId:7,tocIndex:1},{value:`@import 'tailwindcss';

@source './node_modules/metis-ui/es'; /* This must use a relative path and should be adjusted based on the actual entry CSS file path */
@plugin 'metis-ui/plugin';
`,paraId:8,tocIndex:1},{value:"Translate by ChartGPT",paraId:9,tocIndex:1}]},59795:function(i,a,e){e.r(a),e.d(a,{texts:function(){return t}});const t=[{value:"The goal of Metis UI is to provide a more flexible choice for developers who like Ant Design, especially those who want to integrate Tailwind CSS. While retaining the design logic of Ant Design components, we offer the following improvements:",paraId:0},{value:"More Flexible Style Customization",paraId:1},{value:`
Based on the Tailwind CSS styling system, developers can easily override the styles of each component element without writing complex custom styles, enabling quick and personalized designs.`,paraId:1},{value:"Enhanced Interaction Features",paraId:2},{value:`
Built-in common interaction features such as remote data requests, value type formatting, and value type enumeration, reducing repetitive work in these scenarios.`,paraId:2},{value:"Lightweight and Modern",paraId:3},{value:`
By combining Tailwind CSS and TypeScript, Metis UI provides a more modern development experience while maintaining high customizability and consistency of components.`,paraId:3},{value:"Metis UI is a tailored solution for developers who want to enjoy the flexibility of Tailwind CSS while adhering to the design logic of Ant Design.",paraId:4},{value:"\u{1F308} Inspired by Ant Design's component design, offering a rich set of components.",paraId:5,tocIndex:0},{value:"\u{1F3A8} Powered by Tailwind CSS, allowing quick customization and overriding of default styles.",paraId:5,tocIndex:0},{value:"\u{1F6E1} Developed with TypeScript, providing complete type definitions.",paraId:5,tocIndex:0},{value:"\u2699\uFE0F Comprehensive theme customization capabilities for every detail.",paraId:5,tocIndex:0},{value:"Chrome 111+",paraId:6,tocIndex:1},{value:"Safari 16.4+",paraId:6,tocIndex:1},{value:"Firefox 128+",paraId:6,tocIndex:1},{value:"We recommend using ",paraId:7,tocIndex:3},{value:"pnpm",paraId:7,tocIndex:3},{value:" for development",paraId:7,tocIndex:3},{value:", as it not only allows for easy debugging in the development environment but also ensures reliable packaging and deployment in production environments. Enjoy the benefits brought by the entire ecosystem and toolchain.",paraId:7,tocIndex:3},{value:"Translate by ChartGPT",paraId:8}]},12833:function(i,a,e){e.r(a),e.d(a,{texts:function(){return t}});const t=[{value:"This project is based on ",paraId:0},{value:"Vite",paraId:0},{value:' as the frontend build tool, adopting a modern development workflow and efficient module hot-reloading mechanism. The directory structure is clearly divided by functionality, following the "convention over configuration" principle to facilitate team collaboration and project maintenance.',paraId:0},{value:"The responsibilities of each directory and file are as follows:",paraId:1},{value:"public",paraId:2},{value:": Stores static resources that can be accessed directly without building, such as favicon and global images.",paraId:2},{value:"src",paraId:2},{value:`: The core source code directory, subdivided by functional modules to improve readability and maintainability.
`,paraId:2},{value:"apis",paraId:3},{value:": Centralized management of all backend API requests for easy reuse and maintenance.",paraId:3},{value:"assets",paraId:3},{value:": Centralized storage of images, SVGs, and other static resources for unified management and referencing.",paraId:3},{value:"components",paraId:3},{value:": Encapsulated common UI components for high reusability and low coupling.",paraId:3},{value:"hooks",paraId:3},{value:": Custom React Hooks to extract common logic and improve code reuse.",paraId:3},{value:"layouts",paraId:3},{value:": Components related to page layouts, supporting multiple page structure switches.",paraId:3},{value:"locale",paraId:3},{value:": Internationalization resource files for multi-language support.",paraId:3},{value:"mocks",paraId:3},{value:": Local mock data and services for development and testing.",paraId:3},{value:"pages",paraId:3},{value:": Page-level components organized by routes for clear structure.",paraId:3},{value:"store",paraId:3},{value:": Global state management based on Zustand, simple and efficient.",paraId:3},{value:"types",paraId:3},{value:": TypeScript type definitions to enhance type safety and development experience.",paraId:3},{value:"utils",paraId:3},{value:": Common utility functions and classes for global use.",paraId:3},{value:"Other entry and configuration files to ensure a clear and well-defined project structure.",paraId:3},{value:"With this directory convention, you can quickly locate and manage various resources and code in the project, reducing maintenance costs and improving development efficiency. It is suitable for medium to large team collaboration and facilitates future feature expansion and technology upgrades.",paraId:4},{value:`\u251C\u2500\u2500 .husky                     # Husky hook configuration directory
\u251C\u2500\u2500 public                     # Public static resources
\u251C\u2500\u2500 src                        # Source code directory
\u2502   \u251C\u2500\u2500 apis                   # Backend API requests
\u2502   \u251C\u2500\u2500 assets                 # Static resources (images, SVGs, etc.)
\u2502   \u251C\u2500\u2500 components             # Common components
\u2502   \u251C\u2500\u2500 hooks                  # Custom hooks
\u2502   \u251C\u2500\u2500 layouts                # Page layout components
\u2502   \u251C\u2500\u2500 locale                 # Internationalization resources
\u2502   \u251C\u2500\u2500 mocks                  # Mock data and services
\u2502   \u251C\u2500\u2500 pages                  # Page components
\u2502   \u251C\u2500\u2500 store                  # Zustand state management
\u2502   \u251C\u2500\u2500 types                  # TypeScript type definitions
\u2502   \u251C\u2500\u2500 utils                  # Utility functions and classes
\u2502   \u251C\u2500\u2500 loading.tsx            # Global Loading component
\u2502   \u251C\u2500\u2500 main.tsx               # Application entry file
\u2502   \u251C\u2500\u2500 routes.tsx             # Route and menu configuration
\u2502   \u2514\u2500\u2500 vite-env.d.ts          # Vite environment type declarations
\u251C\u2500\u2500 .env                       # Environment variable configuration
\u251C\u2500\u2500 .lintstagedrc              # lint-staged configuration
\u251C\u2500\u2500 .prettierignore            # Prettier ignore file
\u251C\u2500\u2500 .prettierrc                # Prettier code formatting configuration
\u251C\u2500\u2500 commitlint.config.js       # Commit message linting configuration
\u251C\u2500\u2500 eslint.config.js           # ESLint configuration
\u251C\u2500\u2500 index.html                 # Project entry HTML
\u251C\u2500\u2500 package.json               # Project dependencies and scripts
\u251C\u2500\u2500 tailwind.css               # TailwindCSS global styles entry
\u251C\u2500\u2500 tsconfig.app.json          # TS app configuration
\u251C\u2500\u2500 tsconfig.json              # TS root configuration
\u251C\u2500\u2500 tsconfig.node.json         # TS Node configuration
`,paraId:5,tocIndex:0},{value:"Translate by ChartGPT",paraId:6,tocIndex:0}]},80591:function(i,a,e){e.r(a),e.d(a,{texts:function(){return t}});const t=[{value:"Metis Plus",paraId:0},{value:" is an enterprise admin system template built with ",paraId:0},{value:"React",paraId:0},{value:"\u3001",paraId:0},{value:"react-router",paraId:0},{value:", ",paraId:0},{value:"TypeScript",paraId:0},{value:", ",paraId:0},{value:"Vite",paraId:0},{value:", ",paraId:0},{value:"TailwindCSS",paraId:0},{value:", ",paraId:0},{value:"Zustand",paraId:0},{value:", ",paraId:0},{value:"faker-js",paraId:0},{value:", ",paraId:0},{value:"MSW",paraId:0},{value:", and other technologies. It comes with out-of-the-box features such as data flow, internationalization, menus, mock data, permission management, and theme switching, helping enterprises quickly build high-quality admin applications.",paraId:0},{value:`$ git clone https://github.com/metisjs/metis-plus.git
$ cd metis-plus
`,paraId:1,tocIndex:0},{value:"It is recommended to use ",paraId:2,tocIndex:1},{value:"pnpm",paraId:2,tocIndex:1},{value:" for development.",paraId:2,tocIndex:1},{value:"After starting, you can access the local development environment in your browser.",paraId:3},{value:"Translate by ChartGPT",paraId:4}]},64039:function(i,a,e){e.r(a),e.d(a,{texts:function(){return t}});const t=[{value:"This project uses ",paraId:0},{value:"i18next",paraId:0},{value:" and ",paraId:0},{value:"react-i18next",paraId:0},{value:" to implement internationalization.",paraId:0},{value:`
i18next provides powerful multilingual support, while react-i18next offers a convenient internationalization solution for React applications.`,paraId:0},{value:"For more information, refer to the ",paraId:1},{value:"i18next documentation",paraId:1},{value:" and ",paraId:1},{value:"react-i18next documentation",paraId:1},{value:".",paraId:1},{value:`\u251C\u2500\u2500 locale
\u2502   \u251C\u2500\u2500 en-US.json
\u2502   \u2514\u2500\u2500 zh-CN.json
`,paraId:2,tocIndex:0}]},10140:function(i,a,e){e.r(a),e.d(a,{texts:function(){return t}});const t=[{value:"This project uses ",paraId:0},{value:"msw",paraId:0},{value:" to mock API requests, combined with ",paraId:0},{value:"faker-js",paraId:0},{value:" to generate random data for easier development and testing.",paraId:0},{value:"msw",paraId:1},{value:": Mock Service Worker, intercepts and mocks network requests, supporting both REST and GraphQL.",paraId:1},{value:"faker-js",paraId:1},{value:": Generates various types of fake data, such as names, addresses, images, and more.",paraId:1},{value:"You can check the implementation in the ",paraId:2},{value:"mocks",paraId:2},{value:" directory, or refer to the ",paraId:2},{value:"official msw documentation",paraId:2},{value:" and ",paraId:2},{value:"faker-js guide",paraId:2},{value:" for more usage details.",paraId:2},{value:`\u251C\u2500\u2500 mocks
\u2502   \u251C\u2500\u2500 handlers           # All request handlers
\u2502   \u2502   \u251C\u2500\u2500 index.ts       # Handler entry file, exports all module handlers
\u2502   \u2502   \u2514\u2500\u2500 user.ts        # User-related mock API handlers
\u2502   \u2514\u2500\u2500 browser.ts         # Entry file to configure and start the mock service
`,paraId:3,tocIndex:0},{value:"Create a file named ",paraId:4,tocIndex:1},{value:"faker-list.ts",paraId:4,tocIndex:1},{value:" under ",paraId:4,tocIndex:1},{value:"src/mocks/handlers",paraId:4,tocIndex:1},{value:".",paraId:4,tocIndex:1},{value:`import { faker } from '@faker-js/faker';
import { delay, http, HttpResponse } from 'msw';
import type { CurrentUser } from '@/types/user';
import type { UserPermissions } from '@/utils/auth';

const userHandles = [
  http.get('/api/faker-list', async ({ request }) => {
    await delay(600);

    return HttpResponse.json({
      success: true,
      data: [
        /* Mock data, you can generate it using faker-js */
      ],
    });
  }),
];

export default userHandles;
`,paraId:5,tocIndex:1},{value:"Then import this file in ",paraId:6,tocIndex:1},{value:"src/mocks/handlers/index.ts",paraId:6,tocIndex:1},{value:":",paraId:6,tocIndex:1},{value:`import fakerListHandlers from './faker-list';
import userHandlers from './user';

export default [
  ...userHandlers,
  ...fakerListHandlers
];
`,paraId:7,tocIndex:1},{value:"Now, any ",paraId:8,tocIndex:1},{value:"[GET]/api/faker-list",paraId:8,tocIndex:1},{value:" request will be intercepted and handled by the mock service.",paraId:8,tocIndex:1},{value:"Translate by ChartGPT",paraId:9,tocIndex:1}]},80935:function(i,a,e){e.r(a),e.d(a,{texts:function(){return t}});const t=[]},7103:function(i,a,e){e.r(a),e.d(a,{texts:function(){return t}});const t=[{value:"Routes are usually closely tied to menus. To simplify maintenance, we automatically generate menu items from a unified route configuration table. This way, you only need to maintain a single set of route data, and the menu structure will automatically stay in sync, avoiding duplicate configurations and potential inconsistencies.",paraId:0},{value:"This approach not only improves development efficiency but also ensures consistency and maintainability between routes and menus.",paraId:1},{value:`{
  path: '/',
  component: () => import('@/layouts/MainLayout'),                        // Global layout component
  children: [
    {
      index: true,
      element: <Navigate to="/workplace" replace />,                      // Redirects "/" to "/workplace"
    },
    {
      name: 'menu.workplace',                                             // Menu name, supports i18n key. Only parsed as a menu if name is not empty.
      icon: <Squares2X2Outline />,                                        // Menu icon
      path: 'workplace',                                                  // Menu path
      component: () => import('@/pages/workplace'),                       // Page component
      hideInMenu: true,                                                   // Whether to show in menu; e.g., detail pages are usually hidden from the menu but shown in breadcrumbs
      permission: { resource: 'system.user-list', action: ['read'] },     // Permission config, see: [Permission Config](/plus-permission-cn)
      children:[{...}]                                                    // Submenus or routes
    }
  ]
}
`,paraId:2,tocIndex:0},{value:"Create a new ",paraId:3,tocIndex:1},{value:"admin",paraId:3,tocIndex:1},{value:" folder under ",paraId:3,tocIndex:1},{value:"pages",paraId:3,tocIndex:1},{value:", and add an ",paraId:3,tocIndex:1},{value:"index.tsx",paraId:3,tocIndex:1},{value:" file inside.",paraId:3,tocIndex:1},{value:`import PageContainer from '@/components/PageContainer';

const Admin = () => {
  return <PageContainer>Admin</PageContainer>;
};

export default Admin;
`,paraId:4,tocIndex:1},{value:"Add a new route configuration in the route table.",paraId:5,tocIndex:1},{value:`const routes: Route[] = [
  {
    path: loginPath,
    component: () => import('@/pages/login'),
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout'),
    children: [
      {
        index: true,
        element: <Navigate to="/workplace" replace />,
      },
      {
        name: 'menu.workplace',
        icon: <Squares2X2Outline />,
        path: 'workplace',
        component: () => import('@/pages/workplace'),
      },
      {
        name: 'menu.admin',
        icon: <Cog6ToothOutline />,
        path: 'admin',
        component: () => import('@/pages/admin'),
      },
      {
        path: '*',
        component: () => import('@/pages/404'),
      },
    ],
  },
];
`,paraId:6,tocIndex:1},{value:"Add internationalization content",paraId:7,tocIndex:1},{value:`{
  "menu.workplace": "\u5DE5\u4F5C\u53F0",
  "menu.admin": "\u7CFB\u7EDF\u7BA1\u7406"
}
`,paraId:8,tocIndex:1},{value:"That's it! You've finished configuring a new menu item. Now refresh the page and you'll see the new menu entry.",paraId:9,tocIndex:1},{value:"Translate by ChartGPT",paraId:10,tocIndex:1}]},32595:function(i,a,e){e.r(a),e.d(a,{texts:function(){return t}});const t=[{value:"The ",paraId:0},{value:"className",paraId:0},{value:" property of Metis UI components is not the common ",paraId:0},{value:"string",paraId:0},{value:" type but supports multiple mixed types. This design aims to make it easier for users to override the default component styles using ",paraId:0},{value:"tailwindcss",paraId:0},{value:".",paraId:0},{value:"This article will guide you through the various types of ",paraId:1},{value:"className",paraId:1},{value:" usage.",paraId:1},{value:"Similar to traditional usage, ",paraId:2,tocIndex:0},{value:"className",paraId:2,tocIndex:0},{value:" applies to the root node of the component.",paraId:2,tocIndex:0},{value:"You can customize the styles of the component's child elements.",paraId:3,tocIndex:1},{value:"The specific types vary depending on the component. You can refer to the ",paraId:4,tocIndex:1},{value:"Component API",paraId:5,tocIndex:1},{value:" for details.",paraId:4,tocIndex:1},{value:"You can define different styles based on the component's state.",paraId:6,tocIndex:2},{value:"The specific parameters vary depending on the component. You can refer to the ",paraId:7,tocIndex:2},{value:"Component API",paraId:8,tocIndex:2},{value:" for details.",paraId:7,tocIndex:2},{value:"Translate by ChartGPT",paraId:9}]},11741:function(i,a,e){e.r(a),e.d(a,{texts:function(){return t}});const t=[{value:"In real-world projects, developers often need to globally or locally override component styles to meet specific design requirements or branding guidelines. Metis UI provides multiple ways to achieve style overrides, allowing you to flexibly adjust default component styles or customize them for specific scenarios.",paraId:0},{value:"By modifying theme colors, you can quickly adjust global styles to fit your brand requirements. For detailed methods, refer to the ",paraId:1,tocIndex:1},{value:"Theme Documentation",paraId:2,tocIndex:1},{value:".",paraId:1,tocIndex:1},{value:"ConfigProvider",paraId:3},{value:"The ",paraId:4,tocIndex:2},{value:"ConfigProvider",paraId:4,tocIndex:2},{value:" component allows developers to globally override component styles through configuration. For example:",paraId:4,tocIndex:2},{value:"Metis UI retains the traditional ",paraId:5,tocIndex:3},{value:"class",paraId:5,tocIndex:3},{value:" attribute for components, allowing developers to directly override styles through CSS files. For example:",paraId:5,tocIndex:3},{value:`@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin 'metis-ui/plugin';

.metis-btn.metis-btn-default {
  @apply bg-pink-300;
}
`,paraId:6,tocIndex:3},{value:"For local style adjustments, you can customize styles flexibly using the ",paraId:7,tocIndex:4},{value:"className",paraId:7,tocIndex:4},{value:" property of components to meet specific needs. For more details, see the ",paraId:7,tocIndex:4},{value:"Semantic Class Documentation",paraId:8,tocIndex:4},{value:". For example:",paraId:7,tocIndex:4},{value:"Translate by ChartGPT",paraId:9}]},86704:function(i,a,e){e.r(a),e.d(a,{texts:function(){return t}});const t=[{value:"Metis UI only customizes themes based on colors and provides two default themes: ",paraId:0},{value:"light",paraId:0},{value:" and ",paraId:0},{value:"dark",paraId:0},{value:". You can also create your own custom themes or modify the built-in themes.",paraId:0},{value:"You can manage themes by adding parentheses after ",paraId:1},{value:'@plugin "metis-ui/plugin"',paraId:1},{value:" in the CSS file.",paraId:1},{value:`@plugin 'metis-ui/plugin' {
  themes: light --default, dark --dark; /* --default: Default theme --dark: Default dark theme, adapts to prefers-color-scheme: dark */
}
`,paraId:2},{value:"Set the current theme using the ",paraId:3},{value:"ConfigProvider",paraId:3},{value:" component. The default options are ",paraId:3},{value:"light",paraId:3},{value:", ",paraId:3},{value:"dark",paraId:3},{value:", and ",paraId:3},{value:"system",paraId:3},{value:".",paraId:3},{value:`import React from 'react';
import { ConfigProvider } from 'metis-ui';

const App: React.FC = () => <ConfigProvider theme="dark">{/* ... */}</ConfigProvider>;

export default App;
`,paraId:4},{value:"Disable a specific theme.",paraId:5,tocIndex:0},{value:`@plugin './src/plugin' {
  themes: light --default;
}
`,paraId:6,tocIndex:0},{value:"Disable all themes.",paraId:7,tocIndex:0},{value:`@plugin './src/plugin' {
  themes: false;
}
`,paraId:8,tocIndex:0},{value:"You can use nested ",paraId:9,tocIndex:1},{value:"ConfigProvider",paraId:9,tocIndex:1},{value:" components to switch themes locally. The ",paraId:9,tocIndex:1},{value:"theme",paraId:9,tocIndex:1},{value:" values not changed in the child theme will inherit from the parent theme.",paraId:9,tocIndex:1},{value:`import React from 'react';
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
`,paraId:10,tocIndex:1},{value:"To add a new theme, use ",paraId:11,tocIndex:2},{value:'@plugin "metis-ui/theme" {}',paraId:11,tocIndex:2},{value:" in the CSS file with the following structure:",paraId:11,tocIndex:2},{value:`@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin "metis-ui/plugin";
@plugin "metis-ui/theme" {
  /* Theme name */
  name: 'custom-theme';
  /* Default theme */
  default: true;
  /* Default dark theme, switches automatically with the system */
  dark: false;
  /* light or dark */
  color-scheme: light;

  /* Brand color */
  primary: 'indigo-600';
  /* Brand hover color (optional, can be derived)  */
  primary-hover: 'indigo-500';
  /* Brand active color */
  primary-active: 'indigo-700';
  /* Brand background color (optional, can be derived) */
  primary-bg: 'indigo-50';
  /* Brand background hover color (optional, can be derived) */
  primary-bg-hover: 'indigo-200';
  /* Brand border color (optional, can be derived)  */
  primary-border: 'indigo-300';
  /* Secondary brand border color (optional, can be derived) */
  primary-border-secondary: 'indigo-600/10';

  /* Success color */
  success: 'green-500';
  /* Success hover color (optional, can be derived) */
  success-hover: 'green-400';
  /* Success active color (optional, can be derived) */
  success-active: 'green-600';
  /* Success background color (optional, can be derived) */
  success-bg: 'green-50';
  /* Success background hover color (optional, can be derived) */
  success-bg-hover: 'green-100';
  /* Success border color (optional, can be derived) */
  success-border: 'green-300';
  /* Secondary success border color (optional, can be derived) */
  success-border-secondary: 'green-500/20';

  /* Warning color */
  warning: 'yellow-500';
  /* Warning hover color (optional, can be derived) */
  warning-hover: 'yellow-400';
  /* Warning active color (optional, can be derived) */
  warning-active: 'yellow-600';
  /* Warning background color (optional, can be derived) */
  warning-bg: 'yellow-50';
  /* Warning background hover color (optional, can be derived) */
  warning-bg-hover: 'yellow-100';
  /* Warning border color (optional, can be derived) */
  warning-border: 'yellow-300';
  /* Secondary warning border color (optional, can be derived) */
  warning-border-secondary: 'yellow-500/20';

  /* Error color */
  error: 'red-500';
  /* Error hover color (optional, can be derived) */
  error-hover: 'red-400';
  /* Error active color (optional, can be derived) */
  error-active: 'red-600';
  /* Error background color (optional, can be derived) */
  error-bg: 'red-50';
  /* Error background hover color (optional, can be derived) */
  error-bg-hover: 'red-100';
  /* Error border color (optional, can be derived) */
  error-border: 'red-300';
  /* Secondary error border color (optional, can be derived) */
  error-border-secondary: 'red-500/20';

  /* Primary text color */
  text: 'gray-950';
  /* Secondary text color (optional, can be derived) */
  text-secondary: 'gray-500';
  /* Tertiary text color (optional, can be derived) */
  text-tertiary: 'gray-400';
  /* Quaternary text color (optional, can be derived) */
  text-quaternary: 'gray-300';

  /* Primary border color */
  border: 'gray-300';
  /* Secondary border color (optional, can be derived) */
  border-secondary: 'gray-200';
  /* Tertiary border color (optional, can be derived) */
  border-tertiary: 'gray-100';

  /* Primary fill color */
  fill: 'gray-950/20';
  /* Secondary fill color (optional, can be derived) */
  fill-secondary: 'gray-950/15';
  /* Tertiary fill color (optional, can be derived) */
  fill-tertiary: 'gray-950/10';
  /* Quaternary fill color (optional, can be derived) */
  fill-quaternary: 'gray-950/5';
  /* Quinary fill color (optional, can be derived) */
  fill-quinary: 'gray-950/2';

  /* Component container background */
  container: 'white';

  /* Attention-grabbing background color */
  spotlight: 'gray-900/85';

  /* Background mask color for overlays */
  mask: 'gray-900/45';

  /** Scrollbar colors for scrollable components */
  scrollbar-track: 'black/5';
  scrollbar-thumb: 'black/50';
}
`,paraId:12,tocIndex:2},{value:"Theme colors can be ",paraId:13,tocIndex:2},{value:"Tailwindcss Colors",paraId:13,tocIndex:2},{value:" or ",paraId:13,tocIndex:2},{value:"CSS Colors",paraId:13,tocIndex:2},{value:".",paraId:13,tocIndex:2},{value:"You can simplify theme customization by deriving secondary colors from ",paraId:14,tocIndex:2},{value:"Tailwindcss Colors",paraId:14,tocIndex:2},{value:":",paraId:14,tocIndex:2},{value:`@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin "metis-ui/plugin";
@plugin "metis-ui/theme" {
  /* Theme name */
  name: 'custom-theme';
  /* Default theme */
  default: true;
  /* Default dark theme, switches automatically with the system */
  dark: false;
  /* light or dark */
  color-scheme: light;

  /* Brand color */
  primary: 'sky-600';
  /* Success color */
  success: 'green-500';
  /* Warning color */
  warning: 'yellow-500';
  /* Error color */
  error: 'red-500';
  /* Primary text color */
  text: 'gray-950';
  /* Primary border color */
  border: 'gray-300';
  /* Primary fill color */
  fill: 'gray-950/20';
  /* Component container background */
  container: 'white';
  /* Attention-grabbing background color */
  spotlight: 'gray-900/85';
  /* Background mask color for overlays */
  mask: 'gray-900/45';
  /** Scrollbar colors for scrollable components */
  scrollbar-track: 'black/5';
  scrollbar-thumb: 'black/50';
}
`,paraId:15,tocIndex:2},{value:"To customize a built-in theme, use the same structure as adding a new theme but with the name of the built-in theme.",paraId:16,tocIndex:3},{value:"For example, to customize the ",paraId:17,tocIndex:3},{value:"light",paraId:17,tocIndex:3},{value:" theme:",paraId:17,tocIndex:3},{value:`@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin "metis-ui/plugin";
@plugin "metis-ui/theme" {
  /* Theme name */
  name: 'light';
  /* Default theme */
  default: true;
  /* Default dark theme, switches automatically with the system */
  dark: false;
  /* light or dark */
  color-scheme: light;

  /* Brand color */
  primary: 'pink-600';
}
`,paraId:18,tocIndex:3},{value:"All other colors will inherit from the original theme.",paraId:19,tocIndex:3},{value:"Translate by ChartGPT",paraId:20,tocIndex:3}]},30714:function(i,a,e){e.r(a),e.d(a,{texts:function(){return t}});const t=[{value:"Next.js",paraId:0},{value:" is currently the most popular React server-side rendering framework in the world. This article will demonstrate how to use ",paraId:0},{value:"metis-ui",paraId:0},{value:" components in a project created with Next.js.",paraId:0},{value:"Before getting started, you may need to install ",paraId:1,tocIndex:0},{value:"yarn",paraId:1,tocIndex:0},{value:", ",paraId:1,tocIndex:0},{value:"pnpm",paraId:1,tocIndex:0},{value:", or ",paraId:1,tocIndex:0},{value:"bun",paraId:1,tocIndex:0},{value:".",paraId:1,tocIndex:0},{value:"The tool will automatically scaffold a project and install the necessary dependencies. During the installation process, you will need to make some configuration choices. Make sure to enable ",paraId:2},{value:"Tailwind CSS",paraId:2},{value:". If you encounter network issues during installation, try configuring a proxy or using a different npm registry. For example, you can switch to the Taobao mirror: ",paraId:2},{value:"npm config set registry https://registry.npmmirror.com",paraId:2},{value:".",paraId:2},{value:"Once the initialization is complete, navigate to the project directory and start the development server.",paraId:3},{value:`$ cd metis-ui-demo
$ npm run dev
`,paraId:4},{value:"Now, open your browser and visit ",paraId:5},{value:"http://localhost:3000/",paraId:5},{value:". If you see the NEXT logo, the setup is successful.",paraId:5},{value:"Next, install and import ",paraId:6,tocIndex:1},{value:"metis-ui",paraId:6,tocIndex:1},{value:" using yarn, npm, pnpm, or bun.",paraId:6,tocIndex:1},{value:"Modify ",paraId:7},{value:"src/app/globals.css",paraId:7},{value:".",paraId:7},{value:`@import 'tailwindcss';

@source '../../node_modules/metis-ui/es'; /* Use relative paths here. If there is no src directory, replace with ../node_modules/metis-ui/es */
@plugin 'metis-ui/plugin';
`,paraId:8},{value:"Update ",paraId:9},{value:"src/app/page.tsx",paraId:9},{value:" to include the ",paraId:9},{value:"metis-ui",paraId:9},{value:" button component.",paraId:9},{value:`import React from 'react';
import { Button } from 'metis-ui';

const Home = () => (
  <div className="App">
    <Button type="primary">Button</Button>
  </div>
);

export default Home;
`,paraId:10},{value:"Now, you should see a blue button component from ",paraId:11},{value:"metis-ui",paraId:11},{value:" on the page. You can continue to use other components to develop your application. For additional development workflows, refer to the ",paraId:11},{value:"Next.js",paraId:11},{value:".",paraId:11},{value:"Note: The Next.js App Router currently does not support directly using subcomponents imported with ",paraId:12},{value:".",paraId:12},{value:" such as ",paraId:12},{value:"<Avatar.Group />",paraId:12},{value:" or ",paraId:12},{value:"<DatePicker.RangePicker />",paraId:12},{value:". To avoid errors, import these subcomponents using their specific paths.",paraId:12},{value:"Translate by ChartGPT",paraId:13}]},85559:function(i,a,e){e.r(a),e.d(a,{texts:function(){return t}});const t=[{value:"Umi",paraId:0},{value:" is Ant Group's foundational front-end framework. It supports both configuration-based and convention-based routing, ensuring comprehensive routing functionality and enabling feature extensions. Additionally, it comes with a robust plugin system that covers every lifecycle stage from source code to build artifacts, supporting various feature extensions and business requirements.",paraId:0},{value:"This article will guide you through creating a simple application from scratch using Umi and Metis UI.",paraId:1},{value:"Before starting, you may need to install ",paraId:2,tocIndex:0},{value:"yarn",paraId:2,tocIndex:0},{value:", ",paraId:2,tocIndex:0},{value:"pnpm",paraId:2,tocIndex:0},{value:", or ",paraId:2,tocIndex:0},{value:"bun",paraId:2,tocIndex:0},{value:".",paraId:2,tocIndex:0},{value:'Choose "Simple App" from the options.',paraId:3},{value:`? Pick Umi App Template \u203A - Use arrow-keys. Return to submit.
\u276F   Simple App
  Ant Design Pro
  Vue Simple App
  Umi Plugin
`,paraId:4},{value:"You can select other options based on your actual needs.",paraId:5},{value:"The tool will then automatically install dependencies and execute Umi's initialization script.",paraId:6},{value:"Now, install and import Metis UI along with some dependencies required for this tutorial using yarn, npm, pnpm, or bun.",paraId:7,tocIndex:1},{value:"@metisjs/umi-plugins",paraId:8},{value:" is a plugin suite developed by Metis for the Umi framework. It allows users to enable and use ",paraId:8},{value:"metis-ui",paraId:8},{value:" and ",paraId:8},{value:"locale",paraId:8},{value:" (similar to ",paraId:8},{value:"@umijs/plugins/locale",paraId:8},{value:") with simple configuration.",paraId:8},{value:"After completing the installation, start the project with the following command:",paraId:9},{value:`$ pnpm run dev
umi dev
info  - Umi v4.0.46
    \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
    \u2551 App listening at:                                  \u2551
    \u2551  >   Local: http://localhost:8000                  \u2551
ready - \u2551  > Network: http://*********:8000                  \u2551
    \u2551                                                    \u2551
    \u2551 Now you can open browser with the above addresses\u2191 \u2551
    \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D
`,paraId:10},{value:"Click the URL in the terminal to open the browser. If successful, you will see ",paraId:11},{value:"Yay! Welcome to Umi!",paraId:11},{value:"Modify ",paraId:12},{value:".umirc.ts",paraId:12},{value:" as follows:",paraId:12},{value:`import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: 'index' },
    { path: '/docs', component: 'docs' },
  ],
  npmClient: 'pnpm',
  metisui: { theme: 'system' },
  plugins: ['@metisjs/umi-plugins/dist/metisui'],
});
`,paraId:13},{value:"metisui",paraId:14},{value:" supports all configurations of ",paraId:14},{value:"ConfigProvider",paraId:15},{value:".",paraId:14},{value:"Create a new ",paraId:16},{value:"tailwind.css",paraId:16},{value:" file in the root directory:",paraId:16},{value:`@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin 'metis-ui/plugin';
`,paraId:17},{value:"Modify ",paraId:18},{value:"src/pages/index.tsx",paraId:18},{value:":",paraId:18},{value:`import { Alert } from 'metis-ui';

export default function HomePage() {
  return (
    <div className="h-screen w-screen">
      <Alert type="info" banner message="Hello" description="Welcome to metis-ui" />
    </div>
  );
}
`,paraId:19},{value:"Now, you should see the Metis UI Alert component on the page. You can proceed with developing your application.",paraId:20},{value:"In ",paraId:21,tocIndex:2},{value:".umirc.ts",paraId:21,tocIndex:2},{value:", configure the global ",paraId:21,tocIndex:2},{value:"ConfigProvider",paraId:22,tocIndex:2},{value:" using ",paraId:21,tocIndex:2},{value:"metisui",paraId:21,tocIndex:2},{value:":",paraId:21,tocIndex:2},{value:`import { defineConfig } from 'umi';

export default defineConfig({
  // ...
  metisui: { theme: 'system', componentSize: 'small' },
  plugins: ['@metisjs/umi-plugins/dist/metisui'],
});
`,paraId:23,tocIndex:2},{value:"In ",paraId:24,tocIndex:3},{value:"src/app.ts(x)",paraId:24,tocIndex:3},{value:", modify the ConfigProvider values at runtime. For example, you can read the theme from localStorage:",paraId:24,tocIndex:3},{value:`import { RuntimeMetisUIConfig } from 'umi';

export const metisui: RuntimeMetisUIConfig = (memo) => {
  const theme = localStorage.getItem('theme');
  if (theme) {
    memo.theme = theme;
  }

  return memo;
};
`,paraId:25,tocIndex:3},{value:"Use the ",paraId:26,tocIndex:4},{value:"useMetisUIConfig",paraId:26,tocIndex:4},{value:" method to dynamically get and modify ConfigProvider configurations, such as changing the theme dynamically.",paraId:26,tocIndex:4},{value:"Create a new ",paraId:27,tocIndex:4},{value:"src/components/ThemeSwitch.tsx",paraId:27,tocIndex:4},{value:" component:",paraId:27,tocIndex:4},{value:`import type { FC } from 'react';
import { ComputerDesktopOutline, MoonSparklesOutline, SunOutline } from '@metisjs/icons';
import { Dropdown } from 'metis-ui';
import { MenuClickEventHandler } from 'metis-ui/es/menu/interface';
import { useMetisUIConfig } from 'umi';

export type ThemeName = 'system' | 'light' | 'dark';

const themes = [
  {
    name: 'light',
    icon: <SunOutline />,
    label: 'Light Mode',
  },
  {
    name: 'dark',
    icon: <MoonSparklesOutline />,
    label: 'Dark Mode',
  },
  {
    name: 'system',
    icon: <ComputerDesktopOutline />,
    label: 'Follow System',
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
`,paraId:28,tocIndex:4},{value:"Modify ",paraId:29,tocIndex:4},{value:"src/pages/index.tsx",paraId:29,tocIndex:4},{value:" again to include ",paraId:29,tocIndex:4},{value:"ThemeSwitch",paraId:29,tocIndex:4},{value:":",paraId:29,tocIndex:4},{value:`import { Alert } from 'metis-ui';
import ThemeSwitch from '@/components/ThemeSwitch';

export default function HomePage() {
  return (
    <div className="h-screen w-screen">
      <Alert type="info" banner message="Hello" description="Welcome to metis-ui" />
      <ThemeSwitch />
    </div>
  );
}
`,paraId:30,tocIndex:4},{value:"Now, you should see a theme switch icon on the page. Try switching between different themes.",paraId:31,tocIndex:4},{value:"If you need to enable internationalization in your application, replace the ",paraId:32,tocIndex:5},{value:"@umijs/plugins/dist/locale",paraId:32,tocIndex:5},{value:" plugin with ",paraId:32,tocIndex:5},{value:"@metisjs/umi-plugins/dist/locale",paraId:32,tocIndex:5},{value:". Refer to the ",paraId:32,tocIndex:5},{value:"documentation",paraId:32,tocIndex:5},{value:" for usage.",paraId:32,tocIndex:5},{value:`import { defineConfig } from 'umi';

export default defineConfig({
  // ...
  locale: { metisui: true, default: 'zh-CN' },
  plugins: [
  '@metisjs/umi-plugins/dist/metisui',
  '@metisjs/umi-plugins/dist/locale'
  ],
});
`,paraId:33,tocIndex:5},{value:"Now you can continue developing your application with other components. For additional development workflows, refer to ",paraId:34,tocIndex:5},{value:"UmiJS",paraId:34,tocIndex:5},{value:".",paraId:34,tocIndex:5},{value:"Translate by ChartGPT",paraId:35,tocIndex:5}]},9259:function(i,a,e){e.r(a),e.d(a,{texts:function(){return t}});const t=[{value:"Vite",paraId:0},{value:" is one of the best tools in the industry for developing React applications. This article will demonstrate how to use the ",paraId:0},{value:"metis-ui",paraId:0},{value:" components in a project created with Vite and customize Vite's configuration to meet various engineering needs.",paraId:0},{value:"Before getting started, you may need to install ",paraId:1,tocIndex:0},{value:"yarn",paraId:1,tocIndex:0},{value:", ",paraId:1,tocIndex:0},{value:"pnpm",paraId:1,tocIndex:0},{value:", or ",paraId:1,tocIndex:0},{value:"bun",paraId:1,tocIndex:0},{value:".",paraId:1,tocIndex:0},{value:"The tool will automatically scaffold a project and install the necessary dependencies for a React project. If you encounter network issues during this process, try configuring a proxy or using a different npm registry.",paraId:2},{value:"Next, navigate to the project directory, install dependencies, and start the development server.",paraId:3},{value:`$ cd metis-ui-demo
$ npm install
$ npm run dev
`,paraId:4},{value:"At this point, open your browser and visit ",paraId:5},{value:"http://localhost:5173/",paraId:5},{value:". If you see the ",paraId:5},{value:"Vite + React",paraId:5},{value:" interface, the setup is successful.",paraId:5},{value:"Install ",paraId:6,tocIndex:1},{value:"metis-ui",paraId:6,tocIndex:1},{value:", ",paraId:6,tocIndex:1},{value:"tailwindcss",paraId:6,tocIndex:1},{value:", and ",paraId:6,tocIndex:1},{value:"@tailwindcss/vite",paraId:6,tocIndex:1},{value:".",paraId:6,tocIndex:1},{value:"Add the ",paraId:7},{value:"@tailwindcss/vite",paraId:7},{value:" plugin to the Vite configuration.",paraId:7},{value:`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
  ],
});
`,paraId:8},{value:"Create a new ",paraId:9},{value:"tailwind.css",paraId:9},{value:" file in the root directory.",paraId:9},{value:`@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin 'metis-ui/plugin';
`,paraId:10},{value:"Modify ",paraId:11},{value:"index.html",paraId:11},{value:" to include the Tailwind CSS file.",paraId:11},{value:`<!doctype html>
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
`,paraId:12},{value:"Update ",paraId:13},{value:"src/App.ts",paraId:13},{value:" to include the ",paraId:13},{value:"metis-ui",paraId:13},{value:" Alert component.",paraId:13},{value:`import { Alert } from 'metis-ui';

const App = () => (
  <div className="h-screen w-screen">
    <Alert type="info" banner message="Hello" description="Welcome to metis-ui" />
  </div>
);

export default App;
`,paraId:14},{value:"Now, you should see the ",paraId:15},{value:"metis-ui",paraId:15},{value:" ",paraId:15},{value:"Alert",paraId:15},{value:" component displayed on the page. You can continue to use other components to develop your application. For additional development workflows, refer to ",paraId:15},{value:"Vite",paraId:15},{value:".",paraId:15},{value:"We have successfully set up the ",paraId:16},{value:"metis-ui",paraId:16},{value:" components. Start building your application now!",paraId:16},{value:"Translate by ChartGPT",paraId:17}]}}]);
