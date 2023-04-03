import { users } from "../../../dbModels";
const config = useRuntimeConfig();

const stage = "staffing";

interface IRequestBody {
    id: string;
    name: string;
    lastname: string;
    office: string;
    employedId: string;
    companyEmail: string;
    password: string;
    personalData: object;
    security: object;
    staffing: object;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("PUT /api/staffing/members");
    const { id, employedId, companyEmail, password, name, lastname, office, personalData, security, staffing } = await readBody<IRequestBody>(event);

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
            if(config.envType === "DEV") console.log("Delete staffing member");
            let data = {
                name,
                lastname,
                office,
                stage,
                employedId,
                companyEmail,
                personalData,
                security,
                staffing,
            }

            if( password !== "") data.password = password;

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
