import { users } from "../../dbModels";
const config = useRuntimeConfig();

const ka_department = config.kaDeparment;
const stage = "candidate";


interface IRequestBody {
    name: string;
    lastname: string;
    office: string;
    personalData: object;
    candidate: object;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("POST /api/candidates");
    const { name, lastname, office, personalData, candidate } = await readBody<IRequestBody>(event);

    try {
        const getData = await users.findOne({
            ka_department: { $eq: ka_department },
            stage: { $eq: stage },
            "personalData.email": { $eq: personalData.email },
        });
        if (getData) {
            if(config.envType === "DEV") console.log(`Candidate with email ${personalData.email} already exists`);
            event.res.statusCode = 409;
            return {
                code: "CANDIDATE_EXISTS",
                message: "Candidate with given company email already exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Create candidate member");
            const createdData = await users.create({
                name,
                lastname,
                office,
                stage,
                personalData,
                candidate,
            });
            return {
                id: createdData._id,
                name: createdData.name,
                lastname: createdData.lastname,
                companyEmail: createdData.companyEmail,
                candidate: createdData.candidate,
                personalData: createdData.personalData,
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
