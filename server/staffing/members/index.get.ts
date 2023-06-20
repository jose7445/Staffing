import { users } from "../../../dbModels";
import { getStaffData, getOffices } from "../../../utils";
const config = useRuntimeConfig();
const userStage = "staffing";
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("GET /api/staffing/members");
    try {
        if(config.envType === "DEV") console.log("Get staffing members");

        const candidateOptions = getStaffData();
        const offices = getOffices();

        /*const data = await users.find({
            ka_department: { $eq: config.kaDeparment },
            stage: { $eq: userStage },
            soft_delete: { $eq: null },
        });*/

        const data = await users.aggregate([
            // Buscamos los usuarios que cumplen ciertas condiciones
            { $match: { ka_department: { $eq: config.kaDeparment }, stage: { $eq: userStage }, soft_delete: { $eq: null } } },
            // Unimos la colección de proyectos con la colección de usuarios por el campo `userId` en la subcolección `teamMembers`
            {
                $lookup: {
                    from: 'projects',
                    let: { userId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $in: ['$$userId', '$teamMembers.userId'] } } },
                        { $project: { name: 1, status: 1, customer: 1, extCode: 1, office: 1, teamMembers: 1 } } // campos que deseas mostrar del proyecto
                    ],
                    as: 'projects'
                }
            }
        ])


        return {
            users: data.map((user) => ({
                _id: user._id,
                id: user._id,
                ka_department: user.ka_department,
                office: user.office,
                name: user.name,
                lastname: user.lastname,
                stage: user.stage,
                companyEmail: user.companyEmail,
                employedId: user.employedId,
                password: user.password,
                security: user.security,
                personalData: user.personalData,
                staffing: user.staffing,
                projects: user.projects
            })),
            staff_options: candidateOptions,
            offices: offices,
        };


    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
});
