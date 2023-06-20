import { quizzes } from "../../../../../dbModels";

const config = useRuntimeConfig();
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    type: string;
    randomCategories: [];
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("PUT /api/recruitment/quizzes/[quizz_id]/questions-sets");
    const { type, randomCategories } = await readBody<IRequestBody>(event);
    const quizzId = event.context.params.quizz_id;
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
        } else {
            if(config.envType === "DEV") console.log("Update quizz question-sets");

            let newData = {
                "questionsSet": {
                    "type": type,
                    "randomCategories": randomCategories.map(item => {
                        return {'categorySlug': item.categorySlug, 'drawNumber': item.drawNumber}
                    })
                }
            };

            const updatedData = await quizzes.findOneAndUpdate({_id: { $eq: quizzId }},newData);
            return updatedData;

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
