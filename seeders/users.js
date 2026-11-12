
import bcrypt from "bcryptjs";

async function seedUsers(db) {
    const users = [
        {
            name: "Admin",
            email: "admin@example.com",
            password: "Admin@12345",
            role: "admin"
        },
        {
            name: "News Author",
            email: "author@example.com",
            password: "Author@12345",
            role: "author"
        }
    ];

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 12);

        await db.execute(
            `INSERT IGNORE INTO users
            (name, email, password, role)
            VALUES (?, ?, ?, ?)`,
            [
                user.name,
                user.email,
                hashedPassword,
                user.role
            ]
        );
    }

    console.log("Users seeded successfully!");
}

export default seedUsers;
