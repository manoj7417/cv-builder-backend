const mongoose = require('mongoose')

const linkTypeEnum = ['website', 'LinkedIn', 'custom', 'instagram', 'facebook'];

const ResumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    personalInfo: {
        firstName: {
            type: String,
            required: false
        },
        lastName: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        phoneNumber: String,
        address: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        summary: String,
        customLinks: [{
            linkType: {
                type: String,
                enum: linkTypeEnum,
                required: false
            },
            url: {
                type: String,
                required: false
            }
        }]
    },
    education: [{
        institution: {
            type: String,
            required: false
        },
        degree: {
            type: String,
            required: false
        },
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
        description: String
    }],
    experience: [{
        company: {
            type: String,
            required: false
        },
        position: {
            type: String,
            required: false
        },
        startDate: Date,
        endDate: Date,
        description: String
    }],
    skills: [String],
    certifications: [{
        name: {
            type: String,
            required: false
        },
        organization: String,
        date: Date,
        description: String
    }],
    projects: [{
        name: {
            type: String,
            required: false
        },
        description: String,
        link: String
    }],
    customSections: [{
        title: {
            type: String,
            required: false
        },
        content: String
    }]
})

const Resume = mongoose.model("Resume", ResumeSchema)

module.exports = { Resume }