"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[6245],{50206:function(I,v,e){e.r(v);var D=e(47925),p=e(91017),m=e(6933),M=e(39962),f=e(59974),y=e(45238),h=e(91698),x=e(43787),R=e(10006),_=e(18637),A=e(91512),E=e(12095),j=e(30158),O=e(39546),r=e(74132);function P(){var o=(0,E.useRouteMeta)(),d=o.texts;return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)("div",{className:"markdown",children:(0,r.jsxs)("h2",{id:"coming-soon",children:[(0,r.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#coming-soon",children:(0,r.jsx)("span",{className:"icon icon-link"})}),"Coming soon..."]})})})}function g(){return(0,r.jsx)(E.DumiPage,{children:(0,r.jsx)(O.Suspense,{fallback:(0,r.jsx)(j.Z,{}),children:(0,r.jsx)(P,{})})})}v.default=g},10006:function(I,v,e){var D=e(26068),p=e.n(D),m=e(48305),M=e.n(m),f=e(39546),y=e(12095),h=e(74132),x=function(_){var A=(0,y.useRouteMeta)(),E=A.frontmatter,j=(0,f.useCallback)(function(o,d){var s,n=[],l=d.filter(function(t){return!t.previewerProps.debug});if((s=o.demo)!==null&&s!==void 0&&s.cols&&o.demo.cols>1&&(typeof window=="undefined"||window.innerWidth>1536)){for(var u=0;u<l.length;u+=o.demo.cols)l.slice(u,u+o.demo.cols).forEach(function(t,a){var b;(b=n[a])!==null&&b!==void 0||(n[a]=[]),n[a].push(t)});return n}else n.push(l);return n},[]),O=(0,f.useState)(function(){return j(E,_.items)}),r=M()(O,2),P=r[0],g=r[1];return(0,f.useEffect)(function(){var o=function(){return g(j(E,_.items))};return window.addEventListener("resize",o),o(),function(){return window.removeEventListener("resize",o)}},[_.items,E.demo]),(0,h.jsx)("div",{className:"demo-grid my-6 flex gap-6",children:P.map(function(o,d){return(0,h.jsx)("section",{className:"flex w-0 flex-1 flex-col gap-6",children:o.map(function(s){return _.demoRender?_.demoRender(s):(0,h.jsx)(y.DumiDemo,p()({},s),s.demo.id)})},String(d))})})};v.Z=x},18637:function(I,v,e){e.d(v,{Z:function(){return o}});var D=e(48305),p=e.n(D),m=e(39546),M=e(12095),f=e(50553),y=e(33977),h=e(6294),x=e(28753),R=e(98717),_=e(74132),A=h,E=function(s){var n=s.name,l=m.useState("idle"),u=p()(l,2),t=u[0],a=u[1],b=function(){t!=="copied"&&navigator.clipboard.writeText("<".concat(n," />")).then(function(){a("copied")})},T=function(){t==="idle"&&a("active")},C=function(){t==="active"&&a("idle")},L=function(i){["Enter"," ","ArrowUp","ArrowDown","Escape"].includes(i.key)&&i.preventDefault(),t==="active"&&i.key==="Escape"?a("idle"):t==="idle"&&["Enter"," ","ArrowDown"].includes(i.key)?a("active"):t==="active"&&["Enter"," "].includes(i.key)&&b()};return m.useEffect(function(){if(t==="copied"){var c=window.setTimeout(function(){a("idle")},1e3);return function(){window.clearTimeout(c)}}},[t]),(0,_.jsxs)("div",{onMouseEnter:T,onMouseLeave:C,children:[(0,_.jsxs)("div",{className:"relative h-[8.5rem]",children:[(0,_.jsx)("button",{type:"button",onKeyDown:L,onBlur:function(){window.setTimeout(function(){C()},0)},id:"".concat(n,"-btn"),"aria-label":n,"aria-haspopup":"true","aria-controls":n,"aria-expanded":t==="active",className:"text-text outline-border-secondary hover:text-primary absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center rounded-xl outline -outline-offset-1",onClick:b,children:(0,_.jsx)("span",{className:(0,x.clsx)("text-2xl transition-transform",t==="copied"?"-translate-y-3 duration-200 ease-out":"duration-500 ease-in-out"),children:m.createElement(A[n])})}),(0,_.jsx)(R.Z,{visible:t==="copied",enter:"transition-opacity duration-300 ease-out",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"transition-opacity duration-300 ease-out",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:function(i,w){var B=i.className,K=i.style;return(0,_.jsx)("p",{className:(0,x.clsx)("absolute inset-x-0 bottom-10 text-center text-[0.8125rem] leading-6 font-semibold text-violet-500",B),style:K,ref:w,children:"Copied!"})}})]}),(0,_.jsx)("div",{className:"text-text-secondary mt-3 truncate text-center text-[0.8125rem] leading-6",title:n,children:n.replace(/(Outline|Solid)$/,"")})]})},j=E,O=e(759),r=e.n(O),P=r()(Object.keys(h),function(d){return d.endsWith("Outline")?"Outline":"Solid"}),g=function(d){var s=d.type,n=d.query,l=P[s];if(n){var u=n.replace(new RegExp("^<([a-zA-Z]*)\\s/>$","gi"),function(t,a){return a}).replace(/(Solid|Outline)$/,"").toLowerCase();l=l.filter(function(t){return t.toLowerCase().includes(u)})}return n&&l.length===0?(0,_.jsx)("div",{className:"flex flex-col items-center py-12",children:(0,_.jsx)(y.Z,{})}):(0,_.jsx)("div",{className:"grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-x-6 gap-y-8 pb-16 pt-12 md:pt-11 sm:pt-10",children:l.map(function(t){return(0,_.jsx)(j,{name:t},t)})})};function o(){var d=(0,M.useIntl)(),s=d.formatMessage,n=(0,m.useRef)(null),l=(0,m.useState)(""),u=p()(l,2),t=u[0],a=u[1],b=(0,m.useState)("Outline"),T=p()(b,2),C=T[0],L=T[1];return(0,m.useEffect)(function(){function c(i){if(i.key==="k"&&(i.metaKey||i.ctrlKey)){var w;i.preventDefault(),(w=n.current)===null||w===void 0||w.focus()}}return window.addEventListener("keydown",c),function(){window.removeEventListener("keydown",c)}},[]),(0,_.jsxs)("main",{children:[(0,_.jsx)("div",{className:"pointer-events-none sticky top-14 z-50 overflow-hidden bg-white/50 pt-4 backdrop-blur dark:bg-gray-950/50",children:(0,_.jsx)("div",{className:"relative",children:(0,_.jsx)("div",{className:"border-border-secondary pointer-events-auto relative border-b pb-4",children:(0,_.jsxs)("div",{className:"flex flex-row items-center sm:flex-col",children:[(0,_.jsxs)("div",{className:"relative flex-auto",children:[(0,_.jsx)("input",{ref:n,type:"search",value:t,onChange:function(i){return a(i.target.value)},"aria-label":s({id:"app.docs.components.icon.search.placeholder"}),placeholder:s({id:"app.docs.components.icon.search.placeholder"}),className:"placeholder:text-text-quaternary text-text block w-full appearance-none rounded-lg border-0 bg-transparent py-4 pr-4 pl-9 text-base transition focus:ring-0 focus:outline-hidden [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"}),(0,_.jsx)("svg",{viewBox:"0 0 20 20","aria-hidden":"true",className:"pointer-events-none absolute inset-y-0 left-0 h-full w-5 fill-gray-600 transition dark:fill-gray-500",children:(0,_.jsx)("path",{d:"M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"})})]}),(0,_.jsx)("div",{children:(0,_.jsx)(f.Z,{size:"large",options:["Outline","Solid"],value:C,onChange:L})})]})})})}),(0,_.jsx)("div",{className:"mx-auto max-w-7xl px-4",children:(0,_.jsx)(g,{type:C,query:t})})]})}},91512:function(I,v,e){var D=e(26068),p=e.n(D),m=e(39546),M=e(45238),f=e(74132),y=function(x){return(0,f.jsxs)("div",{className:"rounded-xl bg-gray-950 p-1 text-sm scheme-dark dark:bg-white/5 dark:inset-ring dark:inset-ring-white/10","data-prefers-color":"dark",children:[(0,f.jsx)("div",{className:"-mb-6 px-3 pt-0.5 pb-1.5 text-xs/5 text-gray-400 dark:text-white/50",children:x.lang}),(0,f.jsx)(M.Z,p()({},x))]})};v.Z=y}}]);
