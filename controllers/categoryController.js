
import Category from "../models/categoryModel.js";
import slugify from "../utils/slugify.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.getAll();

    res.json({
        success: true,
        count: categories.length,
        data: categories
    });
});

export const getCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }

    res.json({
        success: true,
        data: category
    });
});

export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Category name is required"
        });
    }

    const slug = slugify(name);

    const id = await Category.create({
        name: name.trim(),
        slug
    });

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: await Category.findById(id)
    });
});

export const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Category name is required"
        });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }

    await Category.update(req.params.id, {
        name: name.trim(),
        slug: slugify(name)
    });

    res.json({
        success: true,
        message: "Category updated successfully",
        data: await Category.findById(req.params.id)
    });
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }

    await Category.delete(req.params.id);

    res.json({
        success: true,
        message: "Category deleted successfully"
    });
});
