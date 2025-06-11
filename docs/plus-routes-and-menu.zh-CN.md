---
group:
  title: Metis Plus
  order: 2
order: 3
title: 路由和菜单
---

路由通常与菜单紧密关联。为了简化维护，我们通过统一的路由配置表自动生成菜单项。这样只需维护一份路由数据，菜单结构会自动同步更新，避免了重复配置和可能出现的不一致问题。

这种方式不仅提升了开发效率，也保证了路由与菜单的一致性和可维护性。

## 路由

```tsx src/routes.tsx
{
  path: '/',
  component: () => import('@/layouts/MainLayout'),                        // 全局布局组件
  children: [
    {
      index: true,
      element: <Navigate to="/workplace" replace />,                      // 访问 “/” 时会跳转到“/workplace”
    },
    {
      name: 'menu.workplace',                                             // 菜单名称，支持 i18n key值。只有 name 不为空时才会解析成菜单。
      icon: <Squares2X2Outline />,                                        // 菜单图标
      path: 'workplace',                                                  // 菜单 path
      component: () => import('@/pages/workplace'),                       // 页面组件
      hideInMenu: true,                                                   // 是否显示为菜单，比如：详情页通常不在菜单页显示，但会在面包屑导航中显示
      permission: { resource: 'system.user-list', action: ['read'] },     // 权限配置，具体见：[权限配置](/plus-permission-cn)
      children:[{...}]                                                    // 子菜单或路由
    }
  ]
}
```

## 新增一个菜单项

在 pages 中新增一个 admin 文件夹，并在其中新增 index.tsx。

```tsx src/pages/admin/index.tsx
import PageContainer from '@/components/PageContainer';

const Admin = () => {
  return <PageContainer>Admin</PageContainer>;
};

export default Admin;
```

在路由表中新增路由配置。

```tsx src/pages/admin/index.tsx {20-26}
const routes: Route[] = [
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
```

添加国际化内容

```json src/locale/zh-CN.json {3}
{
  "menu.workplace": "工作台",
  "menu.admin": "系统管理"
}
```

到这，你已经完成了一个菜单项的配置。现在刷新一下页面，就能看到新的菜单项。
