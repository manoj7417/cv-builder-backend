const DBConnection = require('./config/db')
const { apiKeyAuth } = require('./middlewares/auth')
const roleCheck = require('./middlewares/RoleBasedAccessControl')
const verifyJWT = require('./middlewares/verifyJwt')
const ResumeRoute = require('./routes/ResumeRoute')
const UserRoute = require('./routes/UserRoute')
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
    allowedHeaders: ["Content-Type", "Accept", "Authorization", "x-api-key"], // Include 'x-api-key' header
    credentials: true
});



fastify.decorate('verifyJWT', verifyJWT)

fastify.decorate('roleCheck', roleCheck)

// check apikey on each request
fastify.addHook("onRequest", apiKeyAuth)
// Routes 

//userRoute
fastify.register(UserRoute, { prefix: '/api/user' })

fastify.register(ResumeRoute, { prefix: '/api/resume' })


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
