const { verifyCoach, auth } = require("../controllers/AdminController");

async function AdminRoute(fastify, options) {


    fastify.addHook('preHandler', fastify.verifyJWT);

    fastify.patch("/verifyCoach/:coachId", { preHandler: fastify.roleCheck(['admin']) }, verifyCoach)

    fastify.get("/auth", { preHandler: fastify.roleCheck(['admin']) }, auth)
}

module.exports = AdminRoute;