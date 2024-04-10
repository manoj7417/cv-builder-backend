const { register, login, forgetPassword, resetPassword } = require("../controllers/UserController");

const registerSchema = {
    body: {
        type: 'object',
        required: ['fullname', 'email', 'password'],
        properties: {
            fullname: { type: 'string', maxLength: 100 },
            email: { type: 'string', format: 'email', maxLength: 255 },
            password: { type: 'string', minLength: 8, maxLength: 100 }
        }
    }
};

const loginSchema = {
    body: {
        type: "object",
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: "email", maxLength: 255 },
            password: { type: 'string', minLength: 8, maxLength: 100 }
        }
    }
}

const forgetPasswordSchema = {
    body: {
        type: "object",
        required: ['email'],
        properties: {
            email: { type: 'string', format: "email", maxLength: 255 }
        }
    }
}

const resetPasswordSchema = {
    body: {
        type: "object",
        required: ['email', 'password'],
        properties: {
            token: { type: 'string', format: "email", maxLength: 500 },
            newPassword: { type: 'string', minLength: 8, maxLength: 100 }
        }
    }
}


async function UserRoute(fastify, options) {

    fastify.post("/register", { schema: registerSchema }, register)

    fastify.post("/login", { schema: loginSchema }, login)

    fastify.post("/forgetPassword", { schema: forgetPasswordSchema }, forgetPassword)

    fastify.post("/resetPassword", { schema: resetPasswordSchema }, resetPassword)
}

module.exports = UserRoute