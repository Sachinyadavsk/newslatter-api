import db from "../config/database.js";

const User = {
    async create(user) {
        const [result] = await db.execute(
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, ?)`,
            [
                user.name,
                user.email,
                user.password,
                user.role
            ]
        );

        return result.insertId;
    },

    async findByEmail(email) {
        const [rows] = await db.execute(
            `SELECT id, name, email, password, role
             FROM users WHERE email = ? LIMIT 1`,
            [email]
        );

        return rows[0] || null;
    },

    async findById(id) {
        const [rows] = await db.execute(
            `SELECT id, name, email, role, created_at
             FROM users WHERE id = ? LIMIT 1`,
            [id]
        );

        return rows[0] || null;
    },

    async getAll() {
        const [rows] = await db.execute(
            `SELECT id, name, email, role, created_at
             FROM users ORDER BY id DESC`
        );

        return rows;
    }
};

export default User;
