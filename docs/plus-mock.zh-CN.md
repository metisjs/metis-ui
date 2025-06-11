---
group:
  title: Metis Plus
  order: 2
order: 5
title: 模拟数据
---

本项目使用 [msw](https://mswjs.io/) 进行接口请求的模拟，并结合 [faker-js](https://fakerjs.dev/) 生成随机数据，方便开发和测试。

- [msw](https://mswjs.io/): Mock Service Worker，拦截并模拟网络请求，支持 REST 和 GraphQL。
- [faker-js](https://fakerjs.dev/): 用于生成各种类型的假数据，如姓名、地址、图片等。

你可以在 `mocks` 目录下查看具体实现方式，或参考 [官方文档](https://mswjs.io/docs/) 和 [faker-js 文档](https://fakerjs.dev/guide/) 了解更多用法。

## 目录

```
├── mocks
│   ├── handlers           # 存放所有的请求处理器
│   │   ├── index.ts       # 处理器入口文件，统一导出各模块处理器
│   │   └── user.ts        # 用户相关的 mock 接口处理器
│   └── browser.ts         # 配置并启动 mock 服务的入口文件
```

## 添加接口模拟数据

在 `src/mocks/handlers` 目录下创建文件 `faker-list.ts`。

```ts src/mocks/handlers/faker-list.ts
import { faker } from '@faker-js/faker';
import { delay, http, HttpResponse } from 'msw';
import type { CurrentUser } from '@/types/user';
import type { UserPermissions } from '@/utils/auth';

const userHandles = [
  http.get('/api/faker-list', async ({ request }) => {
    await delay(600);

    return HttpResponse.json({
      success: true,
      data: [
        /* 模拟数据，你可以通过faker-js来生成 */
      ],
    });
  }),
];

export default userHandles;
```

在 `src/mocks/handlers/index.ts` 中引用文件。

<!-- prettier-ignore -->
```ts src/mocks/handlers/index.ts {2,6}
import fakerListHandlers from './faker-list';
import userHandlers from './user';

export default [
  ...userHandlers,
  ...fakerListHandlers
];
```

现在当发送 `[GET]/api/faker-list` 请求时就会被拦截了。
