import express from "express";
const router = express.Router();

import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

// Public APIs
router.get("/", getCategories);

// Admin APIs
router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createCategory
);

router.get("/:id", getCategory);

router.put(
    "/:id",
    protect,
    authorizeRoles("admin"),
    updateCategory
);

router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deleteCategory
);

export default router;
