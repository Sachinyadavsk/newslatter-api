
async function seedNews(db) {
    const [users] = await db.execute(
        "SELECT id FROM users WHERE email = ?",
        ["author@example.com"]
    );

    if (!users.length) {
        throw new Error("Seed author not found. Seed users first.");
    }

    const userId = users[0].id;

    const articles = [
        {
            category: "technology",
            title: "Artificial Intelligence Is Changing the World",
            slug: "artificial-intelligence-changing-world",
            description: "Discover how AI is transforming modern industries.",
            content: "Artificial intelligence is changing the way businesses operate, communicate and innovate."
        },
        {
            category: "business",
            title: "Global Business Trends in 2026",
            slug: "global-business-trends-2026",
            description: "Explore the latest global business developments.",
            content: "Businesses are adapting to new technologies, changing markets and evolving customer expectations."
        },
        {
            category: "sports",
            title: "Latest Sports News and Updates",
            slug: "latest-sports-news-updates",
            description: "Read the latest updates from the sporting world.",
            content: "Sports continue to bring people together through competition and entertainment."
        }
    ];

    for (const article of articles) {
        const [categories] = await db.execute(
            "SELECT id FROM categories WHERE slug = ?",
            [article.category]
        );

        if (!categories.length) {
            throw new Error(`Category not found: ${article.category}`);
        }

        await db.execute(
            `INSERT INTO news
            (user_id, category_id, title, slug, description, content, status)
            VALUES (?, ?, ?, ?, ?, ?, 'published')
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                description = VALUES(description),
                content = VALUES(content)`,
            [
                userId,
                categories[0].id,
                article.title,
                article.slug,
                article.description,
                article.content
            ]
        );
    }

    console.log("News articles seeded successfully!");
}

export default seedNews;
