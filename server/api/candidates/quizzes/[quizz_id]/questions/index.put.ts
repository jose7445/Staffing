import { quizzes } from "../../../../../dbModels";

const config = useRuntimeConfig();
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    id: string;
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
    if(config.envType === "DEV") console.log("PUT /api/quizzes/[id]/questions");
    const { id, question, type, questionCategory, correctPoints, incorrectPoints, showQuestionPoints, forceResponse, terminateOnWrong, answers } = await readBody<IRequestBody>(event);
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
        }else if (!responseData.questions.id(id)){
            event.res.statusCode = 404;
            return {
                code: "QUESTION_QUIZZ_NOT_EXISTS",
                message: "Quizz question with given ID doesn't exists."
            };
        } else {
            if(config.envType === "DEV") console.log("Update quizz question");

            let newData = {
                "_id": id,
                "question": question,
                "type": type,
                "questionCategory": questionCategory,
                "correctPoints": correctPoints,
                "incorrectPoints": incorrectPoints,
                "showQuestionPoints": showQuestionPoints,
                "forceResponse": forceResponse,
                "terminateOnWrong": terminateOnWrong,
                "answers": answers,
                "creator": responseData.questions.id(id).creator,
                "updater": owner,
            };
            responseData.questions.id(id).set(newData);
            responseData.save();
            return {
                quizzId: responseData._id,
                quizzName: responseData.name,
                questions: responseData.questions
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
