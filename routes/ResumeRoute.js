const { getUserResume, updateUserResume, createResume, deleteResume } = require("../controllers/ResumeController");

const updateResumeSchema = {
    params: {
        type: 'object',
        properties: {
            resumeId: { type: 'string' }
        }
    },
    body: {
        type: 'object',
        properties: {
            personalInfo: { type: 'object' },
            education: { type: 'array' },
            experience: { type: 'array' },
            skills: { type: 'array' },
            certifications: { type: 'array' },
            projects: { type: 'array' },
            customSections: { type: 'array' }
        }
    }
};

const createResumeSchema = {
    body: {
        type: 'object',
        properties: {
            personalInfo: { type: 'object' },
            education: { type: 'array' },
            experience: { type: 'array' },
            skills: { type: 'array' },
            certifications: { type: 'array' },
            projects: { type: 'array' },
            customSections: { type: 'array' }
        }
    }
};

async function ResumeRoute(fastify, options) {

    fastify.addHook('preValidation', fastify.verifyJWT)

    fastify.get("/get", getUserResume)

    fastify.patch("/update/:resumeId", { schema: updateResumeSchema }, updateUserResume)

    fastify.post("/create", { schema: createResumeSchema }, createResume)

    fastify.delete("/delete/:resumeId", deleteResume)
}

module.exports = ResumeRoute;