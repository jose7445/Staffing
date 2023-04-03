import { quizzes } from "../../../../../dbModels";

const config = useRuntimeConfig();
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    question: string;
    type: string;
    questionCategory: string;
    correctPoints: number;
    incorrectPoints: number;
    showQuestionPoints: boolean;
    forceResponse: boolean;
    terminateOnWrong: boolean;
    answers: object[];
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("POST /api/quizzes/[id]/questions");
    const { question, type, questionCategory, correctPoints, incorrectPoints, showQuestionPoints, forceResponse, terminateOnWrong, answers } = await readBody<IRequestBody>(event);
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
                message: "Quizz with given ID doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Create quizz");
            let newData = {
                "question": question,
                "type": type,
                "questionCategory": questionCategory,
                "correctPoints": correctPoints,
                "incorrectPoints": incorrectPoints,
                "showQuestionPoints": showQuestionPoints,
                "forceResponse": forceResponse,
                "terminateOnWrong": terminateOnWrong,
                "answers": answers,
                "creator": owner,
            };
            responseData.questions.push(newData);
            responseData.save();
            const row = responseData.questions[responseData.questions.length - 1];
            return {
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
