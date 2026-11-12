
export function notFound(req, res, next) {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`
    });
}

export function errorHandler(err, req, res, next) {
    console.error(err);

    if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            success: false,
            message: "This record already exists"
        });
    }

    if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(409).json({
            success: false,
            message: "This record is being used by another record"
        });
    }

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            success: false,
            message: "Image size must not exceed 5 MB"
        });
    }

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request body"
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
}


