const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.ACCESS_TOKEN_SECRET

async function apiKeyAuth(request, reply) {
    const apiKey = request.headers['x-api-key'];
    const knownKey = process.env.APIKEY

    if (!apiKey || apiKey !== knownKey) {
        return reply.code(401).send({ error: "Unauthorized" })
    }
}


const verifyJWT = async (fastify, options, done) => {
    console.log("Requesting")
    try {
        const token = request.headers?.authorization?.split(" ")[1]
        
        if (!token) {
            return reply.status(401).send({
                status: "FAILURE",
                error: "Unauthorized"
            })
        }
        const decoded = await jwt.verify(token, secret)
        request.userID = decoded._id
    } catch (err) {
        reply.code(401).send({ message: 'Unauthorized' });

    };

    done();
};

module.exports = { apiKeyAuth, verifyJWT }