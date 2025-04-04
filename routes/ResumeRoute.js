const { getUserResume, updateUserResume, createResume, deleteResume, getAllResumes, createNewJobResume, updateUserResumeTitle, createPrefilledResume } = require("../controllers/ResumeController");


async function ResumeRoute(fastify, options) {
    // check JWT token and validate it 
    fastify.addHook('preValidation', fastify.verifyJWT)

    // get the user resume based on the resumeId
    fastify.get("/get/:resumeId", getUserResume)


    //get all resumes of the user 
    fastify.get("/allResume", getAllResumes)

    // udpate the resume fields of the user based on the resumeId 
    fastify.patch("/update/:resumeId", updateUserResume)

    // udpate the resume fields of the user based on the resumeId 
    fastify.patch("/updateTitle/:resumeId", updateUserResumeTitle)

    // create a new resume for the user
    fastify.post("/create", createResume)

    fastify.post("/create/prefilledResume", createPrefilledResume)

    // delete the resume of the user based on the resumeId
    fastify.delete("/delete/:resumeId", deleteResume)

    fastify.post('/jobResume', createNewJobResume
    )

}

module.exports = ResumeRoute;