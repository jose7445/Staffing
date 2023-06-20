import { categories } from "../../../../dbModels";
const config = useRuntimeConfig();
const quizzType = "quizz-category";
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("GET /api/candidates/quizzes/categories");
    try {
        if(config.envType === "DEV") console.log("Find quizzes categories");
        const data = await categories.find({
            ka_department: { $eq: config.kaDeparment },
            type: { $eq: quizzType },
            soft_delete: { $eq: null },
        });
        return data.map((category) => ({
            id: category._id,
            name: category.name,
            slug: category.slug,
        }));
    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
});
