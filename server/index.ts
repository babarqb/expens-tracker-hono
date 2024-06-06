import {Hono} from 'hono';
import {logger} from 'hono/logger';
import expensesRoutes from "./routes/expenses.ts";
import {serveStatic} from "hono/bun";
const app = new Hono();

app.use('*',serveStatic({root:'./frontend/dist'}));
app.use('*',serveStatic({root:'./frontend/dist/index.html'}));
// app.use('*',logger());
app.route('/api/expenses',expensesRoutes)

export default app
