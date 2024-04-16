
function roleCheck(requiredRoles) {
    return async (request, reply) => {
        if (!request.user || !requiredRoles.includes(request.user.role)) {
            return reply.code(403).send({ status: 'FAILURE', error: 'Access denied' });
        }
    };
}

module.exports = roleCheck;