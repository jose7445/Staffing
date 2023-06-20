import { quizzes } from "../../../../../dbModels";

const config = useRuntimeConfig();

interface IRequestBody {
    id: string;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("PUT DELETE /api/quizzes/[id]/questions");
    const { id } = await readBody<IRequestBody>(event);
    const quizzId = event.context.params.quizz_id;
    try {
        const responseData = await quizzes.updateOne({
            _id: { $eq: quizzId },
            soft_delete: { $eq: null },

    },{ "$pull": { "questions": {"_id": id} } }, {new:true});
        if (!responseData) {
            event.res.statusCode = 404;
            return {
                code: "QUIZZ_NOT_EXISTS",
                message: "Quizz question with given ID doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Delete quizz question");
            return responseData;
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
