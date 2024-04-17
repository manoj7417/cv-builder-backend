const { Resume } = require("../models/ResumeModel");
const { User } = require("../models/userModel")

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
    const validStatuses = ['inProgress', 'completed', 'downloaded'];

    if (status && !validStatuses.includes(status)) {
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
        const resumes = await Resume.find(query)
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

const generateObjective = async (request, reply) => {
    const { jobTitle, companyName, startDate, endDate, desiredJobTitle, topSkills, achievement } = request.body;
    const userId = request.user._id;
    try {
        const dummyData = 'As a developer, my objective is to leverage my technical skills and creativity to contribute to innovative and impactful projects. I aim to develop high-quality software solutions that address real-world problems and enhance user experiences. By continuously learning and adapting to new technologies and best practices, I strive to deliver robust, scalable, and maintainable code. My goal is to collaborate effectively with cross-functional teams, communicate ideas clearly, and meet project deadlines while upholding the highest standards of professionalism and integrity. Ultimately, I aspire to make a meaningful and lasting impact in the field of software development, driving positive change and delivering value to users and stakeholders alike.'
        return reply.code(200).send({
            status: 'SUCCESS',
            data: dummyData
        })
    } catch (error) {
        console.log("Error in generating objectives for the user")
        return reply.code(500).send({
            status: "FAILURE",
            error: error.message || "Internal server error"
        })
    }
}

// udpate the resume fields of the user based on the resumeId 
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
// create a new resume for the user
const createResume = async (request, reply) => {
    const userId = request.user._id;
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

        const savedResume = await newResume.save();
        const user = await User.findById(userId)
        user.resumes.push(savedResume._id)
        await user.save({ validateBeforeSave: false })
        return reply.code(201).send({
            status: "SUCCESS",
            message: "Resume created succesfully",
            data: savedResume
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



module.exports = { getUserResume, updateUserResume, createResume, deleteResume, getAllResumes, generateObjective }