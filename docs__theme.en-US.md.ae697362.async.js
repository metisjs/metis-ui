"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[1257],{92792:function(i,o,r){r.r(o);var t=r(37496),_=r(82857),u=r(38461),m=r(83120),h=r(48415),p=r(95300),v=r(11024),x=r(65110),b=r(10006),g=r(18637),y=r(741),I=r(30166),a=r(91512),l=r(35055),d=r(30158),s=r(39546),n=r(86704),e=r(74132);function c(){return(0,e.jsx)(l.DumiPage,{children:(0,e.jsx)(s.Suspense,{fallback:(0,e.jsx)(d.Z,{}),children:(0,e.jsx)(e.Fragment,{children:(0,e.jsxs)("div",{className:"markdown",children:[(0,e.jsxs)("p",{children:[n.texts[0].value,(0,e.jsx)("code",{children:n.texts[1].value}),n.texts[2].value,(0,e.jsx)("code",{children:n.texts[3].value}),n.texts[4].value]}),(0,e.jsxs)("p",{children:[n.texts[5].value,(0,e.jsx)("code",{children:n.texts[6].value}),n.texts[7].value]}),(0,e.jsx)(a.Z,{title:"tailwind.css",lang:"css",children:n.texts[8].value}),(0,e.jsxs)("p",{children:[n.texts[9].value,(0,e.jsx)("code",{children:n.texts[10].value}),n.texts[11].value,(0,e.jsx)("code",{children:n.texts[12].value}),n.texts[13].value,(0,e.jsx)("code",{children:n.texts[14].value}),n.texts[15].value,(0,e.jsx)("code",{children:n.texts[16].value}),n.texts[17].value]}),(0,e.jsx)(a.Z,{title:"app.tsx",lang:"tsx",children:n.texts[18].value}),(0,e.jsxs)("h2",{id:"disable-themes",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#disable-themes",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Disable Themes"]}),(0,e.jsx)("p",{children:n.texts[19].value}),(0,e.jsx)(a.Z,{lang:"css",children:n.texts[20].value}),(0,e.jsx)("p",{children:n.texts[21].value}),(0,e.jsx)(a.Z,{lang:"css",children:n.texts[22].value}),(0,e.jsxs)("h2",{id:"scoped-themes",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#scoped-themes",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Scoped Themes"]}),(0,e.jsxs)("p",{children:[n.texts[23].value,(0,e.jsx)("code",{children:n.texts[24].value}),n.texts[25].value,(0,e.jsx)("code",{children:n.texts[26].value}),n.texts[27].value]}),(0,e.jsx)(a.Z,{title:"app.tsx",lang:"tsx",children:n.texts[28].value}),(0,e.jsxs)("h2",{id:"custom-themes",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#custom-themes",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Custom Themes"]}),(0,e.jsxs)("p",{children:[n.texts[29].value,(0,e.jsx)("code",{children:n.texts[30].value}),n.texts[31].value]}),(0,e.jsx)(a.Z,{title:"tailwind.css",lang:"css",children:n.texts[32].value}),(0,e.jsxs)("p",{children:[n.texts[33].value,(0,e.jsx)("a",{href:"https://tailwindcss.com/docs/colors",children:(0,e.jsx)("code",{children:n.texts[34].value})}),n.texts[35].value,(0,e.jsx)("a",{href:"https://developer.mozilla.org/docs/Web/CSS/color",children:(0,e.jsx)("code",{children:n.texts[36].value})}),n.texts[37].value]}),(0,e.jsxs)("p",{children:[n.texts[38].value,(0,e.jsx)("a",{href:"https://tailwindcss.com/docs/colors",children:(0,e.jsx)("code",{children:n.texts[39].value})}),n.texts[40].value]}),(0,e.jsx)(a.Z,{title:"tailwind.css",lang:"css",children:n.texts[41].value}),(0,e.jsxs)("h2",{id:"modify-built-in-themes",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#modify-built-in-themes",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Modify Built-in Themes"]}),(0,e.jsx)("p",{children:n.texts[42].value}),(0,e.jsxs)("p",{children:[n.texts[43].value,(0,e.jsx)("code",{children:n.texts[44].value}),n.texts[45].value]}),(0,e.jsx)(a.Z,{title:"tailwind.css",lang:"css",children:n.texts[46].value}),(0,e.jsx)("p",{children:n.texts[47].value}),(0,e.jsx)("blockquote",{children:(0,e.jsx)("p",{children:n.texts[48].value})})]})})})})}o.default=c},86704:function(i,o,r){r.r(o),r.d(o,{texts:function(){return t}});const t=[{value:"Metis UI only customizes themes based on colors and provides two default themes: ",paraId:0},{value:"light",paraId:0},{value:" and ",paraId:0},{value:"dark",paraId:0},{value:". You can also create your own custom themes or modify the built-in themes.",paraId:0},{value:"You can manage themes by adding parentheses after ",paraId:1},{value:'@plugin "metis-ui/plugin"',paraId:1},{value:" in the CSS file.",paraId:1},{value:`@plugin 'metis-ui/plugin' {
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
  text: 'gray-900';
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
  text: 'gray-900';
  /* Primary border color */
  border: 'gray-300';
  /* Primary fill color */
  fill: 'gray-950/20';
  /* Component container background */
  container: 'white';
  /* Floating layers background*/
  elevated: 'white';
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
`,paraId:18,tocIndex:3},{value:"All other colors will inherit from the original theme.",paraId:19,tocIndex:3},{value:"Translate by ChartGPT",paraId:20,tocIndex:3}]}}]);
