
async function seedCategories(db) {
    const categories = [
        ["Technology", "technology"],
        ["Business", "business"],
        ["Politics", "politics"],
        ["Sports", "sports"],
        ["Entertainment", "entertainment"],
        ["Health", "health"],
        ["Education", "education"],
        ["World", "world"],
        ["Lifestyle", "lifestyle"]
    ];

    for (const [name, slug] of categories) {
        await db.execute(
            `INSERT INTO categories (name, slug)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE name = VALUES(name)`,
            [name, slug]
        );
    }

    console.log("Categories seeded successfully!");
}

export default seedCategories;
