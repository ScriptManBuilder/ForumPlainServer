const userRepository = require('../repositories/user.repository');
const threadRepository = require('../repositories/threads.repository');
const postRepository = require('../repositories/posts.repository');
const sessionRepository = require('../repositories/session.repository');

async function getStats() {
    const [users, threads, posts, activeSessions] = await Promise.all([
        userRepository.countAll(),
        threadRepository.countAll(),
        postRepository.countAll(),
        sessionRepository.countActive(),
    ]);

    return { users, threads, posts, activeSessions };
}

module.exports = { getStats };
