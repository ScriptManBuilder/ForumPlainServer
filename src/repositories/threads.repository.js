const pool = require('../db/pool');

async function findByCategoryId(categoryId){
    const sql=`
        SELECT t.id, t.title, t.is_anonymous, t.created_at, u.username
        FROM threads t
        JOIN users u ON u.id = t.user_id
        WHERE t.category_id = ?
        ORDER BY t.created_at DESC
    `;
    const [rows] = await pool.execute(sql, [categoryId]);
    return rows;
}

async function findById(id){
    const sql=`SELECT id, is_locked FROM threads WHERE id = ? LIMIT 1`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] ?? null;
}

async function setLocked(id, isLocked){
    const sql=`UPDATE threads SET is_locked = ? WHERE id = ?`;
    await pool.execute(sql, [isLocked ? 1 : 0, id]);
}

async function create({ category_id, user_id, title, is_anonymous }){
    const sql=`INSERT INTO threads (category_id, user_id, title, is_anonymous) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.execute(sql, [category_id, user_id, title, is_anonymous]);
    return result.insertId;
}

async function findRecent(limit){
    const sql=`
        SELECT t.id, t.title, t.is_anonymous, t.created_at, c.name AS category, u.username
        FROM threads t
        JOIN categories c ON c.id = t.category_id
        JOIN users u ON u.id = t.user_id
        ORDER BY t.created_at DESC
        LIMIT ?
    `;
    const [rows] = await pool.query(sql, [limit]);
    return rows;
}

async function countAll(){
    const [rows] = await pool.execute(`SELECT COUNT(*) AS count FROM threads`);
    return rows[0].count;
}

module.exports = { findByCategoryId, findById, create, setLocked, findRecent, countAll };
