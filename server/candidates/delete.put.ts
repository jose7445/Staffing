import { users } from "../../dbModels";
const config = useRuntimeConfig();

const ka_department = config.kaDeparment;
const stage = "candidate";
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data
interface IRequestBody {
    id: string;
    rows: [];
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("PUT DELETE /api/candidates/delete");
    const { id, rows } = await readBody<IRequestBody>(event);

    try {
        const getData = await users.findOne({
            id: { $eq: id },
            stage: { $eq: stage },
            ka_department: { $eq: ka_department },
        });
        if (!getData) {
            if(config.envType === "DEV") console.log(`Candidate with ID ${id} doesn't exists`);
            event.res.statusCode = 409;
            return {
                code: "CANDIDATE_EXISTS",
                message: "Candidate with given ID doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Delete candidate");
            let dataObj = {
                soft_delete: Date.now(),
                updater: owner,
            }

            console.log(rows, dataObj);

            const createdData = rows?.length
                ? await users.updateMany({ _id: { $in: rows } }, dataObj)
                : await users.findOneAndUpdate({_id: id}, dataObj)


            const retrieveData = await users.find({
                ka_department: { $eq: ka_department },
                stage: { $eq: stage },
                soft_delete: { $eq: null },
            });
            return {
                matchedCount: createdData.matchedCount,
                modifiedCount: createdData.modifiedCount,
                upsertedId: createdData.upsertedId,
                users: retrieveData.map((user) => ({
                    _id: user._id,
                    id: user._id,
                    name: user.name,
                    lastname: user.lastname,
                    office: user.office,
                    stage: user.stage,
                    employedId: user.employedId,
                    companyEmail: user.companyEmail,
                    personalData: user.personalData,
                    security:user.security,
                    staffing: user.staffing,
                })),
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
