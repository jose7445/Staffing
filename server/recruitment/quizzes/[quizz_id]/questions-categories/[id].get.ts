import { quizzes } from "../../../../../dbModels";
const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
    const quizzId = event.context.params.quizz_id;
    const id = event.context.params.id;
    if(config.envType === "DEV") console.log("GET /api/recruitment/quizzes/[quizz_id]/questions-categories/[quizz_id]");
    try {
        if(config.envType === "DEV") console.log("Get quizz question");
        const responseData = await quizzes.findOne({
            "_id": { $eq: quizzId },
            "soft_delete": { $eq: null },
        })
            .populate({ path: 'questions.creator', select:["name", "lastname"] })
            .populate({ path: 'questions.updater', select:["name", "lastname"]  });
        const row = responseData.questionsCategories.id(id);
        if (!row) {
            if(config.envType === "DEV") console.log(`Question category with ID ${id} doesn't exists`);
            event.res.statusCode = 404;
            return {
                code: "QUESTION_CATEGORY_NOT_FOUND",
                message: "Question category with given id doesn't exists.",
            };
        } else {
            return {
                id: row._id,
                question: row.name,
                type:  row.slug,
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
