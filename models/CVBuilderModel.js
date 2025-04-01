const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String },
    planType: {
        type: String,
        enum: ["free", "pro"],
        required: true
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
});

const CVPayment = mongoose.models.CVPayment || mongoose.model("CVPayment", PaymentSchema);

module.exports = { CVPayment };
