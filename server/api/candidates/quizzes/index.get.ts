import { quizzes, users } from "../../../dbModels";
const config = useRuntimeConfig();
const quizzType = "candidates";
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("GET /api/candidates/quizzes");
    try {
        if(config.envType === "DEV") console.log("Get quizzes");
        const data = await quizzes.find({
            ka_department: { $eq: config.kaDeparment },
            type: { $eq: quizzType },
            soft_delete: { $eq: null },
        })
            .populate({ path: 'category', select:["name", "slug"] })
            .populate({ path: 'creator', select:["name", "lastname"] })
            .populate({ path: 'updater', select:["name", "lastname"]  });
        return data.map((row) => ({
            id: row._id,
            name: row.name,
            slug: row.slug,
            enabled: row.enabled,
            status: row.status,
            category: row.category,
            questionsCategories: row.questionsCategories,
            creator: row.creator,
            updater: row.updater,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
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
