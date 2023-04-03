import { categories } from "../../../../dbModels";
//import slugify from "slugify";

const config = useRuntimeConfig();
const quizzType = "quizz-category";

interface IRequestBody {
    id: string;

}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("DELETE /api/quizzes/categories/delete");
    const { id } = await readBody<IRequestBody>(event);
    //const slug = slugify(name, {remove: /[*+~.()'"!:@]/g, lower: true});
    const soft_delete = Date.now();
    try {
        const dataResponse = await categories.findOne({
            _id: { $eq: id }
        });
        if (!dataResponse) {
            if(config.envType === "DEV") console.log(`Category with email ${id} doesn't exists`);
            event.res.statusCode = 404;
            return {
                code: "CATEGORY_NOT_FOUND",
                message: "Category with given id doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Update quizz category", dataResponse);
            const newCategoryData = await categories.updateOne({_id: { $eq: id }}, {
                soft_delete,

            })
            return {
                matchedCount: newCategoryData.matchedCount,
                modifiedCount: newCategoryData.modifiedCount,
                upsertedId: newCategoryData.upsertedId,
            };
        }
    } catch (err) {
        if(config.envType === "DEV") console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something wrong.",
        };
    }
});
