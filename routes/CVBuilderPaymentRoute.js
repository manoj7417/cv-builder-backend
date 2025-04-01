const { createOrder, verifyPayment } = require("../controllers/CVBuilderController");

const CVPaymentRoute = async (fastify, options) => {
    fastify.post("/create-order", createOrder);
    fastify.post("/verify-payment", verifyPayment);
};

module.exports = CVPaymentRoute;
