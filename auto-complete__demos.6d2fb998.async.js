"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[4782],{66320:function(M,_,e){e.r(_);var p=e(39546),l=e(75580),u=e(14974),i=e(74132),t=function(){return(0,i.jsx)(u.default,{semantics:[{name:"root"},{name:"clear"},{name:"selector",children:[{name:"search"},{name:"placeholder"},{name:"input"}]},{name:"popup"},{name:"option",children:[{name:"label"}],args:[{name:"active",type:"boolean"}]}],rootArgs:[{name:"open",type:"boolean"},{name:"disabled",type:"boolean"}],children:function(d){return(0,i.jsx)(l.Z,{allowClear:!0,options:[{value:"1"},{value:"11"},{value:"111"}],className:"w-72",placeholder:"input here",value:(d==null?void 0:d.path)==="selector_placeholder"?void 0:"1",getPopupContainer:function(o){return o.parentNode},open:!0})}})};_.default=t},43373:function(M,_,e){e.r(_);var p=e(48305),l=e.n(p),u=e(39546),i=e(6294),t=e(75580),n=e(74132),r=function(o){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1;return{value:o.repeat(a)}},d=function(){var o=(0,u.useState)([]),a=l()(o,2),m=a[0],h=a[1],c=function(s){return s?[r(s),r(s,2),r(s,3)]:[]};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.Z,{options:m,onSearch:function(s){return h(c(s))},placeholder:"UnClearable",allowClear:!0,className:"w-52"}),(0,n.jsx)("br",{}),(0,n.jsx)("br",{}),(0,n.jsx)(t.Z,{options:m,onSearch:function(s){return h(c(s))},placeholder:"Customized clear icon",allowClear:{clearIcon:(0,n.jsx)(i.XMarkOutline,{className:"size-4"})},className:"w-52"})]})};_.default=d},99931:function(M,_,e){e.r(_);var p=e(48305),l=e.n(p),u=e(39546),i=e(75580),t=e(74132),n=function(E){var o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1;return{value:E.repeat(o)}},r=function(){var E=(0,u.useState)(""),o=l()(E,2),a=o[0],m=o[1],h=(0,u.useState)([]),c=l()(h,2),O=c[0],s=c[1],P=(0,u.useState)([]),D=l()(P,2),A=D[0],f=D[1],C=function(v){return v?[n(v),n(v,2),n(v,3)]:[]},g=function(v){console.log("onSelect",v)},j=function(v){m(v)};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.Z,{options:O,className:"w-50",onSelect:g,onSearch:function(v){return s(C(v))},placeholder:"input here"}),(0,t.jsx)("br",{}),(0,t.jsx)("br",{}),(0,t.jsx)(i.Z,{value:a,options:A,className:"w-50",onSelect:g,onSearch:function(v){return f(C(v))},onChange:j,placeholder:"control mode"})]})};_.default=r},34876:function(M,_,e){e.r(_);var p=e(39546),l=e(6294),u=e(75580),i=e(43053),t=e(74132),n=function(a){return(0,t.jsxs)("span",{children:[a,(0,t.jsx)("a",{className:"float-right",href:"https://www.google.com/search?q=metis-ui",target:"_blank",rel:"noopener noreferrer",children:"more"})]})},r=function(a,m){return{value:a,label:(0,t.jsxs)("div",{className:"flex w-full justify-between",children:[a,(0,t.jsxs)("span",{children:[(0,t.jsx)(l.UserOutline,{})," ",m]})]})}},d=[{label:n("Libraries"),options:[r("Metis",1e4),r("Metis UI",10600)]},{label:n("Solutions"),options:[r("Metis UI FAQ",60100),r("Metis FAQ",30010)]},{label:n("Articles"),options:[r("Metis design language",1e5)]}],E=function(){return(0,t.jsx)(u.Z,{popupMatchSelectWidth:500,options:d,size:"large",className:{root:"w-64",popup:""},children:(0,t.jsx)(i.Z,{size:"large",placeholder:"input here"})})};_.default=E},93442:function(M,_,e){e.r(_);var p=e(48305),l=e.n(p),u=e(39546),i=e(43053),t=e(75580),n=e(74132),r=i.Z.TextArea,d=function(){var o=(0,u.useState)([]),a=l()(o,2),m=a[0],h=a[1],c=function(P){h(P?[{value:P},{value:P+P},{value:P+P+P}]:[])},O=function(P){console.log("onSelect",P)};return(0,n.jsx)(t.Z,{options:m,className:"w-50",onSelect:O,onSearch:c,children:(0,n.jsx)(r,{placeholder:"input here",className:"h-12"})})};_.default=d},9733:function(M,_,e){e.r(_);var p=e(39546),l=e(75580),u=e(74132),i=[{value:"Burns Bay Road"},{value:"Downing Street"},{value:"Wall Street"}],t=function(){return(0,u.jsx)(l.Z,{className:"w-50",options:i,placeholder:"try to type `b`",filterOption:function(d,E){return E.value.toUpperCase().indexOf(d.toUpperCase())!==-1}})};_.default=t},43561:function(M,_,e){e.r(_);var p=e(48305),l=e.n(p),u=e(39546),i=e(75580),t=e(74132),n=function(){var d=u.useState([]),E=l()(d,2),o=E[0],a=E[1],m=function(c){a(function(){return!c||c.includes("@")?[]:["gmail.com","163.com","qq.com"].map(function(O){return{label:"".concat(c,"@").concat(O),value:"".concat(c,"@").concat(O)}})})};return(0,t.jsx)(i.Z,{onSearch:m,placeholder:"input here",options:o,className:"w-52"})};_.default=n},92301:function(M,_,e){e.r(_);var p=e(39546),l=e(75580),u=e(15778),i=e(74132);_.default=function(){return(0,i.jsx)(l.Z,{placeholder:"input here",request:u.fetchDataWithPagination,fieldNames:{label:"name",value:"name"},optionFilterProp:"name",lazyLoad:!0,onChange:function(){var n;return(n=console).log.apply(n,arguments)},className:"w-[320px]"})}},55217:function(M,_,e){e.r(_);var p=e(39546),l=e(75580),u=e(15778),i=e(74132);_.default=function(){return(0,i.jsx)(l.Z,{placeholder:"input here",request:u.fetchData,fieldNames:{label:"name",value:"name"},optionFilterProp:"name",onChange:function(){var n;return(n=console).log.apply(n,arguments)},className:"w-[320px]"})}},79570:function(M,_,e){e.r(_);var p=e(48305),l=e.n(p),u=e(39546),i=e(65257),t=e(75580),n=e(74132),r=function(o){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1;return{value:o.repeat(a)}},d=function(){var o=(0,u.useState)([]),a=l()(o,2),m=a[0],h=a[1],c=(0,u.useState)([]),O=l()(c,2),s=O[0],P=O[1],D=function(f){return f?[r(f),r(f,2),r(f,3)]:[]};return(0,n.jsxs)(i.Z,{vertical:!0,block:!0,children:[(0,n.jsx)(t.Z,{options:m,onSearch:function(f){return h(D(f))},status:"error",className:"w-50"}),(0,n.jsx)(t.Z,{options:s,onSearch:function(f){return P(D(f))},status:"warning",className:"w-50"})]})};_.default=d},44917:function(M,_,e){e.r(_);var p=e(48305),l=e.n(p),u=e(39546),i=e(75580),t=e(43053),n=e(74132),r=function(a){var m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0;return Math.floor(Math.random()*(a-m+1))+m},d=function(a){return new Array(r(5)).join(".").split(".").map(function(m,h){var c="".concat(a).concat(h);return{value:c,label:(0,n.jsxs)("div",{className:"flex justify-between",children:[(0,n.jsxs)("span",{children:["Found ",a," on"," ",(0,n.jsx)("a",{href:"https://s.taobao.com/search?q=".concat(a),target:"_blank",rel:"noopener noreferrer",children:c})]}),(0,n.jsxs)("span",{children:[r(200,100)," results"]})]})}})},E=function(){var a=(0,u.useState)([]),m=l()(a,2),h=m[0],c=m[1],O=function(D){c(D?d(D):[])},s=function(D){console.log("onSelect",D)};return(0,n.jsx)(i.Z,{popupMatchSelectWidth:252,className:"w-75",options:h,onSelect:s,onSearch:O,size:"large",children:(0,n.jsx)(t.Z,{size:"large",placeholder:"input here"})})};_.default=E},9171:function(M,_,e){e.r(_);var p=e(48305),l=e.n(p),u=e(39546),i=e(65257),t=e(75580),n=e(74132),r=function(o){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1;return{value:o.repeat(a)}},d=function(){var o=(0,u.useState)([]),a=l()(o,2),m=a[0],h=a[1],c=function(s){return s?[r(s),r(s,2),r(s,3)]:[]};return(0,n.jsxs)(i.Z,{vertical:!0,size:12,children:[(0,n.jsx)(t.Z,{options:m,className:"w-50",placeholder:"Outlined",onSearch:function(s){return h(c(s))},onSelect:globalThis.console.log}),(0,n.jsx)(t.Z,{options:m,className:"w-50",placeholder:"Filled",onSearch:function(s){return h(c(s))},onSelect:globalThis.console.log,variant:"filled"}),(0,n.jsx)(t.Z,{options:m,className:"w-50",placeholder:"Borderless",onSearch:function(s){return h(c(s))},onSelect:globalThis.console.log,variant:"borderless"})]})};_.default=d}}]);
