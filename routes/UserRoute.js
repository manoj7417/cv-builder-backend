const { register, login, forgetPassword, resetPassword } = require("../controllers/UserController");

const registerSchema = {
    body: {
        type: 'object',
        required: ['fullname', 'email', 'password'],
        properties: {
            fullname: { type: 'string', maxLength: 100 },
            email: { type: 'string', format: 'email', maxLength: 255 },
            password: { type: 'string', minLength: 8, maxLength: 50, errorMessage: "Password must have 8 characters" }
        }
    }
};


async function UserRoute(fastify, options) {

    fastify.post("/register", { schema: registerSchema }, register)

    fastify.post("/login", login)

    fastify.post("/forgetPassword", forgetPassword)

    fastify.post("/resetPassword", resetPassword
    )
}

module.exports = UserRoute