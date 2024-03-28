const { register, login, resetPassword } = require("../controllers/UserController")
const { verifyJWT } = require("../middlewares/auth")

async function UserRoute(fastify, options) {

    fastify.post("/register", register)

    fastify.post("/login", login)

    fastify.route({
        method: "POST",
        url: "/resetPassword",
        preHandler: verifyJWT,
        handler: resetPassword
    })
}

module.exports = UserRoute