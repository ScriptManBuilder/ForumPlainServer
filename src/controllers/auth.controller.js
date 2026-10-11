const authService = require('../services/auth.service');
const AppError = require('../errors/app.error');
const { parseCookies } = require('../utils/cookies');
const { createRateLimiter } = require('../utils/rateLimiter');

const SESSION_COOKIE = 'session_token';
const JSON_HEADER = { 'Content-Type': 'application/json; charset=utf-8' };

const loginLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

function sendError(res, err) {
    if (err instanceof AppError) {
        res.writeHead(err.statusCode, JSON_HEADER);
        res.end(JSON.stringify({ error: err.message }));
        return;
    }
    throw err;
}

async function register(req, res) {
    try {
        const user = await authService.register(req.body);

        res.writeHead(201, JSON_HEADER);
        res.end(JSON.stringify(user));
    } catch (err) {
        sendError(res, err);
    }
}

async function login(req, res) {
    const ip = req.socket.remoteAddress;

    if (loginLimiter.isLimited(ip)) {
        throw new AppError('Too many login attempts, try again later', 429);
    }

    try {
        const { token, user } = await authService.login(req.body, {
            ip: ip || null,
            userAgent: req.headers['user-agent'] || null,
        });
        const maxAge = Math.floor(authService.SESSION_TTL_MS / 1000);

        loginLimiter.reset(ip);
        req.user = user;

        res.writeHead(200, {
            ...JSON_HEADER,
            'Set-Cookie': `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}`,
        });
        res.end(JSON.stringify(user));
    } catch (err) {
        if (err instanceof AppError && err.statusCode === 401) {
            loginLimiter.hit(ip);
        }
        sendError(res, err);
    }
}

async function logout(req, res) {
    const token = parseCookies(req)[SESSION_COOKIE];
    await authService.logout(token);

    res.writeHead(200, {
        ...JSON_HEADER,
        'Set-Cookie': `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`,
    });
    res.end(JSON.stringify({ message: 'Logged out' }));
}

async function me(req, res) {
    try {
        const token = parseCookies(req)[SESSION_COOKIE];
        const user = await authService.getCurrentUser(token);

        res.writeHead(200, JSON_HEADER);
        res.end(JSON.stringify(user));
    } catch (err) {
        sendError(res, err);
    }
}

module.exports = { register, login, logout, me };
