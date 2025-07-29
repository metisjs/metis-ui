"use strict";(self.webpackChunkmetis_ui=self.webpackChunkmetis_ui||[]).push([[4349],{26441:function(a,t,_){_.r(t);var s=_(37496),r=_(82857),l=_(91238),c=_(83120),p=_(48415),h=_(95300),x=_(11024),E=_(65110),D=_(10006),I=_(18637),P=_(741),v=_(30166),i=_(91512),u=_(35055),o=_(30158),d=_(39546),n=_(8209),e=_(74132);function m(){return(0,e.jsx)(u.DumiPage,{children:(0,e.jsx)(d.Suspense,{fallback:(0,e.jsx)(o.Z,{}),children:(0,e.jsx)(e.Fragment,{children:(0,e.jsxs)("div",{className:"markdown",children:[(0,e.jsx)("p",{children:n.texts[0].value}),(0,e.jsx)("p",{children:n.texts[1].value}),(0,e.jsxs)("h2",{id:"\u8DEF\u7531",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u8DEF\u7531",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"\u8DEF\u7531"]}),(0,e.jsx)(i.Z,{title:"src/routes.tsx",lang:"tsx",children:n.texts[2].value}),(0,e.jsxs)("h2",{id:"\u65B0\u589E\u4E00\u4E2A\u83DC\u5355\u9879",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u65B0\u589E\u4E00\u4E2A\u83DC\u5355\u9879",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"\u65B0\u589E\u4E00\u4E2A\u83DC\u5355\u9879"]}),(0,e.jsx)("p",{children:n.texts[3].value}),(0,e.jsx)(i.Z,{title:"src/pages/admin/index.tsx",lang:"tsx",children:n.texts[4].value}),(0,e.jsx)("p",{children:n.texts[5].value}),(0,e.jsx)(i.Z,{title:"src/pages/admin/index.tsx",lang:"tsx",highlightLines:[20,21,22,23,24,25,26],children:n.texts[6].value}),(0,e.jsx)("p",{children:n.texts[7].value}),(0,e.jsx)(i.Z,{title:"src/locale/zh-CN.json",lang:"json",highlightLines:[3],children:n.texts[8].value}),(0,e.jsx)("p",{children:n.texts[9].value})]})})})})}t.default=m},8209:function(a,t,_){_.r(t),_.d(t,{texts:function(){return s}});const s=[{value:"\u8DEF\u7531\u901A\u5E38\u4E0E\u83DC\u5355\u7D27\u5BC6\u5173\u8054\u3002\u4E3A\u4E86\u7B80\u5316\u7EF4\u62A4\uFF0C\u6211\u4EEC\u901A\u8FC7\u7EDF\u4E00\u7684\u8DEF\u7531\u914D\u7F6E\u8868\u81EA\u52A8\u751F\u6210\u83DC\u5355\u9879\u3002\u8FD9\u6837\u53EA\u9700\u7EF4\u62A4\u4E00\u4EFD\u8DEF\u7531\u6570\u636E\uFF0C\u83DC\u5355\u7ED3\u6784\u4F1A\u81EA\u52A8\u540C\u6B65\u66F4\u65B0\uFF0C\u907F\u514D\u4E86\u91CD\u590D\u914D\u7F6E\u548C\u53EF\u80FD\u51FA\u73B0\u7684\u4E0D\u4E00\u81F4\u95EE\u9898\u3002",paraId:0},{value:"\u8FD9\u79CD\u65B9\u5F0F\u4E0D\u4EC5\u63D0\u5347\u4E86\u5F00\u53D1\u6548\u7387\uFF0C\u4E5F\u4FDD\u8BC1\u4E86\u8DEF\u7531\u4E0E\u83DC\u5355\u7684\u4E00\u81F4\u6027\u548C\u53EF\u7EF4\u62A4\u6027\u3002",paraId:1},{value:`{
  path: '/',
  component: () => import('@/layouts/MainLayout'),                        // \u5168\u5C40\u5E03\u5C40\u7EC4\u4EF6
  children: [
    {
      index: true,
      element: <Navigate to="/workplace" replace />,                      // \u8BBF\u95EE \u201C/\u201D \u65F6\u4F1A\u8DF3\u8F6C\u5230\u201C/workplace\u201D
    },
    {
      name: 'menu.workplace',                                             // \u83DC\u5355\u540D\u79F0\uFF0C\u652F\u6301 i18n key\u503C\u3002\u53EA\u6709 name \u4E0D\u4E3A\u7A7A\u65F6\u624D\u4F1A\u89E3\u6790\u6210\u83DC\u5355\u3002
      icon: <Squares2X2Outline />,                                        // \u83DC\u5355\u56FE\u6807
      path: 'workplace',                                                  // \u83DC\u5355 path
      component: () => import('@/pages/workplace'),                       // \u9875\u9762\u7EC4\u4EF6
      hideInMenu: true,                                                   // \u662F\u5426\u663E\u793A\u4E3A\u83DC\u5355\uFF0C\u6BD4\u5982\uFF1A\u8BE6\u60C5\u9875\u901A\u5E38\u4E0D\u5728\u83DC\u5355\u9875\u663E\u793A\uFF0C\u4F46\u4F1A\u5728\u9762\u5305\u5C51\u5BFC\u822A\u4E2D\u663E\u793A
      permission: { resource: 'system.user-list', action: ['read'] },     // \u6743\u9650\u914D\u7F6E\uFF0C\u5177\u4F53\u89C1\uFF1A[\u6743\u9650\u914D\u7F6E](/plus-permission-cn)
      children:[{...}]                                                    // \u5B50\u83DC\u5355\u6216\u8DEF\u7531
    }
  ]
}
`,paraId:2,tocIndex:0},{value:"\u5728 pages \u4E2D\u65B0\u589E\u4E00\u4E2A admin \u6587\u4EF6\u5939\uFF0C\u5E76\u5728\u5176\u4E2D\u65B0\u589E index.tsx\u3002",paraId:3,tocIndex:1},{value:`import PageContainer from '@/components/PageContainer';

const Admin = () => {
  return <PageContainer>Admin</PageContainer>;
};

export default Admin;
`,paraId:4,tocIndex:1},{value:"\u5728\u8DEF\u7531\u8868\u4E2D\u65B0\u589E\u8DEF\u7531\u914D\u7F6E\u3002",paraId:5,tocIndex:1},{value:`const routes: Route[] = [
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
`,paraId:6,tocIndex:1},{value:"\u6DFB\u52A0\u56FD\u9645\u5316\u5185\u5BB9",paraId:7,tocIndex:1},{value:`{
  "menu.workplace": "\u5DE5\u4F5C\u53F0",
  "menu.admin": "\u7CFB\u7EDF\u7BA1\u7406"
}
`,paraId:8,tocIndex:1},{value:"\u5230\u8FD9\uFF0C\u4F60\u5DF2\u7ECF\u5B8C\u6210\u4E86\u4E00\u4E2A\u83DC\u5355\u9879\u7684\u914D\u7F6E\u3002\u73B0\u5728\u5237\u65B0\u4E00\u4E0B\u9875\u9762\uFF0C\u5C31\u80FD\u770B\u5230\u65B0\u7684\u83DC\u5355\u9879\u3002",paraId:9,tocIndex:1}]}}]);
