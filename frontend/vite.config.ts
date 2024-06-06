import {defineConfig} from 'vite'
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
    server: {
        proxy: {
            '/api': {
                target:'http://localhost:3000',
                changeOrigin: true,
            }
        },
    },

})
