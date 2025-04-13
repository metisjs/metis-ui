"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[4782],{57279:function(M,_,e){e.r(_);var h=e(39546),l=e(75580),u=e(14974),i=e(74132),t=function(){return(0,i.jsx)(u.default,{semantics:[{name:"root"},{name:"clear"},{name:"selector",children:[{name:"search"},{name:"placeholder"},{name:"input"}]},{name:"popup"},{name:"option",children:[{name:"label"}],args:[{name:"active",type:"boolean"}]}],rootArgs:[{name:"open",type:"boolean"},{name:"disabled",type:"boolean"}],children:function(c){return(0,i.jsx)(l.Z,{allowClear:!0,options:[{value:"1"},{value:"11"},{value:"111"}],className:"w-72",placeholder:"input here",value:(c==null?void 0:c.path)==="selector_placeholder"?void 0:"1",getPopupContainer:function(o){return o.parentNode},open:!0})}})};_.default=t},34272:function(M,_,e){e.r(_);var h=e(48305),l=e.n(h),u=e(39546),i=e(6294),t=e(75580),n=e(74132),r=function(o){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1;return{value:o.repeat(a)}},c=function(){var o=(0,u.useState)([]),a=l()(o,2),m=a[0],O=a[1],d=function(s){return s?[r(s),r(s,2),r(s,3)]:[]};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.Z,{options:m,onSearch:function(s){return O(d(s))},placeholder:"UnClearable",allowClear:!0,className:"w-52"}),(0,n.jsx)("br",{}),(0,n.jsx)("br",{}),(0,n.jsx)(t.Z,{options:m,onSearch:function(s){return O(d(s))},placeholder:"Customized clear icon",allowClear:{clearIcon:(0,n.jsx)(i.XMarkOutline,{className:"size-4"})},className:"w-52"})]})};_.default=c},55817:function(M,_,e){e.r(_);var h=e(48305),l=e.n(h),u=e(39546),i=e(75580),t=e(74132),n=function(E){var o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1;return{value:E.repeat(o)}},r=function(){var E=(0,u.useState)(""),o=l()(E,2),a=o[0],m=o[1],O=(0,u.useState)([]),d=l()(O,2),p=d[0],s=d[1],P=(0,u.useState)([]),D=l()(P,2),A=D[0],f=D[1],S=function(v){return v?[n(v),n(v,2),n(v,3)]:[]},g=function(v){console.log("onSelect",v)},j=function(v){m(v)};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.Z,{options:p,style:{width:200},onSelect:g,onSearch:function(v){return s(S(v))},placeholder:"input here"}),(0,t.jsx)("br",{}),(0,t.jsx)("br",{}),(0,t.jsx)(i.Z,{value:a,options:A,style:{width:200},onSelect:g,onSearch:function(v){return f(S(v))},onChange:j,placeholder:"control mode"})]})};_.default=r},97738:function(M,_,e){e.r(_);var h=e(39546),l=e(6294),u=e(75580),i=e(43053),t=e(74132),n=function(a){return(0,t.jsxs)("span",{children:[a,(0,t.jsx)("a",{style:{float:"right"},href:"https://www.google.com/search?q=metis-ui",target:"_blank",rel:"noopener noreferrer",children:"more"})]})},r=function(a,m){return{value:a,label:(0,t.jsxs)("div",{className:"flex w-full justify-between",children:[a,(0,t.jsxs)("span",{children:[(0,t.jsx)(l.UserOutline,{})," ",m]})]})}},c=[{label:n("Libraries"),options:[r("Metis",1e4),r("Metis UI",10600)]},{label:n("Solutions"),options:[r("Metis UI FAQ",60100),r("Metis FAQ",30010)]},{label:n("Articles"),options:[r("Metis design language",1e5)]}],E=function(){return(0,t.jsx)(u.Z,{popupMatchSelectWidth:500,options:c,size:"large",className:{root:"w-64",popup:""},children:(0,t.jsx)(i.Z,{size:"large",placeholder:"input here"})})};_.default=E},22691:function(M,_,e){e.r(_);var h=e(48305),l=e.n(h),u=e(39546),i=e(43053),t=e(75580),n=e(74132),r=i.Z.TextArea,c=function(){var o=(0,u.useState)([]),a=l()(o,2),m=a[0],O=a[1],d=function(P){O(P?[{value:P},{value:P+P},{value:P+P+P}]:[])},p=function(P){console.log("onSelect",P)};return(0,n.jsx)(t.Z,{options:m,style:{width:200},onSelect:p,onSearch:d,children:(0,n.jsx)(r,{placeholder:"input here",className:"h-12"})})};_.default=c},12088:function(M,_,e){e.r(_);var h=e(39546),l=e(75580),u=e(74132),i=[{value:"Burns Bay Road"},{value:"Downing Street"},{value:"Wall Street"}],t=function(){return(0,u.jsx)(l.Z,{style:{width:200},options:i,placeholder:"try to type `b`",filterOption:function(c,E){return E.value.toUpperCase().indexOf(c.toUpperCase())!==-1}})};_.default=t},13838:function(M,_,e){e.r(_);var h=e(48305),l=e.n(h),u=e(39546),i=e(75580),t=e(74132),n=function(){var c=u.useState([]),E=l()(c,2),o=E[0],a=E[1],m=function(d){a(function(){return!d||d.includes("@")?[]:["gmail.com","163.com","qq.com"].map(function(p){return{label:"".concat(d,"@").concat(p),value:"".concat(d,"@").concat(p)}})})};return(0,t.jsx)(i.Z,{onSearch:m,placeholder:"input here",options:o,className:"w-52"})};_.default=n},57091:function(M,_,e){e.r(_);var h=e(39546),l=e(75580),u=e(15778),i=e(74132);_.default=function(){return(0,i.jsx)(l.Z,{placeholder:"input here",request:u.fetchDataWithPagination,fieldNames:{label:"name",value:"name"},optionFilterProp:"name",lazyLoad:!0,onChange:function(){var n;return(n=console).log.apply(n,arguments)},className:"w-[320px]"})}},15153:function(M,_,e){e.r(_);var h=e(39546),l=e(75580),u=e(15778),i=e(74132);_.default=function(){return(0,i.jsx)(l.Z,{placeholder:"input here",request:u.fetchData,fieldNames:{label:"name",value:"name"},optionFilterProp:"name",onChange:function(){var n;return(n=console).log.apply(n,arguments)},className:"w-[320px]"})}},48614:function(M,_,e){e.r(_);var h=e(48305),l=e.n(h),u=e(39546),i=e(65257),t=e(75580),n=e(74132),r=function(o){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1;return{value:o.repeat(a)}},c=function(){var o=(0,u.useState)([]),a=l()(o,2),m=a[0],O=a[1],d=(0,u.useState)([]),p=l()(d,2),s=p[0],P=p[1],D=function(f){return f?[r(f),r(f,2),r(f,3)]:[]};return(0,n.jsxs)(i.Z,{vertical:!0,block:!0,children:[(0,n.jsx)(t.Z,{options:m,onSearch:function(f){return O(D(f))},status:"error",style:{width:200}}),(0,n.jsx)(t.Z,{options:s,onSearch:function(f){return P(D(f))},status:"warning",style:{width:200}})]})};_.default=c},1806:function(M,_,e){e.r(_);var h=e(48305),l=e.n(h),u=e(39546),i=e(75580),t=e(43053),n=e(74132),r=function(a){var m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0;return Math.floor(Math.random()*(a-m+1))+m},c=function(a){return new Array(r(5)).join(".").split(".").map(function(m,O){var d="".concat(a).concat(O);return{value:d,label:(0,n.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[(0,n.jsxs)("span",{children:["Found ",a," on"," ",(0,n.jsx)("a",{href:"https://s.taobao.com/search?q=".concat(a),target:"_blank",rel:"noopener noreferrer",children:d})]}),(0,n.jsxs)("span",{children:[r(200,100)," results"]})]})}})},E=function(){var a=(0,u.useState)([]),m=l()(a,2),O=m[0],d=m[1],p=function(D){d(D?c(D):[])},s=function(D){console.log("onSelect",D)};return(0,n.jsx)(i.Z,{popupMatchSelectWidth:252,style:{width:300},options:O,onSelect:s,onSearch:p,size:"large",children:(0,n.jsx)(t.Z,{size:"large",placeholder:"input here"})})};_.default=E},15763:function(M,_,e){e.r(_);var h=e(48305),l=e.n(h),u=e(39546),i=e(65257),t=e(75580),n=e(74132),r=function(o){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1;return{value:o.repeat(a)}},c=function(){var o=(0,u.useState)([]),a=l()(o,2),m=a[0],O=a[1],d=function(s){return s?[r(s),r(s,2),r(s,3)]:[]};return(0,n.jsxs)(i.Z,{vertical:!0,size:12,children:[(0,n.jsx)(t.Z,{options:m,style:{width:200},placeholder:"Outlined",onSearch:function(s){return O(d(s))},onSelect:globalThis.console.log}),(0,n.jsx)(t.Z,{options:m,style:{width:200},placeholder:"Filled",onSearch:function(s){return O(d(s))},onSelect:globalThis.console.log,variant:"filled"}),(0,n.jsx)(t.Z,{options:m,style:{width:200},placeholder:"Borderless",onSearch:function(s){return O(d(s))},onSelect:globalThis.console.log,variant:"borderless"})]})};_.default=c}}]);
