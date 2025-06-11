---
group:
  title: Metis Plus
  order: 2
order: 2
title: Directory
---

This project is based on [Vite](https://vitejs.dev/) as the frontend build tool, adopting a modern development workflow and efficient module hot-reloading mechanism. The directory structure is clearly divided by functionality, following the "convention over configuration" principle to facilitate team collaboration and project maintenance.

The responsibilities of each directory and file are as follows:

- **public**: Stores static resources that can be accessed directly without building, such as favicon and global images.
- **src**: The core source code directory, subdivided by functional modules to improve readability and maintainability.
  - **apis**: Centralized management of all backend API requests for easy reuse and maintenance.
  - **assets**: Centralized storage of images, SVGs, and other static resources for unified management and referencing.
  - **components**: Encapsulated common UI components for high reusability and low coupling.
  - **hooks**: Custom React Hooks to extract common logic and improve code reuse.
  - **layouts**: Components related to page layouts, supporting multiple page structure switches.
  - **locale**: Internationalization resource files for multi-language support.
  - **mocks**: Local mock data and services for development and testing.
  - **pages**: Page-level components organized by routes for clear structure.
  - **store**: Global state management based on Zustand, simple and efficient.
  - **types**: TypeScript type definitions to enhance type safety and development experience.
  - **utils**: Common utility functions and classes for global use.
  - Other entry and configuration files to ensure a clear and well-defined project structure.

With this directory convention, you can quickly locate and manage various resources and code in the project, reducing maintenance costs and improving development efficiency. It is suitable for medium to large team collaboration and facilitates future feature expansion and technology upgrades.

## Directory Structure

```
├── .husky                     # Husky hook configuration directory
├── public                     # Public static resources
├── src                        # Source code directory
│   ├── apis                   # Backend API requests
│   ├── assets                 # Static resources (images, SVGs, etc.)
│   ├── components             # Common components
│   ├── hooks                  # Custom hooks
│   ├── layouts                # Page layout components
│   ├── locale                 # Internationalization resources
│   ├── mocks                  # Mock data and services
│   ├── pages                  # Page components
│   ├── store                  # Zustand state management
│   ├── types                  # TypeScript type definitions
│   ├── utils                  # Utility functions and classes
│   ├── loading.tsx            # Global Loading component
│   ├── main.tsx               # Application entry file
│   ├── routes.tsx             # Route and menu configuration
│   └── vite-env.d.ts          # Vite environment type declarations
├── .env                       # Environment variable configuration
├── .lintstagedrc              # lint-staged configuration
├── .prettierignore            # Prettier ignore file
├── .prettierrc                # Prettier code formatting configuration
├── commitlint.config.js       # Commit message linting configuration
├── eslint.config.js           # ESLint configuration
├── index.html                 # Project entry HTML
├── package.json               # Project dependencies and scripts
├── tailwind.css               # TailwindCSS global styles entry
├── tsconfig.app.json          # TS app configuration
├── tsconfig.json              # TS root configuration
├── tsconfig.node.json         # TS Node configuration
```

> Translate by ChartGPT
