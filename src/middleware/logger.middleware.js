function formatTimestamp(date) {
    const pad = (n) => String(n).padStart(2, '0');
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    return `${dateStr} ${timeStr}`;
}

function logRequest(req, statusCode) {
    const time = formatTimestamp(new Date());
    const status = statusCode !== undefined ? statusCode : '-';
    console.log(`[${time}] ${req.method} ${req.url} -> ${status}`);
}

module.exports = { logRequest };
