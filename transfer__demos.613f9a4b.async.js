"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[2893],{91946:function(W,a,e){e.r(a);var P=e(75271),c=e(79786),u=e(7895),E=e(14974),f=e(52676),l=Array.from({length:4}).map(function(h,s){return{key:s.toString(),title:"content".concat(s+1),description:"description of content".concat(s+1)}}),C=l.filter(function(h){return Number(h.key)>2}).map(function(h){return h.key}),M=function(){var s=(0,c.useLocale)(),i=s.id,d=i==="zh-CN"?"-cn":"";return(0,f.jsx)(E.default,{semantics:[{name:"root"},{name:"list"},{name:"header"},{name:"title"},{name:"body"},{name:"search",link:"/components/input".concat(d,"#semantic-dom")},{name:"operation"},{name:"item"},{name:"footer"}],rootArgs:[{name:"disabled",type:"boolean"}],children:(0,f.jsx)(u.Z,{showSearch:!0,dataSource:l,targetKeys:C,titles:["Source","Target"],render:function(O){return O.title},footer:function(){return"Footer"}})})};a.default=M},38312:function(W,a,e){e.r(a);var P=e(48305),c=e.n(P),u=e(75271),E=e(7602),f=e(7895),l=e(52676),C=function(){var h=(0,u.useState)([]),s=c()(h,2),i=s[0],d=s[1],o=(0,u.useState)([]),O=c()(o,2),A=O[0],g=O[1],p=function(){for(var r=[],t=[],_=0;_<20;_++){var n={key:_.toString(),title:"content".concat(_+1),description:"description of content".concat(_+1),chosen:_%2===0};n.chosen&&r.push(n.key),t.push(n)}d(t),g(r)};(0,u.useEffect)(function(){p()},[]);var y=function(r){g(r)},S=function(r,t){return(t==null?void 0:t.direction)==="left"?(0,l.jsx)(E.Z,{size:"small",style:{display:"flex",margin:8,marginInlineEnd:"auto"},onClick:p,children:"Left button reload"}):(0,l.jsx)(E.Z,{size:"small",style:{display:"flex",margin:8,marginInlineStart:"auto"},onClick:p,children:"Right button reload"})};return(0,l.jsx)(f.Z,{dataSource:i,showSearch:!0,listStyle:{width:250,height:300},operations:["to right","to left"],targetKeys:A,onChange:y,render:function(r){return"".concat(r.title,"-").concat(r.description)},footer:S})};a.default=C},8901:function(W,a,e){e.r(a);var P=e(15558),c=e.n(P),u=e(48305),E=e.n(u),f=e(75271),l=e(7895),C=e(52676),M=Array.from({length:20}).map(function(i,d){return{key:d.toString(),title:"content".concat(d+1),description:"description of content".concat(d+1)}}),h=M.filter(function(i){return Number(i.key)>10}).map(function(i){return i.key}),s=function(){var d=(0,f.useState)(h),o=E()(d,2),O=o[0],A=o[1],g=(0,f.useState)([]),p=E()(g,2),y=p[0],S=p[1],v=function(n,m,T){console.log("targetKeys:",n),console.log("direction:",m),console.log("moveKeys:",T),A(n)},r=function(n,m){console.log("sourceSelectedKeys:",n),console.log("targetSelectedKeys:",m),S([].concat(c()(n),c()(m)))},t=function(n,m){console.log("direction:",n),console.log("values:",m)};return(0,C.jsx)(l.Z,{dataSource:M,titles:["Source","Target"],targetKeys:O,selectedKeys:y,onChange:v,onSelectChange:r,onScroll:t,render:function(n){return n.title}})};a.default=s},93938:function(W,a,e){e.r(a);var P=e(48305),c=e.n(P),u=e(75271),E=e(7895),f=e(52676),l=function(){var M=(0,u.useState)([]),h=c()(M,2),s=h[0],i=h[1],d=(0,u.useState)([]),o=c()(d,2),O=o[0],A=o[1],g=function(){for(var v=[],r=[],t=0;t<20;t++){var _={key:t.toString(),title:"content".concat(t+1),description:"description of content".concat(t+1),chosen:t%2===0};_.chosen&&v.push(_.key),r.push(_)}i(r),A(v)};(0,u.useEffect)(function(){g()},[]);var p=function(v,r,t){console.log(v,r,t),A(v)},y=function(v){var r=(0,f.jsxs)("span",{className:"custom-item",children:[v.title," - ",v.description]});return{label:r,value:v.title}};return(0,f.jsx)(E.Z,{dataSource:s,listStyle:{width:300,height:300},targetKeys:O,onChange:p,render:y})};a.default=l},47796:function(W,a,e){e.r(a);var P=e(48305),c=e.n(P),u=e(75271),E=e(7895),f=e(52676),l=Array.from({length:10}).map(function(s,i){return{key:i.toString(),title:"content".concat(i+1),description:"description of content".concat(i+1)}}),C=l.filter(function(s){return Number(s.key)%3>1}).map(function(s){return s.key}),M=["Select All",function(s){var i=s.selectedCount,d=s.totalCount;return"".concat(i,"/").concat(d)}],h=function(){var i=(0,u.useState)(C),d=c()(i,2),o=d[0],O=d[1];return(0,f.jsx)(E.Z,{dataSource:l,targetKeys:o,onChange:O,render:function(g){return g.title},selectAllLabels:M})};a.default=h},87076:function(W,a,e){e.r(a);var P=e(48305),c=e.n(P),u=e(75271),E=e(7895),f=e(26687),l=e(52676),C=function(){var h=(0,u.useState)(!1),s=c()(h,2),i=s[0],d=s[1],o=(0,u.useState)([]),O=c()(o,2),A=O[0],g=O[1],p=(0,u.useState)([]),y=c()(p,2),S=y[0],v=y[1];(0,u.useEffect)(function(){for(var t=[],_=[],n=0;n<2e3;n++){var m={key:n.toString(),title:"content".concat(n+1),description:"description of content".concat(n+1),chosen:n%2===0};m.chosen&&t.push(m.key),_.push(m)}v(t),g(_)},[]);var r=function(_,n,m){console.log(_,n,m),v(_)};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(E.Z,{dataSource:A,targetKeys:S,onChange:r,render:function(_){return _.title},oneWay:i,pagination:!0}),(0,l.jsx)("br",{}),(0,l.jsx)(f.Z,{unCheckedChildren:"one way",checkedChildren:"one way",checked:i,onChange:d})]})};a.default=C},52744:function(W,a,e){e.r(a);var P=e(15558),c=e.n(P),u=e(48305),E=e.n(u),f=e(75271),l=e(7895),C=e(26687),M=e(52676),h=Array.from({length:20}).map(function(d,o){return{key:o.toString(),title:"content".concat(o+1),description:"description of content".concat(o+1),disabled:o%3<1}}),s=h.filter(function(d){return Number(d.key)%3>1}).map(function(d){return d.key}),i=function(){var o=(0,f.useState)(s),O=E()(o,2),A=O[0],g=O[1],p=(0,f.useState)([]),y=E()(p,2),S=y[0],v=y[1],r=(0,f.useState)(!1),t=E()(r,2),_=t[0],n=t[1],m=function(D,I,R){g(D),console.log("targetKeys: ",D),console.log("direction: ",I),console.log("moveKeys: ",R)},T=function(D,I){v([].concat(c()(D),c()(I))),console.log("sourceSelectedKeys: ",D),console.log("targetSelectedKeys: ",I)},K=function(D,I){console.log("direction:",D),console.log("values:",I)},L=function(D){n(D)};return(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(l.Z,{dataSource:h,titles:["Source","Target"],targetKeys:A,selectedKeys:S,onChange:m,onSelectChange:T,onScroll:K,render:function(D){return D.title},disabled:_,oneWay:!0,style:{marginBottom:16}}),(0,M.jsx)(C.Z,{unCheckedChildren:"disabled",checkedChildren:"disabled",checked:_,onChange:L})]})};a.default=i},29291:function(W,a,e){e.r(a);var P=e(48305),c=e.n(P),u=e(75271),E=e(7895),f=e(52676),l=function(){var M=(0,u.useState)([]),h=c()(M,2),s=h[0],i=h[1],d=(0,u.useState)([]),o=c()(d,2),O=o[0],A=o[1],g=function(){for(var r=[],t=[],_=0;_<20;_++){var n={key:_.toString(),title:"content".concat(_+1),description:"description of content".concat(_+1),chosen:_%2===0};n.chosen&&r.push(n.key),t.push(n)}i(t),A(r)};(0,u.useEffect)(function(){g()},[]);var p=function(r,t){return t.description.indexOf(r)>-1},y=function(r){A(r)},S=function(r,t){console.log("search:",r,t)};return(0,f.jsx)(E.Z,{dataSource:s,showSearch:!0,filterOption:p,targetKeys:O,onChange:y,onSearch:S,render:function(r){return r.title}})};a.default=l},70295:function(W,a,e){e.r(a);var P=e(75271),c=e(65257),u=e(7895),E=e(52676),f=function(){return(0,E.jsxs)(c.Z,{size:"middle",vertical:!0,block:!0,children:[(0,E.jsx)(u.Z,{status:"error"}),(0,E.jsx)(u.Z,{status:"warning",showSearch:!0})]})};a.default=f},72759:function(W,a,e){e.r(a);var P=e(48305),c=e.n(P),u=e(26068),E=e.n(u),f=e(67825),l=e.n(f),C=e(75271),M=e(7895),h=e(23041),s=e(62976),i=e(65257),d=e(26687),o=e(52676),O=["leftColumns","rightColumns"],A=function(t){var _=t.leftColumns,n=t.rightColumns,m=l()(t,O);return(0,o.jsx)(M.Z,E()(E()({style:{width:"100%"}},m),{},{children:function(K){var L=K.direction,b=K.filteredItems,D=K.onItemSelect,I=K.onItemSelectAll,R=K.selectedKeys,j=K.disabled,k=L==="left"?_:n,Z={getCheckboxProps:function(){return{disabled:j}},onChange:function(B){I(B,"replace")},selectedRowKeys:R,selections:[h.Z.SELECTION_ALL,h.Z.SELECTION_INVERT,h.Z.SELECTION_NONE]};return(0,o.jsx)(h.Z,{rowSelection:Z,columns:k,dataSource:b,size:"small",style:{pointerEvents:j?"none":void 0},onRow:function(B){var U=B.key,N=B.disabled;return{onClick:function(){N||j||D(U,!R.includes(U))}}},pagination:{size:"mini",className:"p-2"}})}}))},g=["cat","dog","bird"],p=Array.from({length:20}).map(function(r,t){return{key:t.toString(),title:"content".concat(t+1),description:"description of content".concat(t+1),tag:g[t%3]}}),y=[{dataIndex:"title",title:"Name"},{dataIndex:"tag",title:"Tag",render:function(t){return(0,o.jsx)(s.Z,{color:"cyan",children:t.toUpperCase()})}},{dataIndex:"description",title:"Description"}],S=function(t,_){var n,m;return((n=_.title)===null||n===void 0?void 0:n.includes(t))||((m=_.tag)===null||m===void 0?void 0:m.includes(t))},v=function(){var t=(0,C.useState)([]),_=c()(t,2),n=_[0],m=_[1],T=(0,C.useState)(!1),K=c()(T,2),L=K[0],b=K[1],D=function(j){m(j)},I=function(j){b(j)};return(0,o.jsxs)(i.Z,{align:"start",size:"middle",block:!0,vertical:!0,children:[(0,o.jsx)(A,{dataSource:p,targetKeys:n,disabled:L,showSearch:!0,showSelectAll:!1,onChange:D,filterOption:S,leftColumns:y,rightColumns:y}),(0,o.jsx)(d.Z,{unCheckedChildren:"disabled",checkedChildren:"disabled",checked:L,onChange:I})]})};a.default=v},55677:function(W,a,e){e.r(a);var P=e(48305),c=e.n(P),u=e(15558),E=e.n(u),f=e(26068),l=e.n(f),C=e(67825),M=e.n(C),h=e(75271),s=e(7895),i=e(28137),d=e(77432),o=e(52676),O=["children"],A=["dataSource","targetKeys"],g=function(t,_){return t.includes(_)},p=function r(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[],_=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[];return t.map(function(n){var m=n.children,T=M()(n,O);return l()(l()({},T),{},{disabled:_.includes(T.key),children:r(m,_)})})},y=function(t){var _=t.dataSource,n=t.targetKeys,m=n===void 0?[]:n,T=M()(t,A),K=[];function L(){var b=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[];b.forEach(function(D){K.push(D),L(D.children)})}return L(_),(0,o.jsx)(s.Z,l()(l()({},T),{},{targetKeys:m,dataSource:K,className:"tree-transfer",render:function(D){return D.title},showSelectAll:!1,children:function(D){var I=D.direction,R=D.onItemSelect,j=D.selectedKeys;if(I==="left"){var k=[].concat(E()(j),E()(m));return(0,o.jsx)(i.Z,{className:{view:"p-1"},children:(0,o.jsx)(d.Z,{checkable:!0,checkStrictly:!0,defaultExpandAll:!0,checkedKeys:k,treeData:p(_,m),onCheck:function(x,B){var U=B.node.key;R(U,!g(k,U))},onSelect:function(x,B){var U=B.node.key;R(U,!g(k,U))}})})}}}))},S=[{key:"0-0",title:"0-0"},{key:"0-1",title:"0-1",children:[{key:"0-1-0",title:"0-1-0"},{key:"0-1-1",title:"0-1-1"}]},{key:"0-2",title:"0-2"},{key:"0-3",title:"0-3"},{key:"0-4",title:"0-4"}],v=function(){var t=(0,h.useState)([]),_=c()(t,2),n=_[0],m=_[1],T=function(L){m(L)};return(0,o.jsx)(y,{dataSource:S,targetKeys:n,onChange:T})};a.default=v}}]);
