import { projects } from "../../../dbModels";
const config = useRuntimeConfig();
const ka_department = config.kaDeparment;
const stage = "staffing";
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data
interface IRequestBody {
    _id: string;
    rows: [];
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("DELETE /api/staffing/members");
    const { _id, rows } = await readBody<IRequestBody>(event);

    try {
        const getData = await projects.findOne({
            id: { $eq: _id },
            stage: { $eq: stage },
            ka_department: { $eq: ka_department },
        });
        if (!getData) {
            if(config.envType === "DEV") console.log(`Staff project with ID ${id} doesn't exists`);
            event.res.statusCode = 409;
            return {
                code: "STAFF_PROJECT_NOT_EXISTS",
                message: "Staff project with given ID doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Delete staff project");
            let dataObj = {
                soft_delete: Date.now(),
                updater: owner,
            }

            const createdData = rows?.length
                ? await projects.updateMany({ _id: { $in: rows } }, dataObj)
                : await projects.findOneAndUpdate({_id: _id}, dataObj)


            const retrieveData = await projects.find({
                ka_department: { $eq: ka_department },
                stage: { $eq: stage },
                soft_delete: { $eq: null },
            });
            return {
                matchedCount: createdData.matchedCount,
                modifiedCount: createdData.modifiedCount,
                upsertedId: createdData.upsertedId,
                projects: retrieveData.map((project) => ({
                    _id: project._id,
                    name: project.name,
                    description: project.description,
                    status: project.status,
                    extCode: project.extCode,
                    office: project.office,
                    category: project.category,
                    customer: project.customer,
                    type: project.type,
                    technology: project.technology,
                    budget: project.budget,
                    estimatedDuration: {
                        duration: project.estimatedDuration.duration,
                        unit: project.estimatedDuration.unit
                    },
                    startDate: project.startDate,
                    endDate: project.endDate,
                    manager: project.manager,
                    projectLead: project.projectLead,
                    creator: project.creator,
                    createdAt: project.createdAt,
                    updater: project.updater,
                    updatedAt: project.updatedAt
                })),
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
