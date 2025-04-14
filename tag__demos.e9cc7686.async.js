"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[8582],{64649:function(v,t,e){e.r(t);var D=e(39546),r=e(6294),i=e(62976),s=e(14974),n=e(74132),_=function(){return(0,n.jsx)(s.default,{semantics:[{name:"root"},{name:"icon"},{name:"close"}],children:(0,n.jsx)(i.Z,{icon:(0,n.jsx)(r.AcademicCapOutline,{}),closable:!0,children:"AcademicCap"})})};t.default=_},19986:function(v,t,e){e.r(t);var D=e(39546),r=e(62976),i=e(14974),s=e(74132),n=function(){return(0,s.jsx)(i.default,{semantics:[{name:"root"}],rootArgs:[{name:"checked",type:"boolean"}],children:(0,s.jsx)(r.Z.CheckableTag,{checked:!0,children:"CheckableTag"})})};t.default=n},96699:function(v,t,e){e.r(t);var D=e(39546),r=e(6294),i=e(65257),s=e(62976),n=e(74132),_=function(c){console.log(c)},l=function(c){c.preventDefault(),console.log("Clicked! But prevent default.")},u=function(){return(0,n.jsxs)(i.Z,{wrap:!0,children:[(0,n.jsx)(s.Z,{children:"Tag 1"}),(0,n.jsx)(s.Z,{children:(0,n.jsx)("a",{href:"https://github.com/metis-oa/metis-ui",children:"Link"})}),(0,n.jsx)(s.Z,{closable:!0,onClose:l,children:"Prevent Default"}),(0,n.jsx)(s.Z,{closable:{closeIcon:(0,n.jsx)(r.XCircleOutline,{})},onClose:_,children:"Tag 2"})]})};t.default=u},49411:function(v,t,e){e.r(t);var D=e(39546),r=e(65257),i=e(62976),s=e(45043),n=e(74132),_=function(){return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(r.Z,{wrap:!0,children:[(0,n.jsx)(i.Z,{bordered:!1,children:"Tag 1"}),(0,n.jsx)(i.Z,{bordered:!1,children:"Tag 2"}),(0,n.jsx)(i.Z,{bordered:!1,closable:!0,children:"Tag 3"}),(0,n.jsx)(i.Z,{bordered:!1,closable:!0,children:"Tag 4"})]}),(0,n.jsx)(s.Z,{}),(0,n.jsxs)(r.Z,{wrap:!0,children:[(0,n.jsx)(i.Z,{bordered:!1,color:"processing",children:"processing"}),(0,n.jsx)(i.Z,{bordered:!1,color:"success",children:"success"}),(0,n.jsx)(i.Z,{bordered:!1,color:"error",children:"error"}),(0,n.jsx)(i.Z,{bordered:!1,color:"warning",children:"warning"})]})]})};t.default=_},70783:function(v,t,e){e.r(t);var D=e(15558),r=e.n(D),i=e(48305),s=e.n(i),n=e(39546),_=e(62976),l=e(65257),u=e(74132),d=_.Z.CheckableTag,c=["Movies","Books","Music","Sports"],E=function(){var B=(0,n.useState)(["Books"]),C=s()(B,2),O=C[0],a=C[1],M=function(h,m){var f=m?[].concat(r()(O),[h]):O.filter(function(j){return j!==h});console.log("You are interested in: ",f),a(f)};return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)("span",{style:{marginRight:8},children:"Categories:"}),(0,u.jsx)(l.Z,{wrap:!0,children:c.map(function(P){return(0,u.jsx)(d,{checked:O.includes(P),onChange:function(m){return M(P,m)},children:P},P)})})]})};t.default=E},81647:function(v,t,e){e.r(t);var D=e(39546),r=e(45043),i=e(65257),s=e(62976),n=e(74132),_=["blue","purple","cyan","green","pink","red","orange","yellow","lime","amber","emerald","teal","sky","indigo"],l=function(){return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.Z,{orientation:"left",children:"Presets"}),(0,n.jsx)(i.Z,{wrap:!0,children:_.map(function(d){return(0,n.jsx)(s.Z,{color:d,children:d},d)})}),(0,n.jsx)(r.Z,{orientation:"left",children:"Custom"}),(0,n.jsxs)(i.Z,{wrap:!0,children:[(0,n.jsx)(s.Z,{color:"#f50",children:"#f50"}),(0,n.jsx)(s.Z,{color:"#2db7f5",children:"#2db7f5"}),(0,n.jsx)(s.Z,{color:"#87d068",children:"#87d068"}),(0,n.jsx)(s.Z,{color:"#108ee9",children:"#108ee9"})]})]})};t.default=l},95715:function(v,t,e){e.r(t);var D=e(15558),r=e.n(D),i=e(48305),s=e.n(i),n=e(39546),_=e(6294),l=e(65257),u=e(43053),d=e(62976),c=e(65881),E=e(74132),p=function(){var C=(0,n.useState)(["Unremovable","Tag 2","Tag 3"]),O=s()(C,2),a=O[0],M=O[1],P=(0,n.useState)(!1),h=s()(P,2),m=h[0],f=h[1],j=(0,n.useState)(""),A=s()(j,2),T=A[0],R=A[1],L=(0,n.useState)(-1),I=s()(L,2),Z=I[0],S=I[1],X=(0,n.useState)(""),b=s()(X,2),U=b[0],K=b[1],y=(0,n.useRef)(null),N=(0,n.useRef)(null);(0,n.useEffect)(function(){if(m){var o;(o=y.current)===null||o===void 0||o.focus()}},[m]),(0,n.useEffect)(function(){var o;(o=N.current)===null||o===void 0||o.focus()},[U]);var Y=function(x){var g=a.filter(function(W){return W!==x});console.log(g),M(g)},G=function(){f(!0)},V=function(){T&&a.indexOf(T)===-1&&M([].concat(r()(a),[T])),f(!1),R("")},F=function(){var x=r()(a);x[Z]=U,M(x),S(-1),K("")},z={width:64,height:24,marginInlineEnd:8};return(0,E.jsx)(l.Z,{wrap:!0,children:(0,E.jsxs)(l.Z,{wrap:!0,children:[a.map(function(o,x){if(Z===x)return(0,E.jsx)(u.Z,{ref:N,size:"small",className:{input:"rounded-sm text-xs shadow-xs"},style:z,value:U,onChange:K,onBlur:F,onPressEnter:F},o);var g=o.length>20,W=(0,E.jsx)(d.Z,{closable:x!==0,style:{userSelect:"none"},onClose:function(){return Y(o)},children:(0,E.jsx)("span",{onDoubleClick:function(J){x!==0&&(S(x),K(o),J.preventDefault())},children:g?"".concat(o.slice(0,20),"..."):o})},o);return g?(0,E.jsx)(c.default,{title:o,children:W},o):W}),m?(0,E.jsx)(u.Z,{ref:y,type:"text",size:"small",className:{input:"rounded-sm text-xs shadow-xs"},style:z,value:T,onChange:R,onBlur:V,onPressEnter:V}):(0,E.jsxs)(d.Z,{className:"bg-container cursor-pointer outline-dashed",onClick:G,children:[(0,E.jsx)(_.PlusOutline,{})," New Tag"]})]})})};t.default=p},98645:function(v,t,e){e.r(t);var D=e(48305),r=e.n(D),i=e(26068),s=e.n(i),n=e(39546),_=e(88457),l=e(84013),u=e(62976),d=e(65257),c=e(74132),E=function(C){var O=C.tag,a=(0,l.useSortable)({id:O.id}),M=a.listeners,P=a.setNodeRef,h=a.transform,m=a.transition,f=a.isDragging,j={cursor:"move",transition:"unset"},A=h?s()(s()({},j),{},{transform:"translate3d(".concat(h.x,"px, ").concat(h.y,"px, 0)"),transition:f?"unset":m}):j;return(0,c.jsx)(u.Z,s()(s()({style:A,ref:P},M),{},{children:O.text}))},p=function(){var C=(0,n.useState)([{id:1,text:"Tag 1"},{id:2,text:"Tag 2"},{id:3,text:"Tag 3"}]),O=r()(C,2),a=O[0],M=O[1],P=(0,_.useSensors)((0,_.useSensor)(_.PointerSensor)),h=function(f){var j=f.active,A=f.over;A&&j.id!==A.id&&M(function(T){var R=T.findIndex(function(I){return I.id===j.id}),L=T.findIndex(function(I){return I.id===A.id});return(0,l.arrayMove)(T,R,L)})};return(0,c.jsx)(_.DndContext,{sensors:P,onDragEnd:h,collisionDetection:_.closestCenter,children:(0,c.jsx)(l.SortableContext,{items:a,strategy:l.horizontalListSortingStrategy,children:(0,c.jsx)(d.Z,{wrap:!0,children:a.map(function(m){return(0,c.jsx)(E,{tag:m},m.id)})})})})};t.default=p},75385:function(v,t,e){e.r(t);var D=e(39546),r=e(6294),i=e(65257),s=e(62976),n=e(74132),_=function(){return(0,n.jsxs)(i.Z,{wrap:!0,children:[(0,n.jsx)(s.Z,{icon:(0,n.jsx)(r.AcademicCapOutline,{}),color:"#55acee",children:"AcademicCap"}),(0,n.jsx)(s.Z,{icon:(0,n.jsx)(r.BuildingOffice2Outline,{}),color:"#cd201f",children:"BuildingOffice"}),(0,n.jsx)(s.Z,{icon:(0,n.jsx)(r.DeviceTabletOutline,{}),color:"#3b5999",children:"DeviceTablet"}),(0,n.jsx)(s.Z,{icon:(0,n.jsx)(r.ShareOutline,{}),color:"#55acee",children:"Share"})]})};t.default=_},59792:function(v,t,e){e.r(t);var D=e(39546),r=e(6294),i=e(45043),s=e(65257),n=e(62976),_=e(74132),l=function(){return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(i.Z,{orientation:"left",children:"Without icon"}),(0,_.jsxs)(s.Z,{wrap:!0,children:[(0,_.jsx)(n.Z,{color:"success",children:"Success"}),(0,_.jsx)(n.Z,{color:"processing",children:"Processing"}),(0,_.jsx)(n.Z,{color:"error",children:"Error"}),(0,_.jsx)(n.Z,{color:"warning",children:"Warning"}),(0,_.jsx)(n.Z,{color:"default",children:"Default"})]}),(0,_.jsx)(i.Z,{orientation:"left",children:"With icon"}),(0,_.jsxs)(s.Z,{wrap:!0,children:[(0,_.jsx)(n.Z,{icon:(0,_.jsx)(r.CheckCircleOutline,{}),color:"success",children:"Success"}),(0,_.jsx)(n.Z,{icon:(0,_.jsx)(r.ArrowPathOutline,{className:"animate-spin"}),color:"processing",children:"Processing"}),(0,_.jsx)(n.Z,{icon:(0,_.jsx)(r.XCircleOutline,{}),color:"error",children:"Error"}),(0,_.jsx)(n.Z,{icon:(0,_.jsx)(r.ExclamationCircleOutline,{}),color:"warning",children:"Warning"}),(0,_.jsx)(n.Z,{icon:(0,_.jsx)(r.ClockOutline,{}),color:"default",children:"Waiting"}),(0,_.jsx)(n.Z,{icon:(0,_.jsx)(r.MinusCircleOutline,{}),color:"default",children:"Stop"})]}),(0,_.jsx)(i.Z,{orientation:"left",children:"Closable"}),(0,_.jsxs)(s.Z,{wrap:!0,children:[(0,_.jsx)(n.Z,{color:"success",closable:!0,children:"Success"}),(0,_.jsx)(n.Z,{color:"processing",closable:!0,children:"Processing"}),(0,_.jsx)(n.Z,{color:"error",closable:!0,children:"Error"}),(0,_.jsx)(n.Z,{color:"warning",closable:!0,children:"Warning"}),(0,_.jsx)(n.Z,{color:"default",closable:!0,children:"Default"})]})]})};t.default=l}}]);
