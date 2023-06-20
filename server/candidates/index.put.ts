import { users } from "../../dbModels";
const config = useRuntimeConfig();

const ka_department = config.kaDeparment;
const stage = "candidate";

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
    candidate: object;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("PUT /api/candidate");
    const { id, employedId, companyEmail, password, name, lastname, office, personalData, security, candidate } = await readBody<IRequestBody>(event);

    try {
        const getData = await users.findOne({
            id: { $eq: id }
        });

        const checkDuplicate = await users.findOne({})
            .where('_id').ne(id)
            .where('ka_department').ne(ka_department)
            .where('stage').ne(stage)
            .where('personalData.email').ne(personalData.email)
            .select('id');

        if (!getData) {
            if (config.envType === "DEV") console.log(`Candidate with ID ${id} doesn't exists`);
            event.res.statusCode = 404;
            return {
                code: "CANDIDATE_NOT_EXISTS",
                message: "Staffing member with given ID doesn't exists.",
            };
        }else if(checkDuplicate) {
            if (config.envType === "DEV") console.log(`Candidate with email ${personalData.email} exists`);
            event.res.statusCode = 409;
            return {
                code: "CANDIDATE_EXISTS",
                message: "Candidate with given company email already exists.",
            };

        } else {
            if(config.envType === "DEV") console.log("Update candidate member");
            let data = {
                name,
                lastname,
                office,
                stage,
                employedId,
                companyEmail,
                personalData,
                security,
                candidate,
            }

            const createdData = await users.findOneAndUpdate({_id: id }, data);
            return {
                user: {
                    id: createdData._id,
                    name: createdData.name,
                    lastname: createdData.lastname,
                    office: createdData.office,
                    stage: createdData.stage,
                    personalData: createdData.personalData,
                    candidate: createdData.candidate,
                },
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
