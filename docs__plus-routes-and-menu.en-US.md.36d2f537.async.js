"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[6385],{46206:function(s,t,n){n.r(t);var a=n(37496),l=n(82857),m=n(91238),c=n(83120),p=n(48415),h=n(95300),x=n(11024),v=n(65110),I=n(10006),f=n(18637),E=n(741),P=n(30166),i=n(91512),o=n(35055),u=n(30158),d=n(39546),_=n(7103),e=n(74132);function r(){return(0,e.jsx)(o.DumiPage,{children:(0,e.jsx)(d.Suspense,{fallback:(0,e.jsx)(u.Z,{}),children:(0,e.jsx)(e.Fragment,{children:(0,e.jsxs)("div",{className:"markdown",children:[(0,e.jsx)("p",{children:_.texts[0].value}),(0,e.jsx)("p",{children:_.texts[1].value}),(0,e.jsxs)("h2",{id:"routes",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#routes",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Routes"]}),(0,e.jsx)(i.Z,{title:"src/routes.tsx",lang:"tsx",children:_.texts[2].value}),(0,e.jsxs)("h2",{id:"adding-a-menu-item",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#adding-a-menu-item",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Adding a Menu Item"]}),(0,e.jsxs)("p",{children:[_.texts[3].value,(0,e.jsx)("code",{children:_.texts[4].value}),_.texts[5].value,(0,e.jsx)("code",{children:_.texts[6].value}),_.texts[7].value,(0,e.jsx)("code",{children:_.texts[8].value}),_.texts[9].value]}),(0,e.jsx)(i.Z,{title:"src/pages/admin/index.tsx",lang:"tsx",children:_.texts[10].value}),(0,e.jsx)("p",{children:_.texts[11].value}),(0,e.jsx)(i.Z,{title:"src/pages/admin/index.tsx",lang:"tsx",highlightLines:[20,21,22,23,24,25,26],children:_.texts[12].value}),(0,e.jsx)("p",{children:_.texts[13].value}),(0,e.jsx)(i.Z,{title:"src/locale/zh-CN.json",lang:"json",highlightLines:[3],children:_.texts[14].value}),(0,e.jsx)("p",{children:_.texts[15].value}),(0,e.jsx)("blockquote",{children:(0,e.jsx)("p",{children:_.texts[16].value})})]})})})})}t.default=r},7103:function(s,t,n){n.r(t),n.d(t,{texts:function(){return a}});const a=[{value:"Routes are usually closely tied to menus. To simplify maintenance, we automatically generate menu items from a unified route configuration table. This way, you only need to maintain a single set of route data, and the menu structure will automatically stay in sync, avoiding duplicate configurations and potential inconsistencies.",paraId:0},{value:"This approach not only improves development efficiency but also ensures consistency and maintainability between routes and menus.",paraId:1},{value:`{
  path: '/',
  component: () => import('@/layouts/MainLayout'),                        // Global layout component
  children: [
    {
      index: true,
      element: <Navigate to="/workplace" replace />,                      // Redirects "/" to "/workplace"
    },
    {
      name: 'menu.workplace',                                             // Menu name, supports i18n key. Only parsed as a menu if name is not empty.
      icon: <Squares2X2Outline />,                                        // Menu icon
      path: 'workplace',                                                  // Menu path
      component: () => import('@/pages/workplace'),                       // Page component
      hideInMenu: true,                                                   // Whether to show in menu; e.g., detail pages are usually hidden from the menu but shown in breadcrumbs
      permission: { resource: 'system.user-list', action: ['read'] },     // Permission config, see: [Permission Config](/plus-permission-cn)
      children:[{...}]                                                    // Submenus or routes
    }
  ]
}
`,paraId:2,tocIndex:0},{value:"Create a new ",paraId:3,tocIndex:1},{value:"admin",paraId:3,tocIndex:1},{value:" folder under ",paraId:3,tocIndex:1},{value:"pages",paraId:3,tocIndex:1},{value:", and add an ",paraId:3,tocIndex:1},{value:"index.tsx",paraId:3,tocIndex:1},{value:" file inside.",paraId:3,tocIndex:1},{value:`import PageContainer from '@/components/PageContainer';

const Admin = () => {
  return <PageContainer>Admin</PageContainer>;
};

export default Admin;
`,paraId:4,tocIndex:1},{value:"Add a new route configuration in the route table.",paraId:5,tocIndex:1},{value:`const routes: Route[] = [
  {
    path: loginPath,
    component: () => import('@/pages/login'),
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout'),
    children: [
      {
        index: true,
        element: <Navigate to="/workplace" replace />,
      },
      {
        name: 'menu.workplace',
        icon: <Squares2X2Outline />,
        path: 'workplace',
        component: () => import('@/pages/workplace'),
      },
      {
        name: 'menu.admin',
        icon: <Cog6ToothOutline />,
        path: 'admin',
        component: () => import('@/pages/admin'),
      },
      {
        path: '*',
        component: () => import('@/pages/404'),
      },
    ],
  },
];
`,paraId:6,tocIndex:1},{value:"Add internationalization content",paraId:7,tocIndex:1},{value:`{
  "menu.workplace": "\u5DE5\u4F5C\u53F0",
  "menu.admin": "\u7CFB\u7EDF\u7BA1\u7406"
}
`,paraId:8,tocIndex:1},{value:"That's it! You've finished configuring a new menu item. Now refresh the page and you'll see the new menu entry.",paraId:9,tocIndex:1},{value:"Translate by ChartGPT",paraId:10,tocIndex:1}]}}]);
