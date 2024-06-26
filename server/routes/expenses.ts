import {Hono} from 'hono';
import {z} from 'zod';
import {zValidator} from "@hono/zod-validator";
import {db} from '../db';
import {expenses as expenseTable} from "../db/schema/expenses";
import {getUser} from "../kinde";
import {eq} from "drizzle-orm";

const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(3).max(255),
    amount: z.string()
})

type Expense = z.infer<typeof expenseSchema>
const createPostSchema = expenseSchema.omit({id: true})

const fakeExpenses: Expense[] = [
    {id: 1, title: 'Rent', amount: "1000"},
    {id: 2, title: 'Car Payment', amount: "400"},
    {id: 3, title: 'Groceries', amount: "200"},
]
export const expensesRoutes = new Hono()
    .get('/', getUser, async (c) => {
        const user = c.var.user;
        const expenses = await db.select().from(expenseTable)
            .where(eq(expenseTable.userId, user.id));
        return c.json({expenses})
    })
    .get('/total-spent', (c) => {
        const total = fakeExpenses.reduce((acc, expense) => acc + +expense.amount, 0)
        return c.json({total});
    })
    .get('/:id{[0-9]}', (c) => {
        const id = Number.parseInt(c.req.param("id"));
        const expense = fakeExpenses.find(e => e.id === id)
        if (!expense) {
            // return c.json({message: 'Expense not found'})
            return c.notFound()
        }
        return c.json(expense)
    })
    .post('/', getUser, zValidator("json", createPostSchema), async (c) => {
        const expense = c.req.valid("json");
        const result = await db.insert(expenseTable)
            .values({...expense, userId: c.var.user.id}).returning();
        c.status(201)
        return c.json({result})
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
