"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[6887],{23456:function(o,n,e){e.r(n);var i=e(37496),m=e(82857),l=e(91238),p=e(83120),c=e(48415),h=e(95300),x=e(11024),f=e(65110),I=e(10006),E=e(18637),v=e(741),P=e(30166),s=e(91512),d=e(35055),r=e(30158),u=e(39546),t=e(6020),_=e(74132);function a(){return(0,_.jsx)(d.DumiPage,{children:(0,_.jsx)(u.Suspense,{fallback:(0,_.jsx)(r.Z,{}),children:(0,_.jsx)(_.Fragment,{children:(0,_.jsxs)("div",{className:"markdown",children:[(0,_.jsxs)("h2",{id:"getref",children:[(0,_.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#getref",children:(0,_.jsx)("span",{className:"icon icon-link"})}),"GetRef"]}),(0,_.jsxs)("p",{children:[t.texts[0].value,(0,_.jsx)("code",{children:t.texts[1].value}),t.texts[2].value]}),(0,_.jsx)(s.Z,{lang:"tsx",children:t.texts[3].value}),(0,_.jsxs)("h2",{id:"getprops",children:[(0,_.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#getprops",children:(0,_.jsx)("span",{className:"icon icon-link"})}),"GetProps"]}),(0,_.jsxs)("p",{children:[t.texts[4].value,(0,_.jsx)("code",{children:t.texts[5].value}),t.texts[6].value]}),(0,_.jsx)(s.Z,{lang:"tsx",children:t.texts[7].value}),(0,_.jsxs)("h2",{id:"getprop",children:[(0,_.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#getprop",children:(0,_.jsx)("span",{className:"icon icon-link"})}),"GetProp"]}),(0,_.jsxs)("p",{children:[t.texts[8].value,(0,_.jsx)("code",{children:t.texts[9].value}),t.texts[10].value,(0,_.jsx)("code",{children:t.texts[11].value}),t.texts[12].value]}),(0,_.jsx)(s.Z,{lang:"tsx",children:t.texts[13].value})]})})})})}n.default=a},6020:function(o,n,e){e.r(n),e.d(n,{texts:function(){return i}});const i=[{value:"Get the ",paraId:0,tocIndex:0},{value:"ref",paraId:0,tocIndex:0},{value:" property definition of the component, which is very useful for components that are not directly exposed or child components.",paraId:0,tocIndex:0},{value:`import type { GetRef } from 'metis-ui';
import { Select } from 'metis-ui';

type SelectRefType = GetRef<typeof Select>; // BaseSelectRef
`,paraId:1,tocIndex:0},{value:"Get the ",paraId:2,tocIndex:1},{value:"props",paraId:2,tocIndex:1},{value:" property definition of the component:",paraId:2,tocIndex:1},{value:`import type { GetProps } from 'metis-ui';
import { Checkbox } from 'metis-ui';

type CheckboxGroupType = GetProps<typeof Checkbox.Group>;
`,paraId:3,tocIndex:1},{value:"Get the single ",paraId:4,tocIndex:2},{value:"props",paraId:4,tocIndex:2},{value:" property definition of the component. It has encapsulated ",paraId:4,tocIndex:2},{value:"NonNullable",paraId:4,tocIndex:2},{value:", so you don't have to worry about it being empty:",paraId:4,tocIndex:2},{value:`import type { GetProp, SelectProps } from 'metis-ui';
import { Select } from 'metis-ui';

// Both of these can work
type SelectOptionType1 = GetProp<SelectProps, 'options'>[number];
type SelectOptionType2 = GetProp<typeof Select, 'options'>[number];
`,paraId:5,tocIndex:2}]}}]);
