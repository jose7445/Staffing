import { quizzes } from "../../../../../dbModels";
import slugify from "slugify";

const config = useRuntimeConfig();
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    name: string;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("POST /api/quizzes/[quizz_id]/questions-categories");
    const { name } = await readBody<IRequestBody>(event);
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
                message: "Quizz with given ID doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Create question category");
            let newData = {
                "name": name,
                "slug": slug,
            };
            responseData.questionsCategories.push(newData);
            responseData.save();
            const row = responseData.questionsCategories[responseData.questionsCategories.length - 1];
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
