import {projects, users} from "../../../../../dbModels";
import {ObjectID} from "bson";
const config = useRuntimeConfig();
const ka_department = config.kaDeparment;
const stage = "staffing";
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data
interface IRequestBody {
    id: string;
    rows: [ObjectID];
}

export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("DELETE /api/staffing/projects/[project_id]/members");
    const { id, rows } = await readBody<IRequestBody>(event);
    const project_id = event.context.params.project_id;

    try {
        const projectData = await projects.updateOne({
            _id: { $eq: project_id },
            stage: { $eq: stage },
            ka_department: { $eq: ka_department },
        },{ "$pull": { "teamMembers": {"_id": {$in:rows} } } }, {new:true});
        if (!projectData) {
            if(config.envType === "DEV") console.log(`Project with ID ${id} doesn't exists`);
            event.res.statusCode = 409;
            return {
                code: "STAFF_PROJECT_NOT_EXISTS",
                message: "Staff project with given ID doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Delete staff project member");
            const responseData = await projects.findOne({
                _id: { $eq: project_id },
                stage: { $eq: stage },
                ka_department: { $eq: ka_department },
            });
            return {
                project: responseData
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
