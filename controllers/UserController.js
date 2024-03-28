const User = require("../models/userModel");

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new Error(500, "Something went wrong while generating referesh and access token")
    }
}

const register = async (request, reply) => {
    const { email, name, password } = request.body;
    try {
        const findExistingUser = await User.findOne({ email })
        console.log(findExistingUser)
        if (findExistingUser) {
            return reply.status(409).send({ status: "FAILURE", error: "User already exists" })
        }

        const user = new User({ email, name, password })
        await user.save()

        reply.status(201).send({
            status: "SUCCESS",
            message: "Registration successful"
        })

    } catch (error) {
        console.log(error)
        reply.status(500).json({
            status: "FAILURE",
            error: error.message || "Internal server error"
        })
    }
}


const login = async (request, reply) => {
    const { email, password } = request.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return request.status(404).send({
                status: "FAILURE",
                error: "User not found"
            })
        }
        const isPasswordcorrect = await user.comparePassword(password)
        if (!isPasswordcorrect) {
            return reply.status(401).send({
                status: "FAILURE",
                error: "Invalid credentials"
            })
        }
        const accessToken = await user.generateAccessToken()
        if (accessToken) {
            reply.status(200).send({
                status: "SUCCESS",
                message: "LogIn successful",
                token: accessToken
            })
        }
    } catch (error) {
        console.log(error)
        reply.status(500).send({
            status: "FAILURE",
            error: error.message || "Internal server error"
        })
    }
}


const resetPassword = async (request, reply) => {
    const userId = request.userId
    const { oldPassword, newPassword } = request.body;
    try {

    } catch (error) {

    }
}


module.exports = {
    register,
    login,
    resetPassword
}