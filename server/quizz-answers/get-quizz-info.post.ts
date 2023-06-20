import { quizzes, users } from "../../dbModels";
import {generateWorkingDatesWithInfo, getLanguages, getQuestionTypes} from "~/server/utils";
import {categories, usersAssignations} from "~/server/dbModels";
const config = useRuntimeConfig();

const ka_department = config.kaDeparment;
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    email: string;
    candidateId: number;
    quizzId: string;
}

export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("POST /api/quizz-answers-info/");
    const { email, candidateId, quizzId } = await readBody<IRequestBody>(event);

    try {

        const quizzData = await quizzes.findOne({
            "_id": quizzId,
            soft_delete: { $eq: null },
            enabled: { $eq: true },
        });

        if(!quizzData) {
            if (config.envType === "DEV") console.log(`Quizz with ID ${quizzId} doesn't exists`);
            event.res.statusCode = 404;
            return {
                code: "QUIZZ_NOT_EXISTS",
                message: "Quizz with given ID doesn't exists.",
            };
        }else{

            return {
                quizz: {
                    _id: quizzData._id,
                    name: quizzData.name,
                    quizzLanguage: quizzData.quizzLanguage,
                    startPage: quizzData.startPage
                }
            };
        }

    } catch (err) {
        if(config.envType === "DEV") console.error('Error getting quizz answers:', err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something wrong.",
        };
    }
});
