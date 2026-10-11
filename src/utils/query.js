function getSearchParams(req) {
    return new URL(req.url, `http://${req.headers.host}`).searchParams;
}

function parseLimit(value, fallback, max) {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) return fallback;
    return Math.min(n, max);
}

module.exports = { getSearchParams, parseLimit };
