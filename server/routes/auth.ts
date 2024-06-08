import {Hono} from 'hono';
import {kindeClient, sessionManager} from "../kinde.ts";


export const authRoutes = new Hono()
    .get("/login", async (c) => {
        const loginUrl = await kindeClient.login(sessionManager(c));
        return c.redirect(loginUrl.toString());
    }).get("/register", async (c) => {
        const registerUrl = await kindeClient.register(sessionManager(c));
        return c.redirect(registerUrl.toString());
    }).get("/callback", async (c) => {
        const url = new URL(c.req.url);
        await kindeClient.handleRedirectToApp(sessionManager(c), url);
        return c.redirect("/");
    }).get("/logout", async (c) => {
  const logoutUrl = await kindeClient.logout(sessionManager(c));
  return c.redirect(logoutUrl.toString());
}).get("/me",async (c) => {
        const isAuthenticated = await kindeClient.isAuthenticated(sessionManager(c)); // Boolean: true or false
        if (isAuthenticated) {
            return c.json({isAuthenticated});
        } else {
            return c.json({message:"user is not authenticated"});
        }
    });
