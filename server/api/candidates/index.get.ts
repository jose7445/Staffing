import { users } from "../../dbModels";
const config = useRuntimeConfig();

const ka_department = config.kaDeparment;
const stage = "candidate";
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("GET /api/candidates");
    try {

        if(config.envType === "DEV") console.log("Get candidates list");
        const data = await users.find({
            ka_department: { $eq: ka_department },
            stage: { $eq: stage },
            soft_delete: { $eq: null },
        });

        return data.map((user) => ({
            id: user._id,
            ka_department: user.ka_department,
            office: user.office,
            name: user.name,
            lastname: user.lastname,
            stage: user.stage,
            companyEmail: user.companyEmail,
            password: user.password,
            security: user.security,
            personalData: user.personalData,
            staffing: user.staffing
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
