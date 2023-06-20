import {categories, quizzes} from "../../../../dbModels";
import slugify from "slugify";

const config = useRuntimeConfig();
const quizzType = "quizz-category";

interface IRequestBody {
    _id: string;
    name: string;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("PUT /api/recruitment/quizzes/categories");
    const { _id, name } = await readBody<IRequestBody>(event);
    const slug = slugify(name, {remove: /[*+~.()'"!:@]/g, lower: true});
    const type = quizzType;
    try {

        const updatedData = await categories.findOneAndUpdate({_id: { $eq: _id }},{
            name,
            slug,
            type
        });

        if (!updatedData) {
            if(config.envType === "DEV") console.log(`Category with ID ${_id} doesn't exists`);
            event.res.statusCode = 404;
            return {
                code: "QUIZZ_CATEGORY_NOT_FOUND",
                message: "Category with given id doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Update quizz category");
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
