import { quizzes } from "../../../../../dbModels";
const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
    const quizzId = event.context.params.quizz_id;
    if(config.envType === "DEV") console.log("GET /api/candidates/quizzes/questions-categories");
    try {
        if(config.envType === "DEV") console.log("Get quizz questions");
        const responseData = await quizzes.findOne({
            _id: { $eq: quizzId },
            soft_delete: { $eq: null },
        })
        return responseData.questionsCategories.map((row) => ({
            id: row._id,
            question: row.name,
            type:  row.slug,
        }));
    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
});
