
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import db from "./config/database.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// routers path
import authRoutes from "./routes/authRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();

// ES Module __dirname configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security and common middleware
app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Static images
app.use(
    "/uploads",
    (req, res, next) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        next();
    },
    express.static(path.join(__dirname, "uploads"))
);

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "News Portal API is running"
    });
});

// API routes
app.use("/v2/api/auth", authRoutes);
app.use("/v2/api/news", newsRoutes);
app.use("/v2/api/categories", categoryRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await db.query("SELECT 1");

        console.log("MySQL database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}

startServer();
