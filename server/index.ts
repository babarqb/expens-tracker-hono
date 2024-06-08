import app from './app'
const server = Bun.serve({
    port: process.env.PORT || 3000,
    hostname:'0.0.0.0',
    fetch: app.fetch
})
console.log('Server running on port',server.port)
