import { quizzes } from "../../../../../dbModels";
import slugify from "slugify";

const config = useRuntimeConfig();
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    id: string;
    name: string;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("PUT /api/quizzes/[id]/questions-categories");
    const { id, name } = await readBody<IRequestBody>(event);
    const quizzId = event.context.params.quizz_id;
    const slug = slugify(name, {remove: /[*+~.()'"!:@]/g, lower: true});
    try {
        const responseData = await quizzes.findOne({
            _id: { $eq: quizzId },
            soft_delete: { $eq: null },
        });
        if (!responseData) {
            event.res.statusCode = 404;
            return {
                code: "QUIZZ_NOT_EXISTS",
                message: "Quizz question with given ID doesn't exists.",
            };
        }else if (!responseData.questionsCategories.id(id)){
            event.res.statusCode = 404;
            return {
                code: "QUESTION_QUIZZ_CATEGORY_NOT_EXISTS",
                message: "Quizz question category with given ID doesn't exists."
            };
        } else {
            if(config.envType === "DEV") console.log("Update quizz question");

            let newData = {
                "_id": id,
                "name": name,
                "slug": slug,
            };
            responseData.questionsCategories.id(id).set(newData);
            responseData.save();
            const row = responseData.questionsCategories.id(id);
            return {
                id: row._id,
                name: row.name,
                categories: row.slug
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
