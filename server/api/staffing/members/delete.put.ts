import { users } from "../../../dbModels";
const config = useRuntimeConfig();

interface IRequestBody {
    id: string;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("PUT /api/staffing/members/delete");
    const { id } = await readBody<IRequestBody>(event);

    try {
        const getData = await users.findOne({
            _id: { $eq: id }
        });
        if (!getData) {
            if(config.envType === "DEV") console.log(`Staffing member with ID ${id} doesn't exists`);
            event.res.statusCode = 409;
            return {
                code: "STAFFING_MEMBER_NOT_EXISTS",
                message: "Staffing member with given ID doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Update staffing member");
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
