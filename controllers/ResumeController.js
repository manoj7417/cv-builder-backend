const { Resume } = require("../models/ResumeModel");
const { User } = require("../models/userModel")


const getUserResume = async (request, reply) => {
    const userId = request.user._id
    try {
        const userResume = await Resume.find({ userId })
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


const updateUserResume = async () => {
    const { resumeId } = req.params;
    const updates = req.body;
    try {
        const resume = await Resume.findById(resumeId)
        if (!resume) {
            return reply.code(404).send({ status: "FAILURE", error: 'Resume not found' });
        }

        for (let key in updates) {
            if (key !== '_id') {
                resume[key] = updates[key];
            }
        }

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

const createResume = async (request, reply) => {
    const userId = request.user._id;
    console.log(userId)
    const {
        personalInfo,
        education,
        experience,
        skills,
        certifications,
        projects,
        customSections
    } = request.body;
    try {

        const newResume = await new Resume({
            userId
        })
        if (personalInfo) newResume.personalInfo = personalInfo;
        if (education) newResume.education = education;
        if (experience) newResume.experience = experience;
        if (skills) newResume.skills = skills;
        if (certifications) newResume.certifications = certifications;
        if (projects) newResume.projects = projects;
        if (customSections) newResume.customSections = customSections;

        await newResume.save();
        return reply.code(201).send({
            status: "SUCCESS",
            message: "Resume created succesfully",
            data: newResume
        })
    } catch (error) {
        console.log(error)
        return reply.code(500).send({
            status: "FAILURE",
            error: error.message || "Internal server error"
        })
    }
}

const deleteResume = async (request, reply) => {
    const { resumeId } = request.params;
    const userId = request.user._id;
    try {
        const userResume = await Resume.findOne({ _id: resumeId, userId })
        console.log(userResume)
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



module.exports = { getUserResume, updateUserResume, createResume, deleteResume }