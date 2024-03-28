const mongoose = require('mongoose')
require('dotenv').config()


const DBConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGOURL)
        console.log("Connected to Database")
    } catch (error) {
        console.log("Error connecting to database", error)
    }
}

module.exports = DBConnection