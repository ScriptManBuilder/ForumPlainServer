const pool = require('../db/pool');


async function findByEmail(email){
    const sql=`SELECT id,username,email,password_hash,role_id,is_banned,created_at FROM users WHERE email=? LIMIT 1`;
    const [rows] = await pool.execute(sql, [email]);
    return rows[0] ?? null;
}

async function findByUsername(username){
    const sql=`SELECT id,username,email,password_hash,role_id,created_at FROM users WHERE username=? LIMIT 1`;
    const [rows] = await pool.execute(sql, [username]);
    return rows[0] ?? null;
}

async function create({
    username,
    email,
    password_hash,
    role_id,
}){
    const sql = `INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.execute(sql, [
        username,
        email,
        password_hash,
        role_id,
    ]);
    return result.insertId;
}

async function findAll(){
    const sql=`
        SELECT u.id, u.username, u.email, u.role_id, r.name AS role, u.is_banned, u.created_at
        FROM users u
        JOIN roles r ON r.id = u.role_id
        ORDER BY u.id
    `;
    const [rows] = await pool.execute(sql);
    return rows;
}

async function findById(id){
    const sql=`SELECT id,username,email,role_id,is_banned,created_at FROM users WHERE id=? LIMIT 1`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] ?? null;
}

async function updateRole(id, role_id){
    const sql=`UPDATE users SET role_id=? WHERE id=?`;
    await pool.execute(sql, [role_id, id]);
}

async function setBanned(id, isBanned){
    const sql=`UPDATE users SET is_banned=? WHERE id=?`;
    await pool.execute(sql, [isBanned ? 1 : 0, id]);
}

async function findRecent(limit){
    const sql=`SELECT id, username, created_at FROM users ORDER BY created_at DESC LIMIT ?`;
    const [rows] = await pool.query(sql, [limit]);
    return rows;
}

async function countAll(){
    const [rows] = await pool.execute(`SELECT COUNT(*) AS count FROM users`);
    return rows[0].count;
}

module.exports = { findByEmail, findByUsername, create, findAll, findById, updateRole, setBanned, findRecent, countAll };
