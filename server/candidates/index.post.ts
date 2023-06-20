import { users } from "../../dbModels";
const config = useRuntimeConfig();

const ka_department = config.kaDeparment;
const stage = "candidate";
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

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
                user: {
                    id: createdData._id,
                    name: createdData.name,
                    lastname: createdData.lastname,
                    office: createdData.office,
                    stage: createdData.stage,
                    personalData: createdData.personalData,
                    candidate: createdData.candidate,
                }
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
