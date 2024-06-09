/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as AuthenticatedIndexImport } from './routes/_authenticated/index'
import { Route as AuthenticatedProfileImport } from './routes/_authenticated/profile'
import { Route as AuthenticatedAboutImport } from './routes/_authenticated/about'

// Create Virtual Routes

const authSignupLazyImport = createFileRoute('/(auth)/signup')()
const authLoginLazyImport = createFileRoute('/(auth)/login')()
const AuthenticatedExpensesIndexLazyImport = createFileRoute(
  '/_authenticated/expenses/',
)()
const AuthenticatedExpensesCreateLazyImport = createFileRoute(
  '/_authenticated/expenses/create',
)()

// Create/Update Routes

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedIndexRoute = AuthenticatedIndexImport.update({
  path: '/',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const authSignupLazyRoute = authSignupLazyImport
  .update({
    path: '/signup',
    getParentRoute: () => rootRoute,
  } as any)
  .lazy(() => import('./routes/(auth)/signup.lazy').then((d) => d.Route))

const authLoginLazyRoute = authLoginLazyImport
  .update({
    path: '/login',
    getParentRoute: () => rootRoute,
  } as any)
  .lazy(() => import('./routes/(auth)/login.lazy').then((d) => d.Route))

const AuthenticatedProfileRoute = AuthenticatedProfileImport.update({
  path: '/profile',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedAboutRoute = AuthenticatedAboutImport.update({
  path: '/about',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedExpensesIndexLazyRoute =
  AuthenticatedExpensesIndexLazyImport.update({
    path: '/expenses/',
    getParentRoute: () => AuthenticatedRoute,
  } as any).lazy(() =>
    import('./routes/_authenticated/expenses/index.lazy').then((d) => d.Route),
  )

const AuthenticatedExpensesCreateLazyRoute =
  AuthenticatedExpensesCreateLazyImport.update({
    path: '/expenses/create',
    getParentRoute: () => AuthenticatedRoute,
  } as any).lazy(() =>
    import('./routes/_authenticated/expenses/create.lazy').then((d) => d.Route),
  )

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/about': {
      id: '/_authenticated/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AuthenticatedAboutImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/profile': {
      id: '/_authenticated/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof AuthenticatedProfileImport
      parentRoute: typeof AuthenticatedImport
    }
    '/(auth)/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof authLoginLazyImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/signup': {
      id: '/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof authSignupLazyImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/': {
      id: '/_authenticated/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedIndexImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/expenses/create': {
      id: '/_authenticated/expenses/create'
      path: '/expenses/create'
      fullPath: '/expenses/create'
      preLoaderRoute: typeof AuthenticatedExpensesCreateLazyImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/expenses/': {
      id: '/_authenticated/expenses/'
      path: '/expenses'
      fullPath: '/expenses'
      preLoaderRoute: typeof AuthenticatedExpensesIndexLazyImport
      parentRoute: typeof AuthenticatedImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  AuthenticatedRoute: AuthenticatedRoute.addChildren({
    AuthenticatedAboutRoute,
    AuthenticatedProfileRoute,
    AuthenticatedIndexRoute,
    AuthenticatedExpensesCreateLazyRoute,
    AuthenticatedExpensesIndexLazyRoute,
  }),
  authLoginLazyRoute,
  authSignupLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authenticated",
        "/login",
        "/signup"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/about",
        "/_authenticated/profile",
        "/_authenticated/",
        "/_authenticated/expenses/create",
        "/_authenticated/expenses/"
      ]
    },
    "/_authenticated/about": {
      "filePath": "_authenticated/about.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/profile": {
      "filePath": "_authenticated/profile.tsx",
      "parent": "/_authenticated"
    },
    "/login": {
      "filePath": "(auth)/login.lazy.tsx"
    },
    "/signup": {
      "filePath": "(auth)/signup.lazy.tsx"
    },
    "/_authenticated/": {
      "filePath": "_authenticated/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/expenses/create": {
      "filePath": "_authenticated/expenses/create.lazy.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/expenses/": {
      "filePath": "_authenticated/expenses/index.lazy.tsx",
      "parent": "/_authenticated"
    }
  }
}
ROUTE_MANIFEST_END */
