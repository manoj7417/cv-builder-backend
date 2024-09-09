
const { registerCoach, coachLogin, setCoachAvailability, getAllCoaches, getCoachDetails, updateCoachDetails, forgotCoachPassword, resetCoachPassword, uploadCoachDocuments } = require("../controllers/CoachController");


async function CoachRoute(fastify, options) {
    fastify.post('/register', registerCoach)

    fastify.post('/login', coachLogin)

    fastify.patch("/add-documents", {preHandler : fastify.coachAuth},uploadCoachDocuments)

    fastify.post("/set-availability", {
        preHandler: fastify.coachAuth,
    }, setCoachAvailability)

    fastify.get('/all', getAllCoaches)

    fastify.get('/getcoachbyId/:coachId', getCoachDetails)

    fastify.patch("/update", updateCoachDetails)

    fastify.post("/forgot-password",forgotCoachPassword)

    fastify.post("/reset-password",resetCoachPassword)
}

module.exports = CoachRoute;