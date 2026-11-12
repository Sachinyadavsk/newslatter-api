
import dotenv from "dotenv";
import db from "../config/database.js";
import seedCategories from "./categories.js";
import seedUsers from "./users.js";
import seedNews from "./news.js";

dotenv.config();

async function runSeed() {
    const type = process.argv[2] || "all";

    try {
        // Verify MySQL connection
        await db.query("SELECT 1");
        console.log("MySQL connected. Starting database seeding...");
        if (type === "all" || type === "categories") {
            await seedCategories(db);
        }
        if (type === "all" || type === "users") {
            await seedUsers(db);
        }
        if (type === "all" || type === "news") {
            await seedNews(db);
        }
        console.log("Database seeding completed successfully!");
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
}

runSeed();
