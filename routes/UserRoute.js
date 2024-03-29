const { register, login, forgetPassword, resetPassword } = require("../controllers/UserController")


async function UserRoute(fastify, options) {

    fastify.post("/register", register)

    fastify.post("/login", login)

    fastify.post("/forgetPassword", forgetPassword)

    fastify.post("/resetPassword", resetPassword
    )
}

module.exports = UserRoute