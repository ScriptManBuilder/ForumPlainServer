const postRepository = require('../repositories/posts.repository');
const threadRepository = require('../repositories/threads.repository');
const moderationRepository = require('../repositories/moderation.repository');
const AppError = require('../errors/app.error');

function parseId(value, fieldName) {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(`${fieldName} must be a positive integer`, 400);
    }
    return id;
}

async function setPostHidden(moderator, postId, hidden) {
    const id = parseId(postId, 'postId');

    const post = await postRepository.findById(id);
    if (!post) {
        throw new AppError('Post not found', 404);
    }

    await postRepository.setHidden(id, hidden);
    await moderationRepository.log({
        moderator_id: moderator.id,
        action: hidden ? 'hide_post' : 'show_post',
        target_type: 'post',
        target_id: id,
    });

    return { id, is_hidden: hidden };
}

async function setThreadLocked(moderator, threadId, locked) {
    const id = parseId(threadId, 'threadId');

    const thread = await threadRepository.findById(id);
    if (!thread) {
        throw new AppError('Thread not found', 404);
    }

    await threadRepository.setLocked(id, locked);
    await moderationRepository.log({
        moderator_id: moderator.id,
        action: locked ? 'lock_thread' : 'unlock_thread',
        target_type: 'thread',
        target_id: id,
    });

    return { id, is_locked: locked };
}

module.exports = { setPostHidden, setThreadLocked };
