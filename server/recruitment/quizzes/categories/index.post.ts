import { categories } from "../../../../dbModels";
import slugify from "slugify";

const config = useRuntimeConfig();
const quizzType = "quizz-category";

interface IRequestBody {
    name: string;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("POST /api/recruitment/quizzes/categories");
    const { name } = await readBody<IRequestBody>(event);
    const slug = slugify(name, {remove: /[*+~.()'"!:@]/g, lower: true});
    const type = quizzType;
    try {
        const data = await categories.findOne({
            ka_department: { $eq: config.kaDeparment },
            type: { $eq: quizzType },
            slug: { $eq: slug },
        });
        if (data) {
            if(config.envType === "DEV") console.log(`Quizz category with slug ${slug} already exists`);
            event.res.statusCode = 409;
            return {
                code: "QUIZZ_CATEGORY__EXISTS",
                message: "Quizz category with given slug already exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Create quizz category");
            const newCategoryData = await categories.create({
                name,
                slug,
                type
            });

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
