const authService = require('../services/auth.service');
const { parseCookies } = require('../utils/cookies');

const SESSION_COOKIE = 'session_token';

function requireAuth(handler) {
    return async function (req, res) {
        const token = parseCookies(req)[SESSION_COOKIE];
        req.user = await authService.getCurrentUser(token);
        return handler(req, res);
    };
}

module.exports = { requireAuth };
