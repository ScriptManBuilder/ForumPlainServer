const AppError = require('../errors/app.error');
const { requireAuth } = require('./auth.middleware');

function requireRole(allowedRoles, handler) {
    return requireAuth(async function (req, res) {
        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError('Forbidden', 403);
        }
        return handler(req, res);
    });
}

module.exports = { requireRole };
