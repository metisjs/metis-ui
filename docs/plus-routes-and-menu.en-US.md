---
group:
  title: Metis Plus
  order: 2
order: 3
title: Routes And Menu
---

Routes are usually closely tied to menus. To simplify maintenance, we automatically generate menu items from a unified route configuration table. This way, you only need to maintain a single set of route data, and the menu structure will automatically stay in sync, avoiding duplicate configurations and potential inconsistencies.

This approach not only improves development efficiency but also ensures consistency and maintainability between routes and menus.

## Routes

```tsx src/routes.tsx
{
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
```

## Adding a Menu Item

Create a new `admin` folder under `pages`, and add an `index.tsx` file inside.

```tsx src/pages/admin/index.tsx
import PageContainer from '@/components/PageContainer';

const Admin = () => {
  return <PageContainer>Admin</PageContainer>;
};

export default Admin;
```

Add a new route configuration in the route table.

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

Add internationalization content

```json src/locale/zh-CN.json {3}
{
  "menu.workplace": "工作台",
  "menu.admin": "系统管理"
}
```

That's it! You've finished configuring a new menu item. Now refresh the page and you'll see the new menu entry.

> Translate by ChartGPT
