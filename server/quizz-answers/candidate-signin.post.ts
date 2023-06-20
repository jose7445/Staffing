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
        });

        const userData = await users.findOne({
            "personalData.email": email,
            "candidate.quizzId": quizzId,
            soft_delete: { $eq: null },
        });

        if(!quizzData) {
            if (config.envType === "DEV") console.log(`Quizz with ID ${quizzId} doesn't exists`);
            event.res.statusCode = 404;
            return {
                code: "QUIZZ_NOT_EXISTS",
                message: "Quizz with given ID doesn't exists.",
            };
        }else if (!userData){
            if (config.envType === "DEV") console.log(`Candidate with email ${email} doesn't exists`);
            event.res.statusCode = 404;
            return {
                code: "CANDIDATE_NOT_EXISTS",
                message: "Candidate with given email doesn't exists.",
            };
        }else{


            return {
                quizz: {
                    id: quizzData._id,
                    name: quizzData.name,
                    slug: quizzData.slug,
                    enabled: quizzData.enabled,
                    status: quizzData.status,
                    category: quizzData.category,
                    description: quizzData.description,
                    quizzLanguage: quizzData.quizzLanguage,
                    questionsCategories: quizzData.questionsCategories,
                    questions: quizzData.questions,
                    questionsSet: quizzData.questionsSet,
                    security: quizzData.security,
                    startPage: quizzData.startPage,
                    finishPage: quizzData.finishPage,
                    timeSettings: quizzData.timeSettings,
                    certificateSetting: quizzData.certificateSetting,
                    creator: quizzData.creator,
                    updater: quizzData.updater,
                    createdAt: quizzData.createdAt,
                    updatedAt: quizzData.updatedAt,
                },
                user: {
                    name: userData.name,
                    lastname: userData.lastname
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
