import {categories, quizzes, users} from "../../../dbModels";
import { getLanguages, getQuestionTypes } from "../../../utils";
const config = useRuntimeConfig();
const quizzType = "candidates";
const quizzTypeCategory = "quizz-category";

export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("GET /api/recruitment//quizzes");
    try {
        if(config.envType === "DEV") console.log("Get quizzes");
        const quizzesData = await quizzes.find({
            ka_department: { $eq: config.kaDeparment },
            type: { $eq: quizzType },
            soft_delete: { $eq: null },
        })
            //.populate({ path: 'category', select:["name", "slug"] })
            .populate({ path: 'creator', select:["name", "lastname"] })
            .populate({ path: 'updater', select:["name", "lastname"]  });

        const categs = await categories.find({
            ka_department: { $eq: config.kaDeparment },
            type: { $eq: quizzTypeCategory },
            soft_delete: { $eq: null },
        }).select(['_id', 'name', 'slug']);

        //console.log(quizzesData[0]);

        return {
            quizzes: quizzesData,
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
            }))
        }
        /*
        return data.map((row) => ({
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
        }));
         */
    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
});
