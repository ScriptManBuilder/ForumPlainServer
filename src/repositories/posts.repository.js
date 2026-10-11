const pool = require('../db/pool');

async function findByThreadId(threadId){
    const sql=`
        SELECT p.id, p.content, p.created_at, p.updated_at, p.is_hidden, p.user_id, u.username
        FROM posts p
        JOIN users u ON u.id = p.user_id
        WHERE p.thread_id = ?
        ORDER BY p.created_at ASC
    `;
    const [rows] = await pool.execute(sql, [threadId]);
    return rows;
}

async function findById(id){
    const sql=`SELECT id, user_id, is_hidden FROM posts WHERE id = ? LIMIT 1`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] ?? null;
}

async function setHidden(id, isHidden){
    const sql=`UPDATE posts SET is_hidden = ? WHERE id = ?`;
    await pool.execute(sql, [isHidden ? 1 : 0, id]);
}

async function create({ thread_id, user_id, content }){
    const sql=`INSERT INTO posts (thread_id, user_id, content) VALUES (?, ?, ?)`;
    const [result] = await pool.execute(sql, [thread_id, user_id, content]);
    return result.insertId;
}

async function updateContent(id, content){
    const sql=`UPDATE posts SET content = ?, updated_at = NOW() WHERE id = ?`;
    await pool.execute(sql, [content, id]);
}

async function deleteById(id){
    const sql=`DELETE FROM posts WHERE id = ?`;
    await pool.execute(sql, [id]);
}

async function countAll(){
    const [rows] = await pool.execute(`SELECT COUNT(*) AS count FROM posts`);
    return rows[0].count;
}

module.exports = { findByThreadId, findById, create, updateContent, deleteById, setHidden, countAll };
