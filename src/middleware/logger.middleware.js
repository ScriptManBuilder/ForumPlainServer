const requestLogRepository = require('../repositories/requestLog.repository');

function formatTimestamp(date) {
    const pad = (n) => String(n).padStart(2, '0');
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    return `${dateStr} ${timeStr}`;
}

function logRequest(req, statusCode, durationMs) {
    const time = formatTimestamp(new Date());
    console.log(`[${time}] ${req.method} ${req.url} -> ${statusCode} (${durationMs}ms)`);

    const userAgent = req.headers['user-agent'];

    requestLogRepository.create({
        user_id: req.user ? req.user.id : null,
        method: req.method,
        path: req.url.slice(0, 255),
        status: statusCode,
        duration_ms: durationMs,
        ip: req.socket.remoteAddress || null,
        user_agent: userAgent ? userAgent.slice(0, 255) : null,
    }).catch(err => console.error('Failed to write request log:', err.message));
}

module.exports = { logRequest };
