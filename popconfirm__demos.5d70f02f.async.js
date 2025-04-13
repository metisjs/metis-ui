"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[8312],{22297:function(m,l,e){e.r(l);var c=e(39546),n=e(59353),s=e(89185),t=e(7602),i=e(14974),o=e(74132),r=function(){var a=(0,n.useLocale)(),d=a.id,h=d==="zh-CN"?"-cn":"";return(0,o.jsx)(i.default,{semantics:[{name:"root"},{name:"popover",link:"/components/popover".concat(h,"#semantic-dom")},{name:"icon"},{name:"title"},{name:"description"},{name:"actions"}],rootArgs:[{name:"open",type:"boolean"}],children:(0,o.jsx)(s.Z,{open:!0,title:"Delete the task",description:"Are you sure to delete this task?",getPopupContainer:function(P){return P.parentElement},children:(0,o.jsx)(t.Z,{danger:!0,children:"Delete"})})})};l.default=r},51290:function(m,l,e){e.r(l);var c=e(48305),n=e.n(c),s=e(39546),t=e(89185),i=e(7602),o=e(74132),r=function(){var a=(0,s.useState)(!1),d=n()(a,2),h=d[0],u=d[1],P=(0,s.useState)(!1),E=n()(P,2),M=E[0],O=E[1],f=function(){u(!0)},v=function(){O(!0),setTimeout(function(){u(!1),O(!1)},2e3)},C=function(){console.log("Clicked cancel button"),u(!1)};return(0,o.jsx)(t.Z,{title:"Title",description:"Open Popconfirm with async logic",open:h,onConfirm:v,okButtonProps:{loading:M},onCancel:C,children:(0,o.jsx)(i.Z,{type:"primary",onClick:f,children:"Open Popconfirm with async logic"})})};l.default=r},57088:function(m,l,e){e.r(l);var c=e(39546),n=e(25152),s=e(89185),t=e(7602),i=e(74132),o=function(d){console.log(d),n.ZP.success("Click on Yes")},r=function(d){console.log(d),n.ZP.error("Click on No")},_=function(){return(0,i.jsx)(s.Z,{title:"Delete the task",description:"Are you sure to delete this task?",onConfirm:o,onCancel:r,okText:"Yes",cancelText:"No",children:(0,i.jsx)(t.Z,{danger:!0,children:"Delete"})})};l.default=_},14114:function(m,l,e){e.r(l);var c=e(48305),n=e.n(c),s=e(39546),t=e(25152),i=e(89185),o=e(7602),r=e(26687),_=e(74132),a=function(){var h=(0,s.useState)(!1),u=n()(h,2),P=u[0],E=u[1],M=(0,s.useState)(!0),O=n()(M,2),f=O[0],v=O[1],C=function(p){v(p)},D=function(){E(!1),t.ZP.success("Next step.")},A=function(){E(!1),t.ZP.error("Click on cancel.")},T=function(p){if(!p){E(p);return}console.log(f),f?D():E(p)};return(0,_.jsxs)("div",{children:[(0,_.jsx)(i.Z,{title:"Delete the task",description:"Are you sure to delete this task?",open:P,onOpenChange:T,onConfirm:D,onCancel:A,okText:"Yes",cancelText:"No",children:(0,_.jsx)(o.Z,{danger:!0,children:"Delete a task"})}),(0,_.jsx)("br",{}),(0,_.jsx)("br",{}),"Whether directly execute\uFF1A",(0,_.jsx)(r.Z,{defaultChecked:!0,onChange:C})]})};l.default=a},65863:function(m,l,e){e.r(l);var c=e(39546),n=e(6294),s=e(89185),t=e(7602),i=e(74132),o=function(){return(0,i.jsx)(s.Z,{title:"Delete the task",description:"Are you sure to delete this task?",icon:(0,i.jsx)(n.QuestionMarkCircleOutline,{style:{color:"red"}}),children:(0,i.jsx)(t.Z,{danger:!0,children:"Delete"})})};l.default=o},90116:function(m,l,e){e.r(l);var c=e(39546),n=e(89185),s=e(7602),t=e(74132),i=function(){return(0,t.jsx)(n.Z,{title:"Delete the task",description:"Are you sure to delete this task?",okText:"Yes",cancelText:"No",children:(0,t.jsx)(s.Z,{danger:!0,children:"Delete"})})};l.default=i},3227:function(m,l,e){e.r(l);var c=e(39546),n=e(89185),s=e(7602),t=e(74132),i="Are you sure to delete this task?",o="Delete the task",r=70,_=function(){return(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{style:{marginLeft:r,whiteSpace:"nowrap"},children:[(0,t.jsx)(n.Z,{placement:"topLeft",title:i,description:o,children:(0,t.jsx)(s.Z,{className:"ml-1.5 w-[70px]",children:"TL"})}),(0,t.jsx)(n.Z,{placement:"top",title:i,description:o,children:(0,t.jsx)(s.Z,{className:"ml-1.5 w-[70px]",children:"Top"})}),(0,t.jsx)(n.Z,{placement:"topRight",title:i,description:o,children:(0,t.jsx)(s.Z,{className:"ml-1.5 w-[70px]",children:"TR"})})]}),(0,t.jsxs)("div",{style:{width:r,float:"left"},children:[(0,t.jsx)(n.Z,{placement:"leftTop",title:i,description:o,children:(0,t.jsx)(s.Z,{className:"mt-1.5 w-[70px]",children:"LT"})}),(0,t.jsx)(n.Z,{placement:"left",title:i,description:o,children:(0,t.jsx)(s.Z,{className:"mt-1.5 w-[70px]",children:"Left"})}),(0,t.jsx)(n.Z,{placement:"leftBottom",title:i,description:o,children:(0,t.jsx)(s.Z,{className:"mt-1.5 w-[70px]",children:"LB"})})]}),(0,t.jsxs)("div",{style:{width:r,marginLeft:r*4+24},children:[(0,t.jsx)(n.Z,{placement:"rightTop",title:i,description:o,children:(0,t.jsx)(s.Z,{className:"mt-1.5 w-[70px]",children:"RT"})}),(0,t.jsx)(n.Z,{placement:"right",title:i,description:o,children:(0,t.jsx)(s.Z,{className:"mt-1.5 w-[70px]",children:"Right"})}),(0,t.jsx)(n.Z,{placement:"rightBottom",title:i,description:o,children:(0,t.jsx)(s.Z,{className:"mt-1.5 w-[70px]",children:"RB"})})]}),(0,t.jsxs)("div",{style:{marginLeft:r,clear:"both",whiteSpace:"nowrap"},children:[(0,t.jsx)(n.Z,{placement:"bottomLeft",title:i,description:o,children:(0,t.jsx)(s.Z,{className:"ml-1.5 w-[70px]",children:"BL"})}),(0,t.jsx)(n.Z,{placement:"bottom",title:i,description:o,children:(0,t.jsx)(s.Z,{className:"ml-1.5 w-[70px]",children:"Bottom"})}),(0,t.jsx)(n.Z,{placement:"bottomRight",title:i,description:o,children:(0,t.jsx)(s.Z,{className:"ml-1.5 w-[70px]",children:"BR"})})]})]})};l.default=_},18470:function(m,l,e){e.r(l);var c=e(39546),n=e(89185),s=e(7602),t=e(74132),i=function(){var r=function(){return new Promise(function(a){setTimeout(function(){return a(null)},3e3)})};return(0,t.jsx)(n.Z,{title:"Title",description:"Open Popconfirm with Promise",onConfirm:r,onOpenChange:function(){return console.log("open change")},children:(0,t.jsx)(s.Z,{type:"primary",children:"Open Popconfirm with Promise"})})};l.default=i}}]);
