const DBConnection = require('./config/db')
const { apiKeyAuth } = require('./middlewares/auth')
const verifyJWT = require('./middlewares/verifyJwt')
const ResumeRoute = require('./routes/ResumeRoute')
const UserRoute = require('./routes/UserRoute')
// const swagger = require('@fastify/swagger')
const cors = require('@fastify/cors')

require('dotenv').config()


const fastify = require('fastify')({
    logger: {
        transport: {
            target: "pino-pretty"
        }
    }
})

fastify.register(require('@fastify/swagger'), {
    openapi: {
        openapi: '3.0.0',
        info: {
            title: 'Test swagger',
            description: 'Testing the Fastify swagger API',
            version: '0.1.0'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}/docs`,
                description: 'Development server'
            }
        ],
        tags: [
            { name: 'user', description: 'User related end-points' },
            { name: 'code', description: 'Code related end-points' }
        ],
        components: {
            securitySchemes: {
                apiKey: {
                    type: 'apiKey',
                    name: 'apiKey',
                    in: 'header'
                }
            }
        },
        externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
        }
    }
})

// cors 
fastify.register(cors, {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allowedHeaders: ["GET", "POST", "PUT", "PATCH", "DELETE"]
})
// verifying JWT
fastify.decorate('verifyJWT', verifyJWT)

// check apikey on each request
// fastify.addHook("onRequest", apiKeyAuth)
// Routes 

//userRoute
fastify.register(UserRoute, { prefix: '/api/user' })
//UserResume Route
fastify.register(ResumeRoute, { prefix: "/api/resume" })



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
