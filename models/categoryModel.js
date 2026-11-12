
import db from "../config/database.js";

const Category = {
    async getAll() {
        const [rows] = await db.execute(
            `SELECT c.*,
                (SELECT COUNT(*) FROM news n
                 WHERE n.category_id = c.id
                 AND n.status = 'published') AS news_count
             FROM categories c
             ORDER BY c.name ASC`
        );

        return rows;
    },

    async findById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM categories WHERE id = ? LIMIT 1",
            [id]
        );

        return rows[0] || null;
    },

    async findBySlug(slug) {
        const [rows] = await db.execute(
            "SELECT * FROM categories WHERE slug = ? LIMIT 1",
            [slug]
        );

        return rows[0] || null;
    },

    async create(category) {
        const [result] = await db.execute(
            `INSERT INTO categories (name, slug)
             VALUES (?, ?)`,
            [category.name, category.slug]
        );

        return result.insertId;
    },

    async update(id, category) {
        const [result] = await db.execute(
            `UPDATE categories
             SET name = ?, slug = ?
             WHERE id = ?`,
            [category.name, category.slug, id]
        );

        return result;
    },

    async delete(id) {
        const [result] = await db.execute(
            "DELETE FROM categories WHERE id = ?",
            [id]
        );

        return result;
    }
};


export default Category;
