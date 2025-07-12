---
group:
  title: Metis Plus
  order: 2
order: 6
title: Permissions
---

Permission control is a fundamental feature commonly found in enterprise backend scenarios. Metis Plus provides a comprehensive permission management solution, including user authentication, permission validation, menu filtering, route guards, and more.

## System Architecture

The Metis Plus permission system is designed based on the **RBAC (Role-Based Access Control)** model, which includes the following core concepts:

- **User**: The system user
- **Permission**: Specific operation permissions, consisting of resources and actions
- **Resource**: Functional modules or data entities in the system
- **Action**: Specific operations on resources, such as read, edit, delete, etc.

## Permission Data Structure

### User Permission Format

```typescript
export type UserPermissions = {
  resource: string; // Resource name
  actions?: string[]; // List of allowed actions
}[];

// Example
const userPermissions: UserPermissions = [
  { resource: 'dashboard', actions: ['view'] },
  { resource: 'admin', actions: ['read', 'edit', 'delete'] },
  { resource: 'workplace' }, // No actions means all permissions for the resource
];
```

### Permission Check Format

```typescript
export type Permission =
  | Auth // Single permission
  | Permission[] // Array of permissions (AND relationship)
  | { and: Permission[] } // Explicit AND relationship
  | { or: Permission[] }; // OR relationship

export type Auth = { resource: Resource; actions?: string[] } | Resource; // Can use string or RegExp

type Resource = string | RegExp;
```

## Permission Configuration

### 1. User Permission Configuration

In real projects, user permissions are returned by the backend. Here, we use mock data for demonstration.

Configure permissions for different users in `src/mocks/handlers/user.ts`:

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
    data: { permissions /* other user info */ },
  });
});
```

### 2. Route Permission Configuration

Configure route permissions in `src/routes.tsx`:

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
    permission: { resource: 'admin', actions: ['read'] }, // Requires admin read permission
  },
];
```

## Permission Component

### Access Permission Control Component

Used for permission control within components:

```tsx
import Access from '@/components/Access';

const MyComponent = () => {
  return (
    <div>
      {/* Basic usage */}
      <Access permission={{ resource: 'admin' }}>
        <Button>Admin Only Button</Button>
      </Access>

      {/* With fallback */}
      <Access
        permission={{ resource: 'admin', actions: ['edit'] }}
        fallback={<span>Insufficient Permission</span>}
      >
        <Button>Edit</Button>
      </Access>

      {/* Complex permission */}
      <Access
        permission={{
          or: [{ resource: 'admin' }, { resource: 'editor', actions: ['publish'] }],
        }}
      >
        <Button>Publish Article</Button>
      </Access>
    </div>
  );
};
```

## Menu Permission Filtering

The menu system automatically filters out inaccessible menu items based on user permissions. The filtering logic is implemented in `src/utils/menu.ts`:

```ts src/utils/menu.ts
export function formatter(
  { data, t, userPerms }: FormatterProps,
  parentPath = '/',
  ignoreFilter = false,
): MenuDataItem[] {
  return data
    .filter((item) => {
      // Hide menu filtering
      if (!ignoreFilter && item.hideInMenu) return false;
      // Permission filtering
      if (item.permission && !hasPermission(item.permission, userPerms)) return false;
      return true;
    })
    .flatMap((item) => {
      // Menu item processing logic
    });
}
```

## Route Guards

Route-level permission control is implemented via the `Access` component, which is automatically wrapped in `src/routes.tsx`:

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

      // Automatically add permission guard
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

With this permission control system, Metis Plus provides a complete, flexible, and easy-to-use permission management solution for enterprise backend applications, helping developers quickly build secure and reliable enterprise-grade apps.

> Translate by ChartGPT
