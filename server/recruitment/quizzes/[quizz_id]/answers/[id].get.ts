import { quizzesAnswers } from "../../../../../dbModels";
const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
    const quizzId = event.context.params.quizz_id;
    const id = event.context.params.id;
    if(config.envType === "DEV") console.log("GET /api/candidates/quizzes/[quizz_id]/answers/[id]");
    try {
        if(config.envType === "DEV") console.log("Get quizz question");
        const responseData = await quizzesAnswers.findOne({
            "_id": { $eq: id },
            "quizzId": { $eq: quizzId },
            "soft_delete": { $eq: null },
        })
            .populate({ path: 'questions.creator', select:["name", "lastname"] })
            .populate({ path: 'questions.updater', select:["name", "lastname"]  });
        const row = responseData.questionsCategories.id(id);
        return {
            _id: responseData._id,
            question: responseData.name,
            type:  responseData.slug,
        };
    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
});
