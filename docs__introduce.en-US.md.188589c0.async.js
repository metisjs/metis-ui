"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[6245],{10821:function(B,f,e){e.r(f);var j=e(40204),v=e(67093),a=e(61565),O=e(54795),d=e(78872),p=e(68507),h=e(75151),D=e(73846),_=e(10006),x=e(18637),T=e(91512),E=e(59353),P=e(30158),w=e(39546),s=e(74132);function g(){var i=(0,E.useRouteMeta)(),u=i.texts;return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)("div",{className:"markdown",children:(0,s.jsxs)("h2",{id:"coming-soon",children:[(0,s.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#coming-soon",children:(0,s.jsx)("span",{className:"icon icon-link"})}),"Coming soon..."]})})})}function A(){return(0,s.jsx)(E.DumiPage,{children:(0,s.jsx)(w.Suspense,{fallback:(0,s.jsx)(P.Z,{}),children:(0,s.jsx)(g,{})})})}f.default=A},10006:function(B,f,e){var j=e(26068),v=e.n(j),a=e(48305),O=e.n(a),d=e(39546),p=e(59353),h=e(74132),D=function(x){var T=(0,p.useRouteMeta)(),E=T.frontmatter,P=(0,d.useCallback)(function(i,u){var n,r=[],m=u.filter(function(o){return!o.previewerProps.debug});if((n=i.demo)!==null&&n!==void 0&&n.cols&&i.demo.cols>1&&(typeof window=="undefined"||window.innerWidth>1536)){for(var t=0;t<m.length;t+=i.demo.cols)m.slice(t,t+i.demo.cols).forEach(function(o,c){var M;(M=r[c])!==null&&M!==void 0||(r[c]=[]),r[c].push(o)});return r}else r.push(m);return r},[]),w=(0,d.useState)(function(){return P(E,x.items)}),s=O()(w,2),g=s[0],A=s[1];return(0,d.useEffect)(function(){var i=function(){return A(P(E,x.items))};return window.addEventListener("resize",i),i(),function(){return window.removeEventListener("resize",i)}},[x.items,E.demo]),(0,h.jsx)("div",{className:"demo-grid my-6 flex gap-6",children:g.map(function(i,u){return(0,h.jsx)("section",{className:"flex w-0 flex-1 flex-col gap-6",children:i.map(function(n){return x.demoRender?x.demoRender(n):(0,h.jsx)(p.DumiDemo,v()({},n),n.demo.id)})},String(u))})})};f.Z=D},18637:function(B,f,e){e.d(f,{Z:function(){return A}});var j=e(48305),v=e.n(j),a=e(39546),O=e(50553),d=e(33977),p=e(6294),h=e(28753),D=e(98717),_=e(74132),x=p,T=function(u){var n=u.name,r=a.useState("idle"),m=v()(r,2),t=m[0],o=m[1],c=function(){t!=="copied"&&navigator.clipboard.writeText("<".concat(n," />")).then(function(){o("copied")})},M=function(){t==="idle"&&o("active")},C=function(){t==="active"&&o("idle")},b=function(y){["Enter"," ","ArrowUp","ArrowDown","Escape"].includes(y.key)&&y.preventDefault(),t==="active"&&y.key==="Escape"?o("idle"):t==="idle"&&["Enter"," ","ArrowDown"].includes(y.key)?o("active"):t==="active"&&["Enter"," "].includes(y.key)&&c()};return a.useEffect(function(){if(t==="copied"){var l=window.setTimeout(function(){o("idle")},1e3);return function(){window.clearTimeout(l)}}},[t]),(0,_.jsxs)("div",{onMouseEnter:M,onMouseLeave:C,children:[(0,_.jsxs)("div",{className:"relative h-[8.5rem]",children:[(0,_.jsx)("button",{type:"button",onKeyDown:b,onBlur:function(){window.setTimeout(function(){C()},0)},id:"".concat(n,"-btn"),"aria-label":n,"aria-haspopup":"true","aria-controls":n,"aria-expanded":t==="active",className:"text-text outline-border-secondary hover:text-primary absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center rounded-xl outline -outline-offset-1",onClick:c,children:(0,_.jsx)("span",{className:(0,h.clsx)("text-2xl transition-transform",t==="copied"?"-translate-y-3 duration-200 ease-out":"duration-500 ease-in-out"),children:a.createElement(x[n])})}),(0,_.jsx)(D.Z,{visible:t==="copied",enter:"transition-opacity duration-300 ease-out",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"transition-opacity duration-300 ease-out",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:function(y,I){var R=y.className,L=y.style;return(0,_.jsx)("p",{className:(0,h.clsx)("absolute inset-x-0 bottom-10 text-center text-[0.8125rem] leading-6 font-semibold text-violet-500",R),style:L,ref:I,children:"Copied!"})}})]}),(0,_.jsx)("div",{className:"text-text-secondary mt-3 truncate text-center text-[0.8125rem] leading-6",title:n,children:n.replace(/(Outline|Solid)$/,"")})]})},E=T,P=e(759),w=e.n(P),s=w()(Object.keys(p),function(i){return i.endsWith("Outline")?"Outline":"Solid"}),g=function(i){var u=i.type,n=i.query,r=s[u];if(n){var m=n.replace(new RegExp("^<([a-zA-Z]*)\\s/>$","gi"),function(t,o){return o}).replace(/(Solid|Outline)$/,"").toLowerCase();r=r.filter(function(t){return t.toLowerCase().includes(m)})}return n&&r.length===0?(0,_.jsx)("div",{className:"flex flex-col items-center py-12",children:(0,_.jsx)(d.Z,{})}):(0,_.jsx)("div",{className:"grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-x-6 gap-y-8 pb-16 pt-12 md:pt-11 sm:pt-10",children:r.map(function(t){return(0,_.jsx)(E,{name:t},t)})})};function A(){var i=(0,a.useRef)(null),u=(0,a.useState)(""),n=v()(u,2),r=n[0],m=n[1],t=(0,a.useState)("Outline"),o=v()(t,2),c=o[0],M=o[1];return(0,a.useEffect)(function(){function C(b){if(b.key==="k"&&(b.metaKey||b.ctrlKey)){var l;b.preventDefault(),(l=i.current)===null||l===void 0||l.focus()}}return window.addEventListener("keydown",C),function(){window.removeEventListener("keydown",C)}},[]),(0,_.jsxs)("main",{children:[(0,_.jsx)("div",{className:"pointer-events-none sticky top-[76px] z-50 -mb-12 overflow-hidden pb-12",children:(0,_.jsx)("div",{className:"relative",children:(0,_.jsx)("div",{className:"pointer-events-auto relative bg-white pb-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)] dark:bg-[#0a0e13]",children:(0,_.jsxs)("div",{className:"flex flex-row items-center sm:flex-col",children:[(0,_.jsxs)("div",{className:"relative flex-auto",children:[(0,_.jsx)("input",{ref:i,type:"search",value:r,onChange:function(b){return m(b.target.value)},"aria-label":"\u5728\u6B64\u641C\u7D22\u56FE\u6807\uFF0C\u70B9\u51FB\u56FE\u6807\u53EF\u590D\u5236\u4EE3\u7801",placeholder:"\u5728\u6B64\u641C\u7D22\u56FE\u6807\uFF0C\u70B9\u51FB\u56FE\u6807\u53EF\u590D\u5236\u4EE3\u7801",className:"block w-full appearance-none rounded-lg border-0 bg-transparent py-4 pr-4 pl-9 text-base text-slate-900 transition placeholder:text-slate-400 focus:ring-0 focus:outline-hidden dark:text-[#c6c9cd] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"}),(0,_.jsx)("svg",{viewBox:"0 0 20 20","aria-hidden":"true",className:"pointer-events-none absolute inset-y-0 left-0 h-full w-5 fill-slate-500 transition",children:(0,_.jsx)("path",{d:"M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"})})]}),(0,_.jsx)("div",{children:(0,_.jsx)(O.Z,{size:"large",options:["Outline","Solid"],value:c,onChange:M})})]})})})}),(0,_.jsx)("div",{className:"mx-auto max-w-7xl px-4",children:(0,_.jsx)(g,{type:c,query:r})})]})}},91512:function(B,f,e){var j=e(26068),v=e.n(j),a=e(39546),O=e(68507),d=e(74132),p=function(D){return(0,d.jsxs)("div",{className:"rounded-xl bg-gray-950 p-1 text-sm scheme-dark dark:bg-white/5 dark:inset-ring dark:inset-ring-white/10","data-prefers-color":"dark",children:[(0,d.jsx)("div",{className:"-mb-6 px-3 pt-0.5 pb-1.5 text-xs/5 text-gray-400 dark:text-white/50",children:D.lang}),(0,d.jsx)(O.Z,v()({},D))]})};f.Z=p}}]);
