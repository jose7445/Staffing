import { users } from "../../../dbModels";
const config = useRuntimeConfig();

const ka_department = config.kaDeparment;
const stage = "staffing";


interface IRequestBody {
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
    if(config.envType === "DEV") console.log("POST /api/staffing/members");
    const { employedId, companyEmail, password, name, lastname, office, personalData, security, staffing } = await readBody<IRequestBody>(event);

    try {
        const getData = await users.findOne({
            ka_department: { $eq: ka_department },
            companyEmail: { $eq: companyEmail },
        });
        if (getData) {
            if(config.envType === "DEV") console.log(`Staffing member with email ${companyEmail} already exists`);
            event.res.statusCode = 409;
            return {
                code: "STAFFING_MEMBER_EXISTS",
                message: "Staffing member with given company email already exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Create staffing member");
            const createdData = await users.create({
                name,
                lastname,
                office,
                stage,
                employedId,
                companyEmail,
                password,
                personalData,
                security,
                staffing,
            });
            return {
                id: createdData._id,
                name: createdData.name,
                lastname: createdData.lastname,
                employedId: createdData.employedId,
                companyEmail: createdData.companyEmail,
                staffing: createdData.staffing,
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
