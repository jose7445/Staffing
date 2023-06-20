import { quizzes } from "../../../../../dbModels";
const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
    const quizzId = event.context.params.quizz_id;
    const id = event.context.params.id;
    if(config.envType === "DEV") console.log("GET /api/candidates/quizzes/[quizz_id]/questions/[id]");
    try {
        if(config.envType === "DEV") console.log("Get quizz question");
        const responseData = await quizzes.findOne({
            "_id": { $eq: quizzId },
            "soft_delete": { $eq: null },
        })
            .populate({ path: 'questions.creator', select:["name", "lastname"] })
            .populate({ path: 'questions.updater', select:["name", "lastname"]  });
        const row = responseData.questions.id(id);
        if (!row) {
            if(config.envType === "DEV") console.log(`Question with ID ${id} doesn't exists`);
            event.res.statusCode = 404;
            return {
                code: "QUESTION_NOT_FOUND",
                message: "Question with given id doesn't exists.",
            };
        } else {
            return {
                id: row.question._id,
                _id: row.question._id,
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
            };
        }

    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
});
