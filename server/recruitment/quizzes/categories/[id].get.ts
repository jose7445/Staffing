import { categories } from "../../../../dbModels";
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const id = event.context.params.id;
    if(config.envType === "DEV") console.log("GET /api/recruitment/quizzes/categories");
    try {
        if(config.envType === "DEV") console.log("Find quizzes categories");
        const dataResponse = await categories.findOne({
            "_id": id,
            soft_delete: { $eq: null },
        });
        if (!dataResponse) {
            if(config.envType === "DEV") console.log(`Category with email ${id} doesn't exists`);
            event.res.statusCode = 404;
            return {
                code: "CATEGORY_NOT_FOUND",
                message: "Category with given id doesn't exists.",
            };
        } else {
            return {
                id: dataResponse._id,
                name: dataResponse.name,
                slug: dataResponse.slug,
            };
        }
    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
});
