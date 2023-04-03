import mongoose from "mongoose";
const config = useRuntimeConfig();

const schema = new mongoose.Schema(
    {
            ka_department: { type: String, required: true, default: config.kaDeparment },
            name: { type: String, required: true },                             // Category name
            slug: { type: String, required: true },                             // Category name slug
            type: { type: String, required: true },                             // Type of category: quizz-category|formation-category
            soft_delete: {type: Date, default: null},                           // Member who update category
            creator: {type: mongoose.Types.ObjectId, ref: "staffingMembers"},   // Member who create category
            updater: {type: mongoose.Types.ObjectId, ref: "staffingMembers"},   // Member who update category
    },
    { timestamps: true, strict: true, strictQuery: true }
);

export default mongoose.model("categories", schema, "categories");
