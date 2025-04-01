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
        const { userId, planType } = request.body; // Accept planType from frontend

        if (!userId || !planType) {
            return reply.status(400).send({ success: false, message: "User ID and Plan Type are required" });
        }

        // Set amount based on planType
        const normalizedPlanType = planType.toLowerCase();
        const amount = normalizedPlanType === "pro" ? 14900 : 0;

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
            planType, // Store plan type
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

        // ✅ Use built-in crypto module to generate the signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET) // Ensure secret is correctly set
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        // ✅ Verify signature
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
