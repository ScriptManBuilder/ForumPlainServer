const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const roleRepository = require('../repositories/role.repository');
const sessionRepository = require('../repositories/session.repository');
const AppError = require('../errors/app.error');

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;


async function register({ username, email, password }) {
    if (
        typeof username !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string'
    ) {
        throw new AppError(
            'Username, email and password are required',
            400
        );
    }


    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();


    if (!normalizedUsername || !normalizedEmail || !password) {
        throw new AppError(
            'Username, email and password are required',
            400
        );
    }


    if (normalizedUsername.length < 3) {
        throw new AppError(
            'Username must contain at least 3 characters',
            400
        );
    }


    if (normalizedUsername.length > 50) {
        throw new AppError(
            'Username must not exceed 50 characters',
            400
        );
    }


    if (normalizedEmail.length > 255) {
        throw new AppError(
            'Email is too long',
            400
        );
    }


    if (password.length < 10) {
        throw new AppError(
            'Password must contain at least 10 characters',
            400
        );
    }


    const existingUser = await userRepository.findByEmail(
        normalizedEmail
    );


    if (existingUser) {
        throw new AppError(
            'User with that email already exists',
            409
        );
    }


    const existingUsername = await userRepository.findByUsername(
        normalizedUsername
    );


    if (existingUsername) {
        throw new AppError(
            'User with that username already exists',
            409
        );
    }


    const password_hash = await bcrypt.hash(password, 12);


    const role = await roleRepository.findByName('user');
    if (!role) {
    throw new AppError('Default role is not configured', 500);
    }
    const role_id = role.id;


    let userId;
    try {
        userId = await userRepository.create({
            username: normalizedUsername,
            email: normalizedEmail,
            password_hash,
            role_id,
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            throw new AppError(
                'User with that email or username already exists',
                409
            );
        }
        throw err;
    }


    return {
        id: userId,
        username: normalizedUsername,
        email: normalizedEmail,
        role_id,
    };
}


async function login({ email, password }, { ip = null, userAgent = null } = {}) {
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
        throw new AppError('Email and password are required', 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userRepository.findByEmail(normalizedEmail);

    const passwordMatches = user
        ? await bcrypt.compare(password, user.password_hash)
        : false;

    if (!passwordMatches) {
        throw new AppError('Invalid email or password', 401);
    }

    if (user.is_banned) {
        throw new AppError('Account is banned', 403);
    }

    const token = crypto.randomBytes(32).toString('hex');
    await sessionRepository.deleteExpired();
    await sessionRepository.create({
        token,
        user_id: user.id,
        expires_at: new Date(Date.now() + SESSION_TTL_MS),
        ip,
        user_agent: userAgent ? userAgent.slice(0, 255) : null,
    });

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role_id: user.role_id,
        },
    };
}

async function logout(token) {
    if (token) {
        await sessionRepository.deleteByToken(token);
    }
}

async function getCurrentUser(token) {
    const user = token
        ? await sessionRepository.findUserByToken(token)
        : null;

    if (!user) {
        throw new AppError('Not authenticated', 401);
    }

    if (user.is_banned) {
        throw new AppError('Account is banned', 403);
    }

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        role: user.role,
        created_at: user.created_at,
    };
}

async function getOptionalUser(token) {
    try {
        return await getCurrentUser(token);
    } catch (err) {
        if (err instanceof AppError) {
            return null;
        }
        throw err;
    }
}

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
    getOptionalUser,
    SESSION_TTL_MS,
};