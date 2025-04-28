---
group:
  title: Getting Started
order: 1
title: Usage with Vite
---

[Vite](https://vitejs.dev/) is one of the best tools in the industry for developing React applications. This article will demonstrate how to use the `metis-ui` components in a project created with Vite and customize Vite's configuration to meet various engineering needs.

## Installation and Initialization

Before getting started, you may need to install [yarn](https://github.com/yarnpkg/yarn/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/).

<InstallDependencies npm='$ npm create vite metis-ui-demo -- --template react-ts' yarn='$ yarn create vite metis-ui-demo --template react-ts' pnpm='$ pnpm create vite metis-ui-demo --template react-ts' bun='$ bun create vite metis-ui-demo --template react-ts'></InstallDependencies>

The tool will automatically scaffold a project and install the necessary dependencies for a React project. If you encounter network issues during this process, try configuring a proxy or using a different npm registry.

Next, navigate to the project directory, install dependencies, and start the development server.

```bash
$ cd metis-ui-demo
$ npm install
$ npm run dev
```

At this point, open your browser and visit http://localhost:5173/. If you see the `Vite + React` interface, the setup is successful.

## Adding metis-ui

Install `metis-ui`, `tailwindcss`, and `@tailwindcss/vite`.

<InstallDependencies npm='$ npm install metis-ui tailwindcss @tailwindcss/vite --save' yarn='$ yarn add metis-ui tailwindcss @tailwindcss/vite' pnpm='$ pnpm install metis-ui tailwindcss @tailwindcss/vite --save' bun='$ bun add metis-ui tailwindcss @tailwindcss/vite'></InstallDependencies>

Add the `@tailwindcss/vite` plugin to the Vite configuration.

<!-- prettier-ignore -->
```ts vite.config.ts {3,9}
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
  ],
});
```

Create a new `tailwind.css` file in the root directory.

```css tailwind.css
@import 'tailwindcss';

@source './node_modules/metis-ui/es';
@plugin 'metis-ui/plugin';
```

Modify `index.html` to include the Tailwind CSS file.

```html index.html {7}
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/tailwind.css" rel="stylesheet" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Update `src/App.ts` to include the `metis-ui` Alert component.

```tsx
import { Alert } from 'metis-ui';

const App = () => (
  <div className="h-screen w-screen">
    <Alert type="info" banner message="Hello" description="Welcome to metis-ui" />
  </div>
);

export default App;
```

Now, you should see the `metis-ui` `Alert` component displayed on the page. You can continue to use other components to develop your application. For additional development workflows, refer to [Vite](https://vitejs.dev/).

We have successfully set up the `metis-ui` components. Start building your application now!

> Translate by ChartGPT
