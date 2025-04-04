const { CoachEdit } = require("../models/CoachEditModel");
const { Coach } = require("../models/CoachModel");

const editCoachDetails = async (req, res) => {
    const coachId = req.coach._id;
    try {
        const editRequest = await CoachEdit.findOne({ coachId: coachId });
        if (editRequest) {
            return res.status(400).send({
                status: "FAILURE",
                message: "Edit request already sent for this coach"
            });
        }
        const editCoach = new CoachEdit({
            coachId, ...req.body, isApproved: false
        })
        await editCoach.save();
        const coach = await Coach.findById(coachId)
        coach.isEditRequestSent = true;
        await coach.save();
        res.status(200).send({
            status: "SUCCESS",
            coach
        })

    } catch (error) {
        console.log("Error", error)
        res.status(500).send({ status: "FAILURE", message: "An error occurred while editing coach details" })
    }
}




module.exports = {
    editCoachDetails
}