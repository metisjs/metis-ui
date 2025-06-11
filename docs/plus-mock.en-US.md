---
group:
  title: Metis Plus
  order: 2
order: 5
title: Mock Data
---

This project uses [msw](https://mswjs.io/) to mock API requests, combined with [faker-js](https://fakerjs.dev/) to generate random data for easier development and testing.

- [msw](https://mswjs.io/): Mock Service Worker, intercepts and mocks network requests, supporting both REST and GraphQL.
- [faker-js](https://fakerjs.dev/): Generates various types of fake data, such as names, addresses, images, and more.

You can check the implementation in the `mocks` directory, or refer to the [official msw documentation](https://mswjs.io/docs/) and [faker-js guide](https://fakerjs.dev/guide/) for more usage details.

## Directory Structure

```
├── mocks
│   ├── handlers           # All request handlers
│   │   ├── index.ts       # Handler entry file, exports all module handlers
│   │   └── user.ts        # User-related mock API handlers
│   └── browser.ts         # Entry file to configure and start the mock service
```

## Adding Mock API Data

Create a file named `faker-list.ts` under `src/mocks/handlers`.

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
        /* Mock data, you can generate it using faker-js */
      ],
    });
  }),
];

export default userHandles;
```

Then import this file in `src/mocks/handlers/index.ts`:

<!-- prettier-ignore -->
```ts src/mocks/handlers/index.ts {2,6}
import fakerListHandlers from './faker-list';
import userHandlers from './user';

export default [
  ...userHandlers,
  ...fakerListHandlers
];
```

Now, any `[GET]/api/faker-list` request will be intercepted and handled by the mock service.

> Translate by ChartGPT
