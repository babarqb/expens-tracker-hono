import {Hono} from 'hono';
import {logger} from 'hono/logger';
import {expensesRoutes} from "./routes/expenses.ts";
import {serveStatic} from "hono/bun";
import {authRoutes} from "./routes/auth.ts";

const app = new Hono();
app.use('*', serveStatic({root: './frontend/dist'}));
app.use('*', serveStatic({root: './frontend/dist/index.html'}));
app.use('*', logger());
const apiRoutes = app.basePath('/api')
    .route('/expenses', expensesRoutes)
    .route('/', authRoutes);

export default app
export type ApiRoutes = typeof apiRoutes;
