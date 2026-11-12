import slugify from "slugify";

function createSlug(text) {
    return slugify(text, {
        lower: true,
        strict: true,
        trim: true
    });
}

export default createSlug;
