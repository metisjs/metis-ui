"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[9126],{65042:function(r,t,s){s.r(t);var n=s(37496),o=s(82857),m=s(38461),c=s(83120),h=s(48415),x=s(95300),p=s(11024),v=s(65110),f=s(10006),I=s(18637),E=s(741),j=s(30166),a=s(91512),d=s(35055),i=s(30158),u=s(39546),_=s(10140),e=s(74132);function l(){return(0,e.jsx)(d.DumiPage,{children:(0,e.jsx)(u.Suspense,{fallback:(0,e.jsx)(i.Z,{}),children:(0,e.jsx)(e.Fragment,{children:(0,e.jsxs)("div",{className:"markdown",children:[(0,e.jsxs)("p",{children:[_.texts[0].value,(0,e.jsx)("a",{href:"https://mswjs.io/",children:_.texts[1].value}),_.texts[2].value,(0,e.jsx)("a",{href:"https://fakerjs.dev/",children:_.texts[3].value}),_.texts[4].value]}),(0,e.jsxs)("ul",{children:[(0,e.jsxs)("li",{children:[(0,e.jsx)("a",{href:"https://mswjs.io/",children:_.texts[5].value}),_.texts[6].value]}),(0,e.jsxs)("li",{children:[(0,e.jsx)("a",{href:"https://fakerjs.dev/",children:_.texts[7].value}),_.texts[8].value]})]}),(0,e.jsxs)("p",{children:[_.texts[9].value,(0,e.jsx)("code",{children:_.texts[10].value}),_.texts[11].value,(0,e.jsx)("a",{href:"https://mswjs.io/docs/",children:_.texts[12].value}),_.texts[13].value,(0,e.jsx)("a",{href:"https://fakerjs.dev/guide/",children:_.texts[14].value}),_.texts[15].value]}),(0,e.jsxs)("h2",{id:"directory-structure",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#directory-structure",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Directory Structure"]}),(0,e.jsx)(a.Z,{children:_.texts[16].value}),(0,e.jsxs)("h2",{id:"adding-mock-api-data",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#adding-mock-api-data",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Adding Mock API Data"]}),(0,e.jsxs)("p",{children:[_.texts[17].value,(0,e.jsx)("code",{children:_.texts[18].value}),_.texts[19].value,(0,e.jsx)("code",{children:_.texts[20].value}),_.texts[21].value]}),(0,e.jsx)(a.Z,{title:"src/mocks/handlers/faker-list.ts",lang:"ts",children:_.texts[22].value}),(0,e.jsxs)("p",{children:[_.texts[23].value,(0,e.jsx)("code",{children:_.texts[24].value}),_.texts[25].value]}),(0,e.jsx)(a.Z,{title:"src/mocks/handlers/index.ts",lang:"ts",highlightLines:[2,6],children:_.texts[26].value}),(0,e.jsxs)("p",{children:[_.texts[27].value,(0,e.jsx)("code",{children:_.texts[28].value}),_.texts[29].value]}),(0,e.jsx)("blockquote",{children:(0,e.jsx)("p",{children:_.texts[30].value})})]})})})})}t.default=l},10140:function(r,t,s){s.r(t),s.d(t,{texts:function(){return n}});const n=[{value:"This project uses ",paraId:0},{value:"msw",paraId:0},{value:" to mock API requests, combined with ",paraId:0},{value:"faker-js",paraId:0},{value:" to generate random data for easier development and testing.",paraId:0},{value:"msw",paraId:1},{value:": Mock Service Worker, intercepts and mocks network requests, supporting both REST and GraphQL.",paraId:1},{value:"faker-js",paraId:1},{value:": Generates various types of fake data, such as names, addresses, images, and more.",paraId:1},{value:"You can check the implementation in the ",paraId:2},{value:"mocks",paraId:2},{value:" directory, or refer to the ",paraId:2},{value:"official msw documentation",paraId:2},{value:" and ",paraId:2},{value:"faker-js guide",paraId:2},{value:" for more usage details.",paraId:2},{value:`\u251C\u2500\u2500 mocks
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
`,paraId:7,tocIndex:1},{value:"Now, any ",paraId:8,tocIndex:1},{value:"[GET]/api/faker-list",paraId:8,tocIndex:1},{value:" request will be intercepted and handled by the mock service.",paraId:8,tocIndex:1},{value:"Translate by ChartGPT",paraId:9,tocIndex:1}]}}]);
