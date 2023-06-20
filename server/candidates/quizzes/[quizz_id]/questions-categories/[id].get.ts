import { quizzes } from "../../../../../dbModels";
const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
    const quizzId = event.context.params.quizz_id;
    const id = event.context.params.id;
    if(config.envType === "DEV") console.log("GET /api/candidates/quizzes/[quizz_id]/questions/[id]");
    try {
        if(config.envType === "DEV") console.log("Get quizz question");
        const responseData = await quizzes.findOne({
            "_id": { $eq: quizzId },
            "soft_delete": { $eq: null },
        })
            .populate({ path: 'questions.creator', select:["name", "lastname"] })
            .populate({ path: 'questions.updater', select:["name", "lastname"]  });
        const row = responseData.questionsCategories.id(id);
        return {
            id: row._id,
            question: row.name,
            type:  row.slug,
        };
    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
});
