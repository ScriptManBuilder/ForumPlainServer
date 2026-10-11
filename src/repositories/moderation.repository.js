const pool = require('../db/pool');

async function log({ moderator_id, action, target_type, target_id }){
    const sql=`INSERT INTO moderation_actions (moderator_id, action, target_type, target_id) VALUES (?, ?, ?, ?)`;
    await pool.execute(sql, [moderator_id, action, target_type, target_id]);
}

async function findRecent(limit){
    const sql = `
        SELECT m.id, m.action, m.target_type, m.target_id, m.created_at, u.username AS actor
        FROM moderation_actions m
        JOIN users u ON u.id = m.moderator_id
        ORDER BY m.id DESC
        LIMIT ?
    `;
    const [rows] = await pool.query(sql, [limit]);
    return rows;
}

module.exports = { log, findRecent };
