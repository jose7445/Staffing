import { users } from "../../../dbModels";
const config = useRuntimeConfig();
const userStage = "staffing";
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("GET /api/staffing/members");
    try {
        if(config.envType === "DEV") console.log("Get staffing members");
        const data = await users.find({
            ka_department: { $eq: config.kaDeparment },
            stage: { $eq: userStage },
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
