import { usersAssignations } from "../../../dbModels";
import { getStaffData, getOffices } from "../../../utils";
const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {

    const projectId = getQuery(event).projectId
    const userId = getQuery(event).userId

    if(config.envType === "DEV") console.log("GET /api/staffing/assignations");
    try {
        if(config.envType === "DEV") console.log("Get users assignations");

        const candidateOptions = getStaffData();
        const offices = getOffices();

        const data = await usersAssignations.find({
            ka_department: { $eq: config.kaDeparment },
            projectId: { $eq: projectId ? projectId : null },
            userId: { $eq: userId ? userId : null },
            soft_delete: { $eq: null },
        });

        return {
            assignations: data
        }

        console.log(data);
        /*
        return {
            assignations: data.map((assign) => ({
                _id: assign._id,
                id: assign._id,
                ka_department: assign.ka_department,
                office: assign.office,
                name: assign.name,
                lastname: assign.lastname,
                stage: assign.stage,
                companyEmail: assign.companyEmail,
                employedId: assign.employedId,
                password: assign.password,
                security: assign.security,
                personalData: assign.personalData,
                staffing: assign.staffing,
                projects: assign.projects
            })),
            staff_options: candidateOptions,
            offices: offices,
        };*/


    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
});
