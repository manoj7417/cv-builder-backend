const Razorpay = require("razorpay");
const crypto = require("crypto");
const { CVPayment } = require("../models/CVBuilderModel.js");

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;


// 🔹 Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SECRET,
});

// ✅ Create Order
const createOrder = async (request, reply) => {
    try {
        const { userId, planType } = request.body;

        if (!userId || !planType) {
            return reply.status(400).send({ success: false, message: "User ID and Plan Type are required" });
        }

        // Normalize and validate planType
        const normalizedPlanType = planType.toLowerCase();
        const amount = normalizedPlanType === "pro" ? 14900 : null;

        if (!amount) {
            return reply.status(400).send({ success: false, message: "Invalid plan type or free plan does not require payment" });
        }

        // Check if pending order already exists
        const existingOrder = await CVPayment.findOne({ userId, planType, status: "pending" });
        if (existingOrder) {
            return reply.send({ success: true, order: existingOrder });
        }

        // Create a new order with Razorpay
        const options = {
            amount,
            currency: "INR",
            receipt: `order_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // 🔹 Save order details in DB
        const payment = new CVPayment({
            userId,
            orderId: order.id,
            planType,
            amount: order.amount,
            currency: order.currency,
            status: "pending",
        });

        await payment.save();

        return reply.send({ success: true, order });
    } catch (error) {
        console.error("Order creation error:", error);
        return reply.status(500).send({ success: false, message: "Error creating order" });
    }
};

// ✅ Verify Payment
const verifyPayment = async (request, reply) => {
    try {
        const { orderId, paymentId, signature } = request.body;

        if (!orderId || !paymentId || !signature) {
            return reply.status(400).send({ success: false, message: "Missing required fields" });
        }

        // Fetch payment record
        const paymentRecord = await CVPayment.findOne({ orderId });
        if (!paymentRecord || paymentRecord.status === "success") {
            return reply.status(400).send({ success: false, message: "Invalid or already verified order" });
        }

        // ✅ Generate and verify signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        if (generatedSignature !== signature) {
            await CVPayment.findOneAndUpdate({ orderId }, { status: "failed" });
            return reply.status(400).send({ success: false, message: "Payment verification failed" });
        }

        // ✅ Update payment status & set planType to "pro"
        const updatedPayment = await CVPayment.findOneAndUpdate(
            { orderId },
            { paymentId, status: "success", planType: "pro" },
            { new: true }
        );

        return reply.send({ success: true, message: "Payment verified successfully", payment: updatedPayment });
    } catch (error) {
        console.error("Payment verification error:", error);
        return reply.status(500).send({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
};
