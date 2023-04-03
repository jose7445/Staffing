import { quizzes } from "../../../dbModels";
import slugify from "slugify";

const config = useRuntimeConfig();
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    id: string;
    enabled: boolean;
    status: string;
    name: string;
    category: string;
    description: string;
    quizzLanguage: string;
    questionsSet: object;
    security: object;
    startPage: object;
    finishPage: object
    timeSettings: object
    certificateSetting: object;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("PUT /api/quizzes");
    const { id, enabled, status, name, category, description, quizzLanguage, questionsSet, security, startPage, finishPage, timeSettings, certificateSetting } = await readBody<IRequestBody>(event);
    try {
        const getData = await quizzes.findOne({
            _id: { $eq: id }
        });
        if (!getData) {
            if(config.envType === "DEV") console.log(`Quizz with ID ${id} doesn't exists`);
            event.res.statusCode = 409;
            return {
                code: "QUIZZ_NOT_EXISTS",
                message: "Quizz with given ID doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Update quizz");

            let dataObj = {
                enabled: enabled,
                status: status,
                category: category,
                description: description,
                quizzLanguage: quizzLanguage,
                questionsSet: questionsSet,
                security: security,
                startPage: startPage,
                finishPage: finishPage,
                timeSettings: timeSettings,
                certificateSetting: certificateSetting,
                updater: owner,
            }

            console.log("Name: ", name);

            if(name !== "" && name !== undefined){
                dataObj.name = name;
                dataObj.slug = slugify(name, {remove: /[*+~.()'"!:@]/g, lower: true});
            }

            const updatedData = await quizzes.updateOne({_id: { $eq: id }},dataObj);

            return {
                matchedCount: updatedData.matchedCount,
                modifiedCount: updatedData.modifiedCount,
                upsertedId: updatedData.upsertedId,
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
