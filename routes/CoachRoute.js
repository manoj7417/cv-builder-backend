
const { registerCoach, coachLogin, setCoachAvailability, getAllCoaches, getCoachDetails, updateCoachDetails, forgotCoachPassword, resetCoachPassword, uploadCoachDocuments, authVerification, getBookings, createProgram, getAllPrograms, getCoachPrograms, updateProgram, deleteProgram, getCoachProgramById, editProgramByadmin, getCoachProgramByprogramId, getAllCoachPrograms, getCompletedProgramBookings, CoachgoogleLogin, syncCalendar, updateCoachDateOverride } = require("../controllers/CoachController");


async function CoachRoute(fastify, options) {
    fastify.post('/register', registerCoach)

    fastify.post('/login', coachLogin)

    fastify.post("/auth", authVerification)

    fastify.patch("/add-documents", { preHandler: fastify.coachAuth }, uploadCoachDocuments)

    fastify.patch("/set-availability", {
        preHandler: fastify.coachAuth,
    }, setCoachAvailability)


    fastify.get('/all', getAllCoaches)

    fastify.get('/getcoachbyId/:coachId', getCoachDetails)

    fastify.patch("/update", {
        preHandler: fastify.coachAuth,
    }, updateCoachDetails)

    fastify.post("/forgot-password", forgotCoachPassword)

    fastify.post("/reset-password", resetCoachPassword)

    fastify.get("/bookings", { preHandler: fastify.coachAuth }, getBookings)

    fastify.post("/create-program", { preHandler: fastify.coachAuth }, createProgram)

    fastify.get("/programs", getAllPrograms)  //use this one to get all program details for admin dashboards

    fastify.get("/programByCoachId", { preHandler: fastify.coachAuth }, getCoachPrograms)

    fastify.get("/getAllcoachPrograms", { preHandler: fastify.coachAuth }, getAllCoachPrograms)

    fastify.get("/programByCoachId/:coachId", getCoachProgramById)

    fastify.get("/programByProgramId/:programId", { preHandler: fastify.coachAuth }, getCoachProgramByprogramId)

    fastify.put("/updateProgram/:programId", { preHandler: fastify.coachAuth }, updateProgram)

    fastify.put("/editProgramByAdmin/:coachId", editProgramByadmin) // use this one to approve the program

    fastify.delete("/deleteProgram/:programId", { preHandler: fastify.coachAuth }, deleteProgram)

    fastify.get('/getProgramBookings', { preHandler: fastify.coachAuth }, getCompletedProgramBookings)

    fastify.post("/googleLogin", CoachgoogleLogin)

    fastify.post("/syncCalendar", { preHandler: fastify.coachAuth }, syncCalendar)

    fastify.patch("/updateDateOverrides", { preHandler: fastify.coachAuth }, updateCoachDateOverride)
}

module.exports = CoachRoute;