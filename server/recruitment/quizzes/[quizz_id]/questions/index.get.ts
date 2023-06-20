import { quizzes } from "../../../../../dbModels";
const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
    const quizzId = event.context.params.quizz_id;
    if(config.envType === "DEV") console.log("GET /api/candidates/quizzes/questions");
    try {
        if(config.envType === "DEV") console.log("Get quizz questions");
        const responseData = await quizzes.findOne({
            _id: { $eq: quizzId },
            soft_delete: { $eq: null },
        })
            .populate({ path: 'questions.creator', select:["name", "lastname"] })
            .populate({ path: 'questions.updater', select:["name", "lastname"]  });
        return responseData.questions.map((row) => ({
            id: row._id,
            question: row.question,
            type:  row.type,
            questionCategory:  row.questionCategory,
            correctPoints:  row.correctPoints,
            incorrectPoints:  row.incorrectPoints,
            showQuestionPoints:  row.showQuestionPoints,
            forceResponse:  row.forceResponse,
            terminateOnWrong:  row.terminateOnWrong,
            answers: row.answers,
            creator: row.creator,
            updater: row.updater,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        }));
    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
});
