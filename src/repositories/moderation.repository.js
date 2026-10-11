const pool = require('../db/pool');

async function log({ moderator_id, action, target_type, target_id }){
    const sql=`INSERT INTO moderation_actions (moderator_id, action, target_type, target_id) VALUES (?, ?, ?, ?)`;
    await pool.execute(sql, [moderator_id, action, target_type, target_id]);
}

module.exports = { log };
