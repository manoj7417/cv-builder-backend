const { Coupon } = require("../models/CouponModel.js");
const { User } = require("../models/userModel.js");

const getCoupon = async (request, reply) => {
    try {

        console.log("user", request.user._id)
        const coupon = await Coupon.findOne({
            userId: request.user._id,
            isActive: true
        });


        return coupon || null;

    } catch (error) {
        request.log.error("Error in getCoupon controller:", error);
        throw new Error("Server error while fetching coupon");
    }
};

const validateCoupon = async (request, reply) => {
    try {
        const { code } = request.body;
        const coupon = await Coupon.findOne({
            code: code,
            userId: request.user._id,
            isActive: true
        });

        if (!coupon) {
            reply.code(404).send({ message: "Coupon not found" });
            return;
        }

        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            reply.code(404).send({ message: "Coupon expired" });
            return;
        }

        return {
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        };

    } catch (error) {
        request.log.error("Error in validateCoupon controller:", error);
        throw new Error("Server error while validating coupon");
    }
};



// Add to your existing coupon controller
const applyCoupon = async (request, reply) => {
    try {
        const { code } = request.body;

        // 1. Validate coupon exists and is active
        const coupon = await Coupon.findOne({
            code: code,
            userId: request.user._id,
            isActive: true,
            expirationDate: { $gt: new Date() }
        });

        if (!coupon) {
            return reply.code(400).send({
                success: false,
                message: "Invalid or expired coupon code"
            });
        }

        // 2. Grant premium access (3 months from now)
        const accessExpires = new Date();
        accessExpires.setMonth(accessExpires.getMonth() + 3);

        // Update user model - you'll need to adjust based on your User model
        await User.findByIdAndUpdate(request.user._id, {
            hasPremiumAccess: true,
            accessExpires,
            planType: "premium"
        });

        // 3. Deactivate coupon if single-use
        coupon.isActive = false;
        await coupon.save();

        return reply.send({
            success: true,
            message: "Coupon applied successfully",
            expiresAt: accessExpires
        });

    } catch (error) {
        request.log.error("Error applying coupon:", error);
        reply.code(500).send({
            success: false,
            message: "Error applying coupon"
        });
    }
};



module.exports = {
    getCoupon,
    validateCoupon,
    applyCoupon

};