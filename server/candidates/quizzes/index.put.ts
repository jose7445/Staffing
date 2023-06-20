import {categories, quizzes} from "../../../dbModels";
import { getLanguages, getQuestionTypes } from "../../../utils";
import slugify from "slugify";

const quizzCategoryType = "quizz-category";
const quizzType = "candidates";
const config = useRuntimeConfig();
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    rows: [];
    id: string;
    _id: string;
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
    if(config.envType === "DEV") console.log("PUT /api/candidates/quizzes");
    const { rows, id,_id, enabled, status, name, category, description, quizzLanguage, questionsSet, security, startPage, finishPage, timeSettings, certificateSetting } = await readBody<IRequestBody>(event);
    try {

        if(rows?.length){

            /* BATCH DELETE */
            let dataObj = {
                soft_delete: Date.now(),
                updater: owner,
            }
            const updatedData = await quizzes.updateMany({ _id: { $in: rows } }, dataObj);
            const retrieveData = await quizzes.find({
                ka_department: { $eq: config.kaDeparment },
                type: { $eq: quizzType },
                soft_delete: { $eq: null },
            })
                .populate({ path: 'category', select:["name", "slug"] })
                .populate({ path: 'creator', select:["name", "lastname"] })
                .populate({ path: 'updater', select:["name", "lastname"]  });


            return {
                matchedCount: updatedData.matchedCount,
                modifiedCount: updatedData.modifiedCount,
                upsertedId: updatedData.upsertedId,
                quizzes: retrieveData.map((row) => ({
                    id: row._id,
                    name: row.name,
                    slug: row.slug,
                    enabled: row.enabled,
                    status: row.status,
                    category: row.category,
                    questionsCategories: row.questionsCategories,
                    questions: row.questions,
                    creator: row.creator,
                    updater: row.updater,
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                }))
            };

        }else{

            /* UPDATE QUIZZ */
            const ide = id ? id : _id;
            const getQuizz = await quizzes.findOne({
                _id: { $eq: ide }
            });
            if (!getQuizz) {
                if(config.envType === "DEV") console.log(`Quizz with ID ${ide} doesn't exists`);
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

                const updatedData = await quizzes.findOneAndUpdate({_id: { $eq: ide }},dataObj);



                const categs = await categories.find({
                    ka_department: { $eq: config.kaDeparment },
                    type: { $eq: quizzCategoryType },
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
                        id: updatedData._id,
                        _id: updatedData._id,
                        name: updatedData.name,
                        slug: updatedData.slug,
                        enabled: updatedData.enabled,
                        status: updatedData.status,
                        category: updatedData.category,
                        description: updatedData.description,
                        quizzLanguage: updatedData.quizzLanguage,
                        questionsCategories: updatedData.questionsCategories,
                        questions: updatedData.questions,
                        questionsSet: updatedData.questionsSet,
                        security: updatedData.security,
                        startPage: updatedData.startPage,
                        finishPage: updatedData.finishPage,
                        timeSettings: updatedData.timeSettings,
                        certificateSetting: updatedData.certificateSetting,
                        creator: updatedData.creator,
                        updater: updatedData.updater,
                        createdAt: updatedData.createdAt,
                        updatedAt: updatedData.updatedAt,
                    },
                };
            }

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
