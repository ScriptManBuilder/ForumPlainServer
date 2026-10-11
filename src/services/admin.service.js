const userRepository = require('../repositories/user.repository');
const roleRepository = require('../repositories/role.repository');
const moderationRepository = require('../repositories/moderation.repository');
const AppError = require('../errors/app.error');

function parseUserId(value) {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError('User id must be a positive integer', 400);
    }
    return id;
}

async function findTargetUser(actor, userId) {
    const id = parseUserId(userId);

    const target = await userRepository.findById(id);
    if (!target) {
        throw new AppError('User not found', 404);
    }

    if (target.id === actor.id) {
        throw new AppError('You cannot change your own account this way', 400);
    }

    return target;
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

module.exports = { listUsers, changeRole, setBanned };
