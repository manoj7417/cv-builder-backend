
require('dotenv').config()


async function apiKeyAuth(request, reply) {
    const apiKey = request.headers['x-api-key'];
    const knownKey = process.env.APIKEY

    if (!apiKey || apiKey !== knownKey) {
        return reply.code(401).send({ error: "Unauthorized" })
    }
}




module.exports = { apiKeyAuth }