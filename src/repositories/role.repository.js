const pool = require('../db/pool');

async function findByName(name){
    const sql=`SELECT id, name FROM roles WHERE name=? LIMIT 1`;
    const [rows] = await pool.execute(sql, [name]);
    return rows[0] ?? null;
}

module.exports = { findByName };
