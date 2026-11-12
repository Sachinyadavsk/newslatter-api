import db from "../config/database.js";

const News = {
    async getAll({ page, limit, search, category }) {
        const offset = (page - 1) * limit;

        let where = "WHERE n.status = 'published'";
        const params = [];

        if (search) {
            where += ` AND (
                n.title LIKE ? OR
                n.description LIKE ? OR
                n.content LIKE ?
            )`;

            const keyword = `%${search}%`;

            params.push(keyword, keyword, keyword);
        }

        if (category) {
            where += " AND c.slug = ?";
            params.push(category);
        }

        const [rows] = await db.execute(
            `SELECT n.id, n.title, n.slug,
                    n.description, n.image,
                    n.status, n.created_at,
                    c.name AS category_name,
                    c.slug AS category_slug,
                    u.name AS author_name
             FROM news n
             JOIN categories c ON n.category_id = c.id
             JOIN users u ON n.user_id = u.id
             ${where}
             ORDER BY n.created_at DESC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const [countRows] = await db.execute(
            `SELECT COUNT(*) AS total
             FROM news n
             JOIN categories c ON n.category_id = c.id
             ${where}`,
            params
        );

        const total = countRows[0].total;

        return {
            data: rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    async getAdminAll({
        page,
        limit,
        search,
        status,
        authorId
    }) {
        const offset = (page - 1) * limit;

        let where = "WHERE 1=1";
        const params = [];

        if (authorId) {
            where += " AND n.user_id = ?";
            params.push(authorId);
        }

        if (search) {
            where += " AND n.title LIKE ?";
            params.push(`%${search}%`);
        }

        if (status && ["draft", "published"].includes(status)) {
            where += " AND n.status = ?";
            params.push(status);
        }

        const [rows] = await db.execute(
            `SELECT n.*,
                    c.name AS category_name,
                    u.name AS author_name
             FROM news n
             JOIN categories c ON n.category_id = c.id
             JOIN users u ON n.user_id = u.id
             ${where}
             ORDER BY n.created_at DESC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const [countRows] = await db.execute(
            `SELECT COUNT(*) AS total
             FROM news n
             ${where}`,
            params
        );

        const total = countRows[0].total;

        return {
            data: rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    async findById(id) {
        const [rows] = await db.execute(
            `SELECT n.*,
                    c.name AS category_name,
                    c.slug AS category_slug,
                    u.name AS author_name
             FROM news n
             JOIN categories c ON n.category_id = c.id
             JOIN users u ON n.user_id = u.id
             WHERE n.id = ?
             LIMIT 1`,
            [id]
        );

        return rows[0] || null;
    },

    async findBySlug(slug) {
        const [rows] = await db.execute(
            `SELECT n.*,
                    c.name AS category_name,
                    c.slug AS category_slug,
                    u.name AS author_name
             FROM news n
             JOIN categories c ON n.category_id = c.id
             JOIN users u ON n.user_id = u.id
             WHERE n.slug = ?
             LIMIT 1`,
            [slug]
        );

        return rows[0] || null;
    },

    async create(news) {
        const [result] = await db.execute(
            `INSERT INTO news (
                user_id,
                category_id,
                title,
                slug,
                description,
                content,
                image,
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                news.user_id,
                news.category_id,
                news.title,
                news.slug,
                news.description,
                news.content,
                news.image,
                news.status
            ]
        );

        return result.insertId;
    },

    async update(id, news) {
        const [result] = await db.execute(
            `UPDATE news SET
                category_id = ?,
                title = ?,
                slug = ?,
                description = ?,
                content = ?,
                image = ?,
                status = ?
             WHERE id = ?`,
            [
                news.category_id,
                news.title,
                news.slug,
                news.description,
                news.content,
                news.image,
                news.status,
                id
            ]
        );

        return result;
    },

    async delete(id) {
        const [result] = await db.execute(
            "DELETE FROM news WHERE id = ?",
            [id]
        );

        return result;
    }
};

export default News;

