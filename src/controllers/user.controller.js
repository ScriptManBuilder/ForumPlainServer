const userRepository = require('../repositories/user.repository');

function parseLimit(value, fallback, max) {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) return fallback;
    return Math.min(n, max);
}

async function listRecent(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const limit = parseLimit(url.searchParams.get('limit'), 5, 20);

    return userRepository.findRecent(limit);
}

module.exports = { listRecent };
