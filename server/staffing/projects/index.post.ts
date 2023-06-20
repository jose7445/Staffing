import { projects } from "../../../dbModels";
const config = useRuntimeConfig();

const ka_department = config.kaDeparment;
const stage = "staffing";
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    name: string;
    description: string;
    status: string;
    extCode: string;
    office: string;
    category: string;
    customer: string;
    type: string;
    technology: string;
    budget: number;
    estimatedDuration: object;
    startDate: string;
    endDate: string;
    manager: string;
    projectLead: string;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("POST /api/staffing/projects");
    const { name, description, status, extCode, office, category, customer, type, technology, budget, estimatedDuration, startDate, endDate, manager, projectLead } = await readBody<IRequestBody>(event);

    try {

        if(config.envType === "DEV") console.log("Create staffing project");
        const createdData = await projects.create({
            name,
            ka_department: ka_department,
            stage: stage,
            description,
            status,
            extCode,
            office,
            category,
            customer,
            type,
            technology,
            budget,
            estimatedDuration,
            startDate,
            endDate,
            manager,
            projectLead,
            creator: owner,
            updater: owner
        });
        return {
            project: {
                _id: createdData._id,
                ka_department: createdData.ka_department,
                name: createdData.name,
                description: createdData.description,
                status: createdData.status,
                extCode: createdData.extCode,
                office: createdData.office,
                category: createdData.category,
                customer: createdData.customer,
                type: createdData.type,
                technology: createdData.technology,
                budget: createdData.budget,
                estimatedDuration: {
                    duration: createdData.estimatedDuration.duration,
                    unit: createdData.estimatedDuration.unit
                },
                startDate: createdData.startDate,
                endDate: createdData.endDate,
                manager: createdData.manager,
                projectLead: createdData.projectLead,
                creator: createdData.creator,
                createdAt: createdData.createdAt,
                updater: createdData.updater,
                updatedAt: createdData.updatedAt
            }
        };

    } catch (err) {
        if(config.envType === "DEV") console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something wrong.",
        };
    }
});
