import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "node:path";
import {TanStackRouterVite} from "@tanstack/router-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(),TanStackRouterVite()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@server": path.resolve(__dirname, "../server"),
        },
    },
    server: {
        proxy: {
            '/api': {
                target:'http://127.0.0.1:3000',
                changeOrigin: true,
            }
        },
    },

})
