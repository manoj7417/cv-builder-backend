const { getCoupon, validateCoupon, applyCoupon } = require("../controllers/CouponController");

const CouponRoute = async (fastify, options) => {
    fastify.get("/", { preHandler: fastify.verifyJWT }, getCoupon);
    fastify.post("/validate", { preHandler: fastify.verifyJWT }, validateCoupon);
    fastify.post("/apply", { preHandler: fastify.verifyJWT }, applyCoupon);
};

module.exports = CouponRoute;
