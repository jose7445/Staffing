import { projects } from "../../../dbModels";
import { useBody } from 'h3'
import {request} from "http";
const config = useRuntimeConfig();

const ka_department = config.kaDeparment;
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data
const stage = "staffing";

interface IRequestBody {
    _id: any;
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
    //
    //const _id = body._id;
    if(config.envType === "DEV") console.log("PUT /api/staffing/projects");
    const { _id, name, description, status, extCode, office, category, customer, type, technology, budget, estimatedDuration, startDate, endDate, manager, projectLead } = await readBody<IRequestBody>(event);
    try {
        const getData = await projects.findOne({
            _id: { $eq: _id }
        });
        if (!getData) {
            if(config.envType === "DEV") console.log(`Staffing project with ID ${_id} doesn't exists`);
            event.res.statusCode = 409;
            return {
                code: "STAFFING_PROJECT_NOT_EXISTS",
                message: "Staffing projects with given ID doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Update staffing member");
            let data = {
                stage,
                name,
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
                updater: owner
            }

            const project = await projects.findOneAndUpdate({_id: { $eq: _id }}, data);
            return {
                project: {
                    _id: project._id,
                    ka_department: project.ka_department,
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
                }
            };
        }
    } catch (err) {
        if(config.envType === "DEV") console.log(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something wrong.",
        };
    }
});
