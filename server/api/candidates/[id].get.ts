import { users } from "../../dbModels";
const config = useRuntimeConfig();

const ka_department = config.kaDeparment;
const stage = "candidate";
export default defineEventHandler(async (event) => {
    const id = event.context.params.id;
    if(config.envType === "DEV") console.log("GET ID /api/candidates/");
    try {
        if(config.envType === "DEV") console.log("Get candidate info");
        const responseData = await users.findOne({
            "_id": id,
            stage: { $eq: stage },
            ka_department: { $eq: ka_department },
            soft_delete: { $eq: null },
        });
        if (!responseData) {
            if(config.envType === "DEV") console.log(`Candidate with ID ${id} doesn't exists`);
            event.res.statusCode = 404;
            return {
                code: "USER_NOT_FOUND",
                message: "Candidate member with given id doesn't exists.",
            };
        } else {
            return {
                id: responseData._id,
                name: responseData.name,
                lastname: responseData.lastname,
                office: responseData.office,
                stage: responseData.stage,
                employedId: responseData.employedId,
                companyEmail: responseData.companyEmail,
                security:responseData.security,
                staffing: responseData.staffing,
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
