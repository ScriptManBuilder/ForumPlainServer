const userRepository = require('../repositories/user.repository');
const roleRepository = require('../repositories/role.repository');
const threadRepository = require('../repositories/threads.repository');
const postRepository = require('../repositories/posts.repository');
const sessionRepository = require('../repositories/session.repository');
const moderationRepository = require('../repositories/moderation.repository');
const requestLogRepository = require('../repositories/requestLog.repository');
const AppError = require('../errors/app.error');

function parseId(value, fieldName) {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(`${fieldName} must be a positive integer`, 400);
    }
    return id;
}

async function findTargetUser(actor, userId) {
    const id = parseId(userId, 'User id');

    const target = await userRepository.findById(id);
    if (!target) {
        throw new AppError('User not found', 404);
    }

    if (target.id === actor.id) {
        throw new AppError('You cannot change your own account this way', 400);
    }

    return target;
}

async function getDashboard() {
    const [
        users,
        threads,
        posts,
        banned,
        newUsersToday,
        newUsersWeek,
        postsToday,
        activeSessions,
        recentActions,
    ] = await Promise.all([
        userRepository.countAll(),
        threadRepository.countAll(),
        postRepository.countAll(),
        userRepository.countBanned(),
        userRepository.countCreatedToday(),
        userRepository.countCreatedInLastDays(7),
        postRepository.countCreatedToday(),
        sessionRepository.countActive(),
        moderationRepository.findRecent(10),
    ]);

    return {
        stats: { users, threads, posts, banned, newUsersToday, newUsersWeek, postsToday, activeSessions },
        recentActions,
    };
}

async function listUsers() {
    return userRepository.findAll();
}

async function changeRole(actor, userId, roleName) {
    const target = await findTargetUser(actor, userId);

    const role = await roleRepository.findByName(roleName);
    if (!role) {
        throw new AppError('Unknown role', 400);
    }

    await userRepository.updateRole(target.id, role.id);
    await moderationRepository.log({
        moderator_id: actor.id,
        action: `change_role:${role.name}`,
        target_type: 'user',
        target_id: target.id,
    });

    return { id: target.id, role: role.name };
}

async function setBanned(actor, userId, isBanned) {
    const target = await findTargetUser(actor, userId);

    await userRepository.setBanned(target.id, isBanned);
    await moderationRepository.log({
        moderator_id: actor.id,
        action: isBanned ? 'ban_user' : 'unban_user',
        target_type: 'user',
        target_id: target.id,
    });

    return { id: target.id, is_banned: isBanned };
}

async function revokeUserSessions(actor, userId) {
    const target = await findTargetUser(actor, userId);

    const revoked = await sessionRepository.deleteByUserId(target.id);
    await moderationRepository.log({
        moderator_id: actor.id,
        action: 'revoke_all_sessions',
        target_type: 'user',
        target_id: target.id,
    });

    return { id: target.id, revoked };
}

async function listSessions(currentToken) {
    return sessionRepository.findActive(currentToken);
}

async function revokeSession(actor, sessionId) {
    const id = parseId(sessionId, 'Session id');

    const session = await sessionRepository.findById(id);
    if (!session) {
        throw new AppError('Session not found', 404);
    }

    await sessionRepository.deleteById(id);
    await moderationRepository.log({
        moderator_id: actor.id,
        action: 'revoke_session',
        target_type: 'user',
        target_id: session.user_id,
    });

    return { id };
}

async function listAuditLog(limit) {
    return moderationRepository.findRecent(limit);
}

async function listRequestLogs({ limit, statusClass }) {
    return requestLogRepository.findRecent({ limit, statusClass });
}

module.exports = {
    getDashboard,
    listUsers,
    changeRole,
    setBanned,
    revokeUserSessions,
    listSessions,
    revokeSession,
    listAuditLog,
    listRequestLogs,
};
