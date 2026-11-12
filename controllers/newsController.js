
import News from "../models/newsModel.js";
import Category from "../models/categoryModel.js";
import slugify from "../utils/slugify.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getNews = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(
        50,
        Math.max(1, parseInt(req.query.limit) || 10)
    );

    const { search, category } = req.query;

    const result = await News.getAll({
        page,
        limit,
        search,
        category
    });

    res.json({
        success: true,
        ...result
    });
});

export const getNewsBySlug = asyncHandler(async (req, res) => {
    const news = await News.findBySlug(req.params.slug);

    if (!news || news.status !== "published") {
        return res.status(404).json({
            success: false,
            message: "News not found"
        });
    }

    res.json({
        success: true,
        data: news
    });
});

export const getAdminNews = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(
        50,
        Math.max(1, parseInt(req.query.limit) || 10)
    );

    const result = await News.getAdminAll({
        page,
        limit,
        search: req.query.search,
        status: req.query.status,
        authorId: req.user.role === "author"
            ? req.user.id
            : null
    });

    res.json({
        success: true,
        ...result
    });
});

export const createNews = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        content,
        category_id,
        status
    } = req.body;

    if (!title || !description || !content || !category_id) {
        return res.status(400).json({
            success: false,
            message: "Title, description, content and category are required"
        });
    }

    const category = await Category.findById(category_id);

    if (!category) {
        return res.status(400).json({
            success: false,
            message: "Invalid category"
        });
    }

    const slug = slugify(title) + "-" + Date.now();

    const image = req.file ? req.file.filename : null;

    const id = await News.create({
        user_id: req.user.id,
        category_id,
        title,
        slug,
        description,
        content,
        image,
        status: ["draft", "published"].includes(status)
            ? status
            : "draft"
    });

    res.status(201).json({
        success: true,
        message: "News created successfully",
        data: await News.findById(id)
    });
});

export const updateNews = asyncHandler(async (req, res) => {
    const news = await News.findById(req.params.id);

    if (!news) {
        return res.status(404).json({
            success: false,
            message: "News not found"
        });
    }

    if (
        req.user.role !== "admin" &&
        news.user_id !== req.user.id
    ) {
        return res.status(403).json({
            success: false,
            message: "You cannot update this news"
        });
    }

    const {
        title,
        description,
        content,
        category_id,
        status
    } = req.body;

    if (category_id) {
        const category = await Category.findById(category_id);

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });
        }
    }

    if (
        status !== undefined &&
        !["draft", "published"].includes(status)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid news status"
        });
    }

    const image = req.file
        ? req.file.filename
        : news.image;

    await News.update(req.params.id, {
        title: title || news.title,
        slug: title
            ? slugify(title) + "-" + Date.now()
            : news.slug,
        description: description ?? news.description,
        content: content ?? news.content,
        category_id: category_id || news.category_id,
        image,
        status: status || news.status
    });

    res.json({
        success: true,
        message: "News updated successfully",
        data: await News.findById(req.params.id)
    });
});

export const deleteNews = asyncHandler(async (req, res) => {
    const news = await News.findById(req.params.id);

    if (!news) {
        return res.status(404).json({
            success: false,
            message: "News not found"
        });
    }

    if (
        req.user.role !== "admin" &&
        news.user_id !== req.user.id
    ) {
        return res.status(403).json({
            success: false,
            message: "You cannot delete this news"
        });
    }

    await News.delete(req.params.id);

    res.json({
        success: true,
        message: "News deleted successfully"
    });
});
