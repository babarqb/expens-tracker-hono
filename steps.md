## Setup Bun and Hono
~~~
bun init
~~~
1. Choose the default options
2. add scripts in package.json
3. "start": "bun run index.ts"
4. "dev": "bun run index.ts --watch"
5. add hono
~~~
bun add hono
~~~
./index.ts
~~~
import app from './app'
const server = Bun.serve({
    port: process.env.PORT || 3000,
    hostname:'0.0.0.0',
    fetch: app.fetch
})
console.log('Server running on port',server.port)
~~~
app.ts
~~~
import {Hono} from 'hono';
import {logger} from 'hono/logger';
import expensesRoutes from "./routes/expenses.ts";
import {serveStatic} from "hono/bun";
const app = new Hono();
app.use('*',serveStatic({root:'./frontend/dist'}));
app.use('*',serveStatic({root:'./frontend/dist/index.html'}));
app.use('*',logger());
const apiRoutes = app.basePath('/api').route('/expenses',expensesRoutes)
export default app
export type ApiRoutes = typeof apiRoutes;
~~~
#### read docs of hono from [Hono Docs](https://hono.dev)
#### play with hono middleware
~~~
import {Hono} from 'hono';
import {logger} from 'hono/logger';
const app = new Hono();
app.use('*',logger());
app.get('/',(c) => {
  return c.json({message:"hellow hono"})
});
export default app
~~~
#### console output with logs
~~~
Started server http://localhost:3000
<-- GET /
--> GET / 200 5ms
~~~
## Adding Routes
1. create a new file in routes folder routes
2. add a new file in above folder name expenses.ts
~~~
import {Hono} from 'hono';
import {z} from 'zod';
import {zValidator} from "@hono/zod-validator";

const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(3).max(255),
    amount: z.number().int().positive()
})

type Expense = z.infer<typeof expenseSchema>
const createPostSchema = expenseSchema.omit({id: true})

const fakeExpenses: Expense[] = [
    {id: 1, title: 'Rent', amount: 1000},
    {id: 2, title: 'Car Payment', amount: 400},
    {id: 3, title: 'Groceries', amount: 200},
]
const expensesRoutes = new Hono()
    .get('/', (c) => {
        return c.json({expenses: fakeExpenses})
    })
     .get('/total-spent', (c) => {
        const total = fakeExpenses.reduce((acc, expense) => acc + expense.amount, 0)
        return c.json({total});
    })
    .get('/:id{[0-9]}', (c) => {
        const id = Number.parseInt(c.req.param("id"));
        const expense = fakeExpenses.find(e => e.id === id)
        if(!expense) {
            // return c.json({message: 'Expense not found'})
            return c.notFound()
        }
        return c.json(expense)
    })
    .post('/', zValidator("json", createPostSchema), async (c) => {
        const expense = c.req.valid("json");
        const id = fakeExpenses.length +1;
        fakeExpenses.push({id,...expense})
        c.status(201)
        return c.json(fakeExpenses[id - 1])
    })
    .put('/:id{[0-9]}', zValidator("json", createPostSchema), async (c) => {
        const id = Number.parseInt(c.req.param("id"));
        const index = fakeExpenses.findIndex(e => e.id === id);
        if (index === -1) {
            return c.notFound()
        }
        const {title, amount} = c.req.valid("json");
        fakeExpenses[index] = {...fakeExpenses[index], title, amount}
        return c.json(fakeExpenses[index])
    })
    .delete('/:id{[0-9]}', (c) => {
        const id = parseInt(c.req.param("id"));
        const index = fakeExpenses.findIndex(e => e.id === id)
        if (index === -1) {
            return c.notFound()
        }
        fakeExpenses.splice(index, 1)
        return c.json({message: 'Expense deleted'})
    })
;
export default expensesRoutes
~~~
3. import the above file in index.ts
~~~
import {Hono} from 'hono';
import {logger} from 'hono/logger';
import expensesRoutes from "./routes/expenses.ts";
const app = new Hono();
app.use('*',logger());
app.get('/',(c) => {
  return c.json({message:"hello hono"})
});
app.route('/api/expenses',expensesRoutes)
export default app
~~~
## Zod HTTP Validation
Zod is type check library for JavaScript and TypeScript
~~~
import {z} from 'zod';
//create zod schema
const createPostSchema = z.object({
    title: z.string().min(3).max(255),
    amount: z.number().int().positive()
})
// validate the request body in post route
  .post('/', async (c) => {
        const data = await c.req.json();
        const {title, amount} = createPostSchema.parse(data);
        const newExpense = {id: fakeExpenses.length + 1, title, amount}
        fakeExpenses.push(newExpense)
        return c.json(newExpense)
    })
~~~
## Hono Zod Validator
hono has its on zod validator middleware
~~~
bun install @hono/zod-validator
~~~
~~~
import {zValidator} from 'hono-zod';

// use zValidator("json", schema) to validate the request body in post route
   .post('/', zValidator("json", createPostSchema), async (c) => {
        const {title, amount} = c.req.valid("json");
        const newExpense = {id: fakeExpenses.length + 1, title, amount}
        fakeExpenses.push(newExpense)
        return c.json(newExpense)
    })
~~~
## Dynamic Path Params
hono allow us to pass dynamic path params with using regex
to make sure that the id is a number or not
~~~
   .get('/:id{[0-9]', (c) => {
        const id = Number.parseInt(c.req.param("id"));
        return c.json({expenses: fakeExpenses})
    })
~~~
## Zod Improvements
~~~
const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(3).max(255),
    amount: z.number().int().positive()
})
type Expense = z.infer<typeof expenseSchema>
const createPostSchema = expenseSchema.omit({id: true})
~~~
## Setup React App with Vite
create folder name server and put index.ts and routes folder into it and update package.json scripts
~~~
 "scripts": {
    "start": "bun server/index.ts",
    "dev": "bun --watch server/index.ts"
  },
~~~
1. install react app with vite
~~~
bun create vite@latest frontend
~~~ 
2. install dependencies
3. update package.json scripts
~~~
  "scripts": {
    "dev": "bunx -bun vite",
    "build": "bunx --bun vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "bunx -bun vite preview"
  },
~~~
## Install Tailwind
install tailwind css
~~~
bun install -D tailwindcss postcss autoprefixer
bunx tailwindcss init -p
//add index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
~~~
## Why Tailwind?
## Shadcn
add shadcn config in tailwind.config.js
1. set tsconfig compilerOptions in frontend folder
~~~
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    // ...
  }
}
~~~
2. update vite.config.ts
~~~
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "node:path";
// import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // "@": path.resolve(import.meta.dir, "./src"),
    },
  },
})
~~~
3. install shadcn
~~~
bunx --bun shadcn-ui@latest init
porcej  setup 
Would you like to use TypeScript (recommended)? no / yes
Which style would you like to use? › Default
Which color would you like to use as base color? › Slate
Where is your global CSS file? › › src/index.css
Do you want to use CSS variables for colors? › no / yes
Where is your tailwind.config.js located? › tailwind.config.js
Configure the import alias for components: › @/components
Configure the import alias for utils: › @/lib/utils
Are you using React Server Components? › no / yes (no)
~~~
4. add component form shadcn
~~~
bunx --bun shadcn-ui@latest add button

note* for dark mode hack just add index.html body tag class="dark"
annd also add 'index.html' in tailwind.config.js content 
~~~
## HTTP Requests
when we call the api from react app we use fetch api it through origin policy error
for that error we have to set proxy in frontent folder vite.config.js
for doing this we call or backend server in frontent server
1. ## React Proxy 
~~~
   server: {
        proxy: {
            '/api': {
                target:'http://127.0.0.1:3000',
                changeOrigin: true,
            }
        },
    },
~~~
2. ## Hone static file setup
add hono static middleware
~~~
import {Hono} from 'hono';
import {logger} from 'hono/logger';
import expensesRoutes from "./routes/expenses.ts";
import {serveStatic} from "hono/bun";
const app = new Hono();

app.use('*',serveStatic({root:'./frontend/dist'}));
app.use('*',serveStatic({root:'./frontend/dist/index.html'}));
app.use('*',logger());
app.route('/api/expenses',expensesRoutes)
export default app
~~~


## Building the App
## Deploying the App (fly.io)
## Hono RPC
for type save our routes we use hono rpc
change some hono app routes and export routs type from backend
~~~
const apiRoutes = app.basePath('/api').route('/expenses',expensesRoutes)
export type ApiRoutes = typeof apiRoutes;
~~~
now in frontend where we want to access this routes we import the type
~~~
import {hc} from "hono/client"
import {type ApiRoutes} from "../../server/app";
const client = hc<ApiRoutes>('/')
//use client to call the api

    useEffect(() => {
        async function fetchExpenses() {
            // const res = await fetch('/api/expenses/total-spents');
            const res = await client.api.expenses['total-spents'].$get();
            const {total} = await res.json();
            setTotalSpent(total)
        }
        fetchExpenses();
    }, []);
~~~
for best practice we use hono rpc logic in sperate file
create a file in lib/api.ts
~~~
import {hc} from "hono/client"
import {type ApiRoutes} from "../../../server/app";
const client = hc<ApiRoutes>('/')
export const api = client.api;
//
//and also change frontend call
import {api} from "@/lib/api";
function App() {
    const [totalSpent, setTotalSpent] = useState(0);
    useEffect(() => {
        async function fetchExpenses() {
            const res = await api.expenses['total-spent'].$get();
            const {total} = await res.json();
            setTotalSpent(total)
        }
        fetchExpenses();
    }, []);
~~~
## Add @server
~~~
import {type ApiRoutes} from "../../server/app";
to
import {type ApiRoutes} from "@server/app";
1. we need to add path in tsconfig.json
  "paths": {
      "@/*": [
        "./src/*"
      ],
      "@server/*": ["../server/*"]
    },
 2. we need to add alias in vite.config.ts
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@server": path.resolve(__dirname, "../server"),
    },
  },
~~~
## Tanstack React Query
add @tanstack query
~~~
bun add @tanstack/react-query
~~~
configer tanstack query in main.tsx
~~~
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App/>
        </QueryClientProvider>
    </React.StrictMode>,
)
~~~
use tanstack query in app.tsx
~~~
import './App.css'
import {
    Card,
    CardContent, CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {api} from "@/lib/api";
import {useQuery} from "@tanstack/react-query";

async function getTotalSpent() {
    const res = await api.expenses['total-spent'].$get();
    if (!res.ok) {
        throw new Error('Failed to fetch total spent')
    }
    const data = await res.json();
    return data;
}

function App() {
    // const {isPending,isFetching,data, error,isLoading} = useQuery('get-total-spent', getTotalSpent)
    const {isPending,data} = useQuery({queryKey: ['get-total-spent'], queryFn: getTotalSpent})
    return (
        <>
            <Card className="w-[350px] m-auto">
                <CardHeader>
                    <CardTitle>Total Expenses</CardTitle>
                    <CardDescription>The total amount you've spent</CardDescription>
                </CardHeader>
                <CardContent>{isPending ? '....': data && data.total}</CardContent>
            </Card>
        </>
    )
}
export default App
~~~

## Tanstack Router
add tanstack router vite plugin 
~~~
bun install @tanstack/react-router
~~~
If you're feeling impatient and prefer to skip all of our wonderful documentation, here is the bare minimum to get going with TanStack Router using both file-based route generation and code-based route configuration:
~~~
bun install -D @tanstack/router-vite-plugin @tanstack/router-devtools
change vite.config.ts
// vite.config.ts
import { defineConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // ...,
    TanStackRouterVite(),
  ],
})
~~~
create a files in src/routes
src/routes/__root.tsx
~~~
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
~~~
src/routes/index.lazy.tsx
~~~
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  )
}
~~~
src/routes/about.lazy.tsx
~~~
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/about')({
  component: About,
})

function About() {
  return <div className="p-2">Hello from About!</div>
}
~~~
src/main.tsx
~~~
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}
~~~
Signle file tanstack router example
~~~
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    )
  },
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function About() {
    return <div className="p-2">Hello from About!</div>
  },
})

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}
Using File-Based Route Configuration
If you are working with this pattern you should change the id of the root <div> on your index.html file to <div id='app'></div>

If you glossed over these examples or didn't understand something, we don't blame you, because there's so much more to learn to really take advantage of TanStack Router! Let's move on.
[tanstack](https://tanstack.com/router/latest/docs/framework/react/quick-start)
~~~

## Get All Expenses
## Create New Expense
## Tanstack Form
## Kinde Auth
## Auth Middleware
## Authorized Routes
## Deploy Kinde
## Database
## Drizzle ORM
## Setup Neon
## Tanstack Form Zod
## Drizzle Zod
## Created At & Calendar
## UI Update
## Caching and Optimistic Update
## Delete Expense
