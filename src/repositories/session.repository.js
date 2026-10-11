const pool = require('../db/pool');

async function create({ token, user_id, expires_at }){
    const sql = `INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`;
    await pool.execute(sql, [token, user_id, expires_at]);
}

async function findUserByToken(token){
    const sql = `
        SELECT u.id, u.username, u.email, u.role_id, u.is_banned, u.created_at, r.name AS role
        FROM sessions s
        JOIN users u ON u.id = s.user_id
        JOIN roles r ON r.id = u.role_id
        WHERE s.token = ? AND s.expires_at > NOW()
        LIMIT 1
    `;
    const [rows] = await pool.execute(sql, [token]);
    return rows[0] ?? null;
}

async function deleteByToken(token){
    const sql = `DELETE FROM sessions WHERE token=?`;
    await pool.execute(sql, [token]);
}

async function deleteExpired(){
    const sql = `DELETE FROM sessions WHERE expires_at <= NOW()`;
    await pool.execute(sql);
}

async function countActive(){
    const [rows] = await pool.execute(
        `SELECT COUNT(DISTINCT user_id) AS count FROM sessions WHERE expires_at > NOW()`
    );
    return rows[0].count;
}

module.exports = { create, findUserByToken, deleteByToken, deleteExpired, countActive };
