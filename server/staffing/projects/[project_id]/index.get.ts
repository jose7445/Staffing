import { projects } from "../../../../dbModels";
const config = useRuntimeConfig();

const ka_department = config.kaDeparment;
const stage = "staffing";
export default defineEventHandler(async (event) => {
    const _id = event.context.params.project_id;
    if(config.envType === "DEV") console.log("GET ID /api/projects/");
    try {
        if(config.envType === "DEV") console.log("Get staffing project info");
        const project = await projects.findOne({
            "_id": _id,
            soft_delete: { $eq: null },
        });
        if (!project) {
            if(config.envType === "DEV") console.log(`Staffing project with ID ${_id} doesn't exists`);
            event.res.statusCode = 404;
            return {
                code: "USER_NOT_FOUND",
                message: "Staffing project with given id doesn't exists.",
            };
        } else {
            return {
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
            };
        }
    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
});
