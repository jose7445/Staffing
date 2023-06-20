import { quizzes, users, categories } from "../../../../dbModels";
import { getLanguages, getQuestionTypes } from "../../../../utils";
const quizzType = "quizz-category";
const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
    const id = event.context.params.quizz_id;
    if(config.envType === "DEV") console.log("GET ID /api/candidates/quizzes/[quizz_id]");
    try {

        if(id === 'new'){
            /* NEW QUIZZ */
            if(config.envType === "DEV") console.log("Get info to create quizz");
            const categs = await categories.find({
                ka_department: { $eq: config.kaDeparment },
                type: { $eq: quizzType },
                soft_delete: { $eq: null },
            }).select(['_id', 'name', 'slug']);
            return {
                langs: getLanguages().map( (lang) => ({
                    "label": lang.name,
                    "value": lang.value
                })),
                questions_types: getQuestionTypes().map( (qt) => ({
                    "label": qt.name,
                    "value": qt.value
                })),
                categories: categs.map( (qt) => ({
                    "label": qt.name,
                    "value": qt.id
                })),
            };
        }else{
            /* RETRIEVE QUIZZ IF EXISTS*/
            if(config.envType === "DEV") console.log("Get quizz info: " + id);
            const responseData = await quizzes.findOne({
                "_id": id,
                soft_delete: { $eq: null },
            })
                .populate({ path: 'creator', select:["name", "lastname"] })
                .populate({ path: 'updater', select:["name", "lastname"]  });
            if(!responseData){
                if(config.envType === "DEV") console.log(`Quizz with ID ${id} doesn't exists`);
                event.res.statusCode = 404;
                return {
                    code: "QUIZZ_NOT_EXISTS",
                    message: "Quizz with given ID doesn't exists.",
                };
            }else{

                const categs = await categories.find({
                    ka_department: { $eq: config.kaDeparment },
                    type: { $eq: quizzType },
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
                        id: responseData._id,
                        name: responseData.name,
                        slug: responseData.slug,
                        enabled: responseData.enabled,
                        status: responseData.status,
                        category: responseData.category,
                        description: responseData.description,
                        quizzLanguage: responseData.quizzLanguage,
                        questionsCategories: responseData.questionsCategories,
                        questions: responseData.questions,
                        questionsSet: responseData.questionsSet,
                        security: responseData.security,
                        startPage: responseData.startPage,
                        finishPage: responseData.finishPage,
                        timeSettings: responseData.timeSettings,
                        certificateSetting: responseData.certificateSetting,
                        creator: responseData.creator,
                        updater: responseData.updater,
                        createdAt: responseData.createdAt,
                        updatedAt: responseData.updatedAt,
                    },
                };
            }
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
