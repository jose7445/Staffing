import {categories, quizzes} from "../../../dbModels";
import { getLanguages, getQuestionTypes } from "../../../utils";
import slugify from "slugify";

const config = useRuntimeConfig();
const quizzCategory = "quizz-category";
const quizzType = "candidates";
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    enabled: boolean;
    name: string;
    category: string;
    description: string;
    quizzLanguage: string;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("POST /api/recruitment/quizzes");
    const { enabled, name, category, description, quizzLanguage } = await readBody<IRequestBody>(event);
    const slug = slugify(name, {remove: /[*+~.()'"!:@]/g, lower: true});
    try {
        const data = await quizzes.findOne({
            ka_department: { $eq: config.kaDeparment },
            type: { $eq: quizzType },
            slug: { $eq: slug },
        });
        if (data) {
            if(config.envType === "DEV") console.log(`Quizz with slug ${slug} already exists`);
            event.res.statusCode = 409;
            return {
                code: "QUIZZ_EXISTS",
                message: "Quizz with given slug already exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Create quizz");
            const newData = await quizzes.create({
                enabled: enabled,
                ka_department: config.kaDeparment,
                type: quizzType,
                name: name,
                slug: slug,
                category: category,
                questionsCategories: [{ name: "Genérica", slug: "generica"}],
                description: description,
                quizzLanguage: quizzLanguage,
                creator: owner,
                updater: owner,
            });

            const categs = await categories.find({
                ka_department: { $eq: config.kaDeparment },
                type: { $eq: quizzCategory },
                soft_delete: { $eq: null },
            }).select(['_id', 'name', 'slug']);

            return {
                langs: getLanguages().map( (lang) => ({
                    "label": lang.name,
                    "value": lang.value
                })),
                questions_types: getQuestionTypes().map( (qt) => ({
                    "label": qt.name,
                    "value": qt.value,
                    "template": qt.template,
                })),
                categories: categs.map( (qt) => ({
                    "label": qt.name,
                    "value": qt.id
                })),
                quizz: {
                    _id: newData._id,
                    id: newData._id,
                    name: newData.name,
                    slug: newData.slug,
                    enabled: newData.enabled,
                    status: newData.status,
                    category: newData.category,
                    description: newData.description,
                    quizzLanguage: newData.quizzLanguage,
                    questionsCategories: newData.questionsCategories,
                    questions: newData.questions,
                    questionsSet: newData.questionsSet,
                    security: newData.security,
                    startPage: newData.startPage,
                    finishPage: newData.finishPage,
                    timeSettings: newData.timeSettings,
                    certificateSetting: newData.certificateSetting,
                    creator: newData.creator,
                    updater: newData.updater,
                    createdAt: newData.createdAt,
                    updatedAt: newData.updatedAt,
                },
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
