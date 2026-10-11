const pool = require('../db/pool');

async function create({ token, user_id, expires_at, ip, user_agent }){
    const sql = `INSERT INTO sessions (token, user_id, expires_at, ip, user_agent) VALUES (?, ?, ?, ?, ?)`;
    await pool.execute(sql, [token, user_id, expires_at, ip, user_agent]);
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

async function findActive(currentToken){
    const sql = `
        SELECT s.id, LEFT(s.token, 8) AS token_preview, s.ip, s.user_agent,
               s.created_at, s.expires_at, (s.token = ?) AS is_current,
               u.id AS user_id, u.username
        FROM sessions s
        JOIN users u ON u.id = s.user_id
        WHERE s.expires_at > NOW()
        ORDER BY s.created_at DESC
    `;
    const [rows] = await pool.execute(sql, [currentToken ?? '']);
    return rows;
}

async function findById(id){
    const [rows] = await pool.execute(`SELECT id, user_id FROM sessions WHERE id = ? LIMIT 1`, [id]);
    return rows[0] ?? null;
}

async function deleteById(id){
    await pool.execute(`DELETE FROM sessions WHERE id = ?`, [id]);
}

async function deleteByUserId(userId){
    const [result] = await pool.execute(`DELETE FROM sessions WHERE user_id = ?`, [userId]);
    return result.affectedRows;
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

module.exports = {
    create,
    findUserByToken,
    findActive,
    findById,
    deleteById,
    deleteByUserId,
    deleteByToken,
    deleteExpired,
    countActive,
};
