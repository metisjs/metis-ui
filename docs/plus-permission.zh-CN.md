---
group:
  title: Metis Plus
  order: 2
order: 6
title: 权限控制
---

权限控制是中后台场景非常常见的基础功能，Metis Plus 提供了完整的权限管理解决方案，包括用户认证、权限校验、菜单过滤、路由守卫等功能。

## 系统架构

Metis Plus 的权限系统基于 **RBAC（基于角色的访问控制）** 模型设计，主要包含以下几个核心概念：

- **用户（User）**：系统的使用者
- **权限（Permission）**：具体的操作权限，由资源和动作组成
- **资源（Resource）**：系统中的功能模块或数据实体
- **动作（Action）**：对资源的具体操作，如读取、编辑、删除等

## 权限数据结构

### 用户权限格式

```typescript
export type UserPermissions = {
  resource: string; // 资源名称
  actions?: string[]; // 允许的操作列表
}[];

// 示例
const userPermissions: UserPermissions = [
  { resource: 'dashboard', actions: ['view'] },
  { resource: 'admin', actions: ['read', 'edit', 'delete'] },
  { resource: 'workplace' }, // 无 actions 表示拥有该资源的所有权限
];
```

### 权限检查格式

```typescript
export type Permission =
  | Auth // 单个权限
  | Permission[] // 权限数组（且关系）
  | { and: Permission[] } // 明确的且关系
  | { or: Permission[] }; // 或关系

export type Auth = { resource: Resource; actions?: string[] } | Resource; // 可以直接使用字符串或正则

type Resource = string | RegExp;
```

## 权限配置

### 1. 用户权限配置

实际项目中用户权限由服务端返回，这里我们使用 mock 数据代替。

在 `src/mocks/handlers/user.ts` 中配置不同用户的权限：

```ts src/mocks/handlers/user.ts
http.get('/api/currentUser', async ({ request }) => {
  const token = request.headers.get('authorization') || '';

  let permissions: UserPermissions = [];
  if (token === 'fake_token_admin') {
    permissions = [
      { resource: 'admin', actions: ['read', 'edit', 'delete'] },
      { resource: 'dashboard', actions: ['view'] },
      { resource: 'workplace' },
    ];
  } else if (token === 'fake_token_user') {
    permissions = [{ resource: 'dashboard', actions: ['view'] }, { resource: 'workplace' }];
  }

  return HttpResponse.json({
    success: true,
    data: { permissions /* 其他用户信息 */ },
  });
});
```

### 2. 路由权限配置

在 `src/routes.tsx` 中为路由配置权限：

```tsx src/routes.tsx
const routes: Route[] = [
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
    permission: { resource: 'admin', actions: ['read'] }, // 需要管理员读取权限
  },
];
```

## 权限组件

### Access 权限控制组件

用于在组件中进行权限控制：

```tsx
import Access from '@/components/Access';

const MyComponent = () => {
  return (
    <div>
      {/* 基本使用 */}
      <Access permission={{ resource: 'admin' }}>
        <Button>管理员专用按钮</Button>
      </Access>

      {/* 带 fallback */}
      <Access
        permission={{ resource: 'admin', actions: ['edit'] }}
        fallback={<span>权限不足</span>}
      >
        <Button>编辑</Button>
      </Access>

      {/* 复杂权限 */}
      <Access
        permission={{
          or: [{ resource: 'admin' }, { resource: 'editor', actions: ['publish'] }],
        }}
      >
        <Button>发布文章</Button>
      </Access>
    </div>
  );
};
```

## 菜单权限过滤

菜单系统会自动根据用户权限过滤不可访问的菜单项。权限过滤逻辑在 `src/utils/menu.ts` 中实现：

```ts src/utils/menu.ts
export function formatter(
  { data, t, userPerms }: FormatterProps,
  parentPath = '/',
  ignoreFilter = false,
): MenuDataItem[] {
  return data
    .filter((item) => {
      // 隐藏菜单过滤
      if (!ignoreFilter && item.hideInMenu) return false;
      // 权限过滤
      if (item.permission && !hasPermission(item.permission, userPerms)) return false;
      return true;
    })
    .flatMap((item) => {
      // 菜单项处理逻辑
    });
}
```

## 路由守卫

路由级别的权限控制通过 `Access` 组件实现，在 `src/routes.tsx` 中自动包装：

```typescript
// src/routes.tsx
function generateRouteObjects(routes: Route[]): RouteObject[] {
  return routes.map((route) => {
    const { component, children, permission, ...rest } = route;

    const routeObj: RouteObject = { ...rest };

    if (component) {
      const Component = lazy(component);
      routeObj.element = (
        <Suspense fallback={<Loading />}>
          <Component />
        </Suspense>
      );

      // 自动添加权限守卫
      if (permission) {
        routeObj.element = (
          <Access permission={permission} fallback={<Err403 />}>
            {routeObj.element}
          </Access>
        );
      }
    }

    if (Array.isArray(children) && children.length > 0) {
      routeObj.children = generateRouteObjects(children);
    }

    return routeObj;
  });
}
```

通过以上权限控制系统，Metis Plus 为中后台应用提供了完整、灵活、易用的权限管理解决方案，帮助开发者快速构建安全可靠的企业级应用。
