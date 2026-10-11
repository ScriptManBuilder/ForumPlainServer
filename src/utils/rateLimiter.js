function createRateLimiter({ windowMs, max }) {
    const hits = new Map();

    function isLimited(key) {
        const entry = hits.get(key);
        if (!entry) return false;
        if (Date.now() > entry.resetAt) {
            hits.delete(key);
            return false;
        }
        return entry.count >= max;
    }

    function hit(key) {
        const now = Date.now();
        const entry = hits.get(key);
        if (!entry || now > entry.resetAt) {
            hits.set(key, { count: 1, resetAt: now + windowMs });
        } else {
            entry.count++;
        }
    }

    function reset(key) {
        hits.delete(key);
    }

    return { isLimited, hit, reset };
}

module.exports = { createRateLimiter };
