const { dummyData } = require("../constants/resumeDummyData");
const { Resume } = require("../models/ResumeModel");
const { User } = require("../models/userModel")
const { v4: uuidv4 } = require('uuid');

// get the user resume based on the resumeId
const getUserResume = async (request, reply) => {
    const userId = request.user._id
    const { resumeId } = request.params;
    try {
        const userResume = await Resume.find({ _id: resumeId, userId })
        if (!userResume) {
            reply.code(404).send({
                status: "FAILURE",
                error: "User Resume not found"
            })
        }
        reply.code(200).send({
            status: "SUCCESS",
            message: "User resume data",
            data: userResume
        })
    } catch (error) {
        console.log(error)
        reply.code(500).send({
            status: "FAILURE",
            error: error.message || "Internal server error"
        })
    }
}

//get all resumes of the user 
const getAllResumes = async (request, reply) => {
    const userId = request.user._id;
    const { status } = request.query;
    const validStatus = ['inProgress', 'completed', 'downloaded'];

    if (status && !validStatus.includes(status)) {
        return reply.code(400).send({
            status: "FAILURE",
            error: "Invalid status value"
        });
    }
    try {
        let query = { userId };
        if (status) {
            query.status = status;
        }
        const resumes = await Resume.find(query).sort({ createdAt: -1 })
        if (resumes.length === 0) {
            return reply.code(404).send({
                status: "FAILURE",
                error: "No user resumes found"
            })
        }

        reply.code(200).send({
            status: "SUCCESS",
            message: "User resumes data",
            data: resumes
        })
    } catch (error) {
        console.log(error)
        reply.code(500).send({
            status: "FAILURE",
            error: error.message || "Internal server error"
        })
    }
}


// udpate the resume fields of the user based on the resumeId 
const updateUserResume = async (request, reply) => {
    const { resumeId } = request.params;
    const userId = request.user._id;
    const { data } = request.body;
    try {
        if (!resumeId) {
            return reply.code(400).send({
                status: "FAILURE",
                error: "Resume Id not found"
            })
        }
        const resume = await Resume.findOne({ _id: resumeId, userId })
        if (!resume) {
            return reply.code(404).send({ status: "FAILURE", error: 'Resume not found' });
        }

        resume.data = data
        resume.updatedAt = new Date()
        await resume.save()
        return reply.code(200).send({
            status: "SUCCESS",
            message: "Resume udpated successfully", data: resume
        })
    } catch (error) {
        console.log(error)
        return reply.code(500).send({
            status: "FAILURE",
            error: error.message || "Internal server error"
        })
    }
}


const updateUserResumeTitle = async (req, res) => {
    const { resumeId } = req.params;
    const userId = req.user._id;
    const { title } = req.body;
    try {
        if (!resumeId) {
            return res.status(400).send({
                status: "FAILURE",
                error: "Resume Id not found"
            })
        }
        const resume = await Resume.findOne({ _id: resumeId, userId })
        if (!resume) {
            return res.status(404).send({ status: "FAILURE", error: 'Resume not found' });
        }
        resume.title = title
        resume.updatedAt = new Date()
        await resume.save()
        return res.status(200).send({
            status: "SUCCESS",
            message: "Resume udpated successfully", data: resume
        })
    } catch (e) {
        console.error(e)
        return res.status(500).send({
            status: "FAILURE",
            error: e.message || "Internal server error"
        })
    }
}
// create a new resume for the user
const createResume = async (request, reply) => {
    const userId = request.user._id;
    const { template } = request.body;
    try {
        const title = `Untitled` + uuidv4();
        const resume = new Resume({ userId, title, 'data.metadata.template': template })
        await resume.save()
        return reply.code(201).send({
            status: "SUCCESS",
            message: "Resume created succesfully",
            data: resume
        })
    } catch (error) {
        console.log(error)
        return reply.code(500).send({
            status: "FAILURE",
            error: error.message || "Internal server error"
        })
    }
}

const createPrefilledResume = async (request, reply) => {
    const userId = request.user._id;
    const { template, color } = request.body;
    try {
        const title = `Untitled` + uuidv4();
        const basics = dummyData.basics;
        const sections = dummyData.sections;
        const resume = new Resume({ userId, title, 'data.basics': basics, 'data.sections': sections, 'data.metadata.template': template, 'data.metadata.theme.primary': color })
        await resume.save()
        return reply.code(201).send({
            status: "SUCCESS",
            message: "Resume created succesfully",
            data: resume
        })
    } catch (error) {
        console.log(error)
        return reply.code(500).send({
            status: "FAILURE",
            error: error.message || "Internal server error"
        })
    }
}


// delete the resume of the user based on the resumeId
const deleteResume = async (request, reply) => {
    const { resumeId } = request.params;
    const userId = request.user._id;
    try {
        const userResume = await Resume.findOne({ _id: resumeId, userId })
        if (!userResume) {
            return reply.code(404).send({
                status: "FAILURE",
                error: "User Resume not found"
            })
        }
        await Resume.findByIdAndDelete(resumeId)
        return reply.code(204).send({
            status: "SUCCESS",
            message: "User resume deleted"
        })
    } catch (error) {
        console.log(error)
        return reply.code(500).send({
            status: "FAILURE",
            error: error.message || "Internal server error"
        })
    }
}


const createNewJobResume = async (request, reply) => {
    const userId = request.user._id;
    const { data } = request.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return reply.code(404).send({
                status: "FAILURE",
                error: "User not found"
            })
        }
        const title = `${user.fullname}_resume` + uuidv4();
        const resume = new Resume({ userId, data, title })
        await resume.save()
        return reply.code(201).send({
            status: "SUCCESS",
            message: "Resume created succesfully",
            data: resume
        })
    } catch (error) {
        console.error(error)
        return reply.code(500).send({
            status: "FAILURE",
            error: error.message || "Internal server error"
        })
    }
}



module.exports = { getUserResume, updateUserResume, createResume, deleteResume, getAllResumes, createNewJobResume, updateUserResumeTitle, createPrefilledResume }