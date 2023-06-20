import { categories } from "../../../../dbModels";
//import slugify from "slugify";

const config = useRuntimeConfig();
const quizzType = "quizz-category";

interface IRequestBody {
    _id: string;

}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("DELETE /api/recruitment/quizzes/categories");
    const { _id } = await readBody<IRequestBody>(event);
    //const slug = slugify(name, {remove: /[*+~.()'"!:@]/g, lower: true});
    const soft_delete = Date.now();
    try {
        const dataResponse = await categories.findOne({
            _id: { $eq: _id }
        });
        if (!dataResponse) {
            if(config.envType === "DEV") console.log(`Category with ID ${_id} doesn't exists`);
            event.res.statusCode = 404;
            return {
                code: "CATEGORY_NOT_FOUND",
                message: "Category with given id doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Delete quizz category");
            const newCategoryData = await categories.updateOne({_id: { $eq: _id }}, {
                soft_delete,

            })

            const quizzCategories = await categories.find({
                ka_department: { $eq: config.kaDeparment },
                type: { $eq: quizzType },
                soft_delete: { $eq: null },
            });
            return {
                quizz_categories:quizzCategories,
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
