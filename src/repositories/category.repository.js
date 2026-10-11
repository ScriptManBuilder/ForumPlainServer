const pool = require('../db/pool');

async function findAll(){
    const sql=`SELECT id, name, description FROM categories ORDER BY id`;
    const [rows] = await pool.execute(sql);
    return rows;
}

async function findById(id){
    const sql=`SELECT id FROM categories WHERE id = ? LIMIT 1`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] ?? null;
}

module.exports = { findAll, findById };
