import { users } from "../../dbModels";
const config = useRuntimeConfig();

const ka_department = config.kaDeparment;
const stage = "candidate";
interface IRequestBody {
    id: string;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("PUT DELETE /api/candidates/delete");
    const { id } = await readBody<IRequestBody>(event);

    try {
        const getData = await users.findOne({
            _id: { $eq: id },
            stage: { $eq: stage },
            ka_department: { $eq: ka_department },
        });
        if (!getData) {
            if(config.envType === "DEV") console.log(`Candidate with ID ${id} doesn't exists`);
            event.res.statusCode = 409;
            return {
                code: "STAFFING_MEMBER_NOT_EXISTS",
                message: "Candidate with given ID doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Delete Candidate");
            let data = {
                soft_delete: Date.now(),
            }

            const createdData = await users.updateOne({_id: { $eq: id }}, data);
            return {
                matchedCount: createdData.matchedCount,
                modifiedCount: createdData.modifiedCount,
                upsertedId: createdData.upsertedId,
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
