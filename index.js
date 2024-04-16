const DBConnection = require('./config/db')
const { apiKeyAuth } = require('./middlewares/auth')
const verifyJWT = require('./middlewares/verifyJwt')
const UserRoute = require('./routes/UserRoute')
const cors = require('@fastify/cors')

require('dotenv').config()

const fastify = require('fastify')({
    // logger: {
    //     transport: {
    //         target: "pino-pretty"
    //     }
    // }
    logger : false
})

fastify.register(cors, {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allowedHeaders: ["Content-Type", "Accept", "Authorization", "x-api-key"], // Include 'x-api-key' header
    credentials: true
});



fastify.decorate('verifyJWT', verifyJWT)
fastify.addHook("onRequest", apiKeyAuth)
fastify.register(UserRoute, { prefix: '/api/user' })

const start = async () => {
    try {
        await DBConnection()
        await fastify.listen({ port: process.env.PORT || 8080 })
        fastify.log.info(`Server started on PORT ${fastify.server.address().port}`)
    } catch (error) {
        console.log(error)
        fastify.log.info("Server connection error")
    }
}

start()
