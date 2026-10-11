const pool = require('../db/pool');

const STATUS_RANGES = {
    '2xx': [200, 299],
    '3xx': [300, 399],
    '4xx': [400, 499],
    '5xx': [500, 599],
};

async function create({ user_id, method, path, status, duration_ms, ip, user_agent }){
    const sql = `
        INSERT INTO request_logs (user_id, method, path, status, duration_ms, ip, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.execute(sql, [user_id, method, path, status, duration_ms, ip, user_agent]);
}

async function findRecent({ limit, statusClass }){
    const range = STATUS_RANGES[statusClass];
    const where = range ? 'WHERE l.status BETWEEN ? AND ?' : '';
    const params = range ? [...range, limit] : [limit];

    const sql = `
        SELECT l.id, l.method, l.path, l.status, l.duration_ms, l.ip, l.user_agent, l.created_at,
               u.username
        FROM request_logs l
        LEFT JOIN users u ON u.id = l.user_id
        ${where}
        ORDER BY l.id DESC
        LIMIT ?
    `;
    const [rows] = await pool.query(sql, params);
    return rows;
}

module.exports = { create, findRecent };
