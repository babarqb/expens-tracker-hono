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
import {Hono} from 'hono';
const app = new Hono();
app.get('/',c=>{
  return c.json({message:"hellow hono"})
});
export default app
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
type Expense = {
    id: number,
    title: string,
    amount: number
}
const fakeExpenses: Expense[] = [
    {id: 1, title: 'Rent', amount: 1000},
    {id: 2, title: 'Car Payment', amount: 400},
    {id: 3, title: 'Groceries', amount: 200},
]
const expensesRoutes = new Hono()
    .get('/', (c) => {
        return c.json({expenses: fakeExpenses})
    })
    .post('/',  async (c) => {
        const {title,amount} = await c.req.json()
        const expense =  {id: fakeExpenses.length + 1, title, amount}
        fakeExpenses.push(expense)
        return c.json(expense)
    })
    .put('/:id',async (c) => {
        const id = parseInt(c.req.param("id"));
        const index = fakeExpenses.findIndex(e => e.id === id)
        if (index === -1) {
            return c.json({message: 'Expense not found'})
        }
        const {title, amount} = await c.req.json()
        // update fakeExpenses
        fakeExpenses[index] = {...fakeExpenses[index], title, amount}
        return c.json(fakeExpenses[index])
    })
    .delete('/:id', (c) => {
        const id = parseInt(c.req.param("id"));
        const expense = fakeExpenses.find(e => e.id === id)
        if(!expense) {
            return c.json({message: 'Expense not found'})
        }
        fakeExpenses.splice(fakeExpenses.indexOf(expense), 1)
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
                target:'http://localhost:3000',
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
## Tanstack React Query
## Tanstack Router
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
