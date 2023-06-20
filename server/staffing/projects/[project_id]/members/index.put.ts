import { projects, users } from "../../../../../dbModels";

const config = useRuntimeConfig();
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    _id: string,
    userId: string;
    fullname: string;
    status: string;
    dedication: number;
    startDate: number;
    endDate: number;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("PUT /api/staffing/projects/[project_id]/members");
    const { _id, userId, fullname, status, dedication, startDate, endDate } = await readBody<IRequestBody>(event);
    const project_id = event.context.params.project_id;
    try {

        // Get member data
        const userData = await users.findOne({
            _id: { $eq: userId },
            soft_delete: { $eq: null },
        });

        // Get project date
        const projectData = await projects.findOne({
            _id: { $eq: project_id },
            soft_delete: { $eq: null },
        });

        let newData = {
            "userId": userId,
            "fullname": userData.name +' '+userData.lastname,
            "office": userData.office,
            "categoryPosition": userData.staffing.categoryPosition,
            "employedId": userData.employedId,
            "startDate": startDate,
            "endDate": endDate,
            "status": status,
            "dedication": dedication,
            "creator": owner,
            "updater": owner,
        };

        if (!projectData) {
            event.res.statusCode = 404;
            return {
                code: "PROJECT_NOT_EXISTS",
                message: "Project with given ID doesn't exists.",
            };
        }else if (projectData && !projectData.teamMembers.id(_id)){

            if(config.envType === "DEV") console.log("Add member to project");
            // Add user
            projectData.teamMembers.push(newData);
            await projectData.save();

            return {
                member: newData,
                project: projectData,
                user: userData
            };

        } else {
            if(config.envType === "DEV") console.log("Update member to project");


            projectData.teamMembers.id(_id).set(newData);
            await projectData.save();

            return {
                member: newData,
                project: projectData,
                user: userData
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
