import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});
// or
// const client = new Client({
//     host: "127.0.0.1",
//     port: 5432,
//     user: "postgres",
//     password: "password",
//     database: "db_name",
// });
await client.connect();
export const db = drizzle(client);
