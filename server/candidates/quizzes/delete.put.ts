import { quizzes } from "../../../dbModels";
import slugify from "slugify";

const config = useRuntimeConfig();
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    id: string;

}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("PUT /api/quizzes/delete");
    const { id } = await readBody<IRequestBody>(event);
    try {
        const getData = await quizzes.findOne({
            _id: { $eq: id }
        });
        if (!getData) {
            if(config.envType === "DEV") console.log(`Quizz with ID ${id} doesn't exists`);
            event.res.statusCode = 404;
            return {
                code: "QUIZZ_NOT_EXISTS",
                message: "Quizz with given ID doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Delete quizz");

            let dataObj = {
                soft_delete: Date.now(),
                updater: owner,
            }

            const updatedData = await quizzes.updateOne({_id: { $eq: id }},dataObj);

            return {
                matchedCount: updatedData.matchedCount,
                modifiedCount: updatedData.modifiedCount,
                upsertedId: updatedData.upsertedId,
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
