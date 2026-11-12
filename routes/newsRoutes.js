
import express from "express";
const router = express.Router();

import {
    getNews,
    getNewsBySlug,
    getAdminNews,
    createNews,
    updateNews,
    deleteNews
} from "../controllers/newsController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

// Public APIs
router.get("/", getNews);

// Admin and author APIs
router.get(
    "/admin/all",
    protect,
    authorizeRoles("admin", "author"),
    getAdminNews
);

router.post(
    "/",
    protect,
    authorizeRoles("admin", "author"),
    upload.single("image"),
    createNews
);

router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "author"),
    upload.single("image"),
    updateNews
);

router.delete(
    "/:id",
    protect,
    authorizeRoles("admin", "author"),
    deleteNews
);

// Public news details
router.get("/:slug", getNewsBySlug);

export default router;
