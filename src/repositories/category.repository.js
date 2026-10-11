const pool = require('../db/pool');

async function findAll(){
    const sql=`
        SELECT
            c.id, c.name, c.description,
            COUNT(DISTINCT t.id) AS threadCount,
            COUNT(p.id) AS postCount,
            lt.id AS lastThreadId,
            lt.title AS lastThreadTitle,
            lu.username AS lastThreadAuthor,
            lt.created_at AS lastActivity
        FROM categories c
        LEFT JOIN threads t ON t.category_id = c.id
        LEFT JOIN posts p ON p.thread_id = t.id
        LEFT JOIN (
            SELECT id, category_id, title, user_id, created_at,
                   ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY created_at DESC) AS rn
            FROM threads
        ) lt ON lt.category_id = c.id AND lt.rn = 1
        LEFT JOIN users lu ON lu.id = lt.user_id
        GROUP BY c.id, lt.id, lt.title, lu.username, lt.created_at
        ORDER BY c.id
    `;
    const [rows] = await pool.execute(sql);
    return rows;
}

async function findById(id){
    const sql=`SELECT id FROM categories WHERE id = ? LIMIT 1`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] ?? null;
}

module.exports = { findAll, findById };
