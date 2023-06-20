import { projects, users } from "../../../dbModels";
import { getOffices, getProjectsData} from "../../../utils";
const config = useRuntimeConfig();
const stage = "staffing";

function formatDate(date = new Date(), type = 'us'){

    let dt = new Date(date);
    var d = dt.getDate();
    var m = dt.getMonth() + 1;
    var y = dt.getFullYear();
    return type === 'us' ? y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d) : (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y

};

export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("GET /api/staffing/projects");
    try {
        if(config.envType === "DEV") console.log("Get staffing projects");

        const projectsOptions = getProjectsData();
        const offices = getOffices();
        const members =await users.find({
            ka_department: { $eq: config.kaDeparment },
            stage: { $eq: stage },
            "staffing.categoryPosition": { $in: ['project-lead', 'technical-manager', 'manager'] },
            soft_delete: { $eq: null },
        });

        const data = await projects.find({
            ka_department: { $eq: config.kaDeparment },
            stage: { $eq: stage },
            soft_delete: { $eq: null },
        });


        return {
            users: members.map((user) => ({
                value: user._id,
                label: user.name + ' ' + user.lastname,
                options: {
                    category: user.staffing.categoryPosition
                }
            })),
            projects: data.map((project) => ({
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
                startDate: project.startDate ? new Date(project.startDate).valueOf() : null, // Convert to EPOC date
                endDate: project.endDate ? new Date(project.endDate).valueOf() : null,       // Convert to EPOC date
                manager: project.manager,
                projectLead: project.projectLead,
                teamMembers: project.teamMembers,
                creator: project.creator,
                createdAt: project.createdAt,
                updater: project.updater,
                updatedAt: project.updatedAt
            })),
            project_options: projectsOptions,
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
