import { quizzes, users } from "../../../dbModels";
const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
    const id = event.context.params.id;
    if(config.envType === "DEV") console.log("GET ID /api/candidates/quizzes");
    try {
        if(config.envType === "DEV") console.log("Get quizz info");
        const responseData = await quizzes.findOne({
            "_id": id,
            soft_delete: { $eq: null },
        })
            .populate({ path: 'category', select:["name", "slug"] })
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
            return {
                id: responseData._id,
                name: responseData.name,
                slug: responseData.slug,
                enabled: responseData.enabled,
                status: responseData.status,
                category: responseData.category,
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
