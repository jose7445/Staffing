import {quizzes, users} from "../../../dbModels";
import slugify from "slugify";

const config = useRuntimeConfig();
const quizzType = "candidates";
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    id: string,
    rows: [],

}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("PUT /api/candidates/quizzes/delete AAA");
    const { id, rows } = await readBody<IRequestBody>(event);
    try {

        let dataObj = {
            soft_delete: Date.now(),
            updater: owner,
        }

        if(rows.length){
            const updatedData = await quizzes.updateMany({ _id: { $in: rows } }, dataObj);
        }else{
            const updatedData = await quizzes.updateOne({_id: { $eq: id }}, dataObj);
        }

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


    } catch (err) {
        if(config.envType === "DEV") console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something wrong.",
        };
    }
});
