import { usersAssignations } from "../../../dbModels";
import {ObjectID} from "bson";
import {formatDate, getWeekNumber} from "~/server/utils";
const config = useRuntimeConfig();

const ka_department = config.kaDeparment;
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    _id: ObjectID,
    assignationDate: string;
    assignationHours: string;
    dedication: number;
    employedId: string;
    fullName: string;
    projectName: string;
    projectExt: string;
    projectId: string;
    userId: string;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("PUT /api/staffing/assignations");
    const { _id, assignationDate, assignationHours, dedication, employedId, fullName, projectName, projectExt, projectId, userId } = await readBody<IRequestBody>(event);
    console.log(_id);
    try {
        const getData = await usersAssignations.findOne({
            _id: { $eq: _id }
        });
        if (!getData) {
            if(config.envType === "DEV") console.log(`Staffing assignation with ID ${_id} doesn't exists`);
            event.res.statusCode = 409;
            return {
                code: "STAFFING_ASSIGNATION_NOT_EXISTS",
                message: "Staffing assignation with given ID doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Update staffing assignation");
            const dayTS = new Date(assignationDate).valueOf()
            let data = {
                "assignationHours": assignationHours,
                "dedication": dedication,
                "employedId": employedId,
                "fullName": fullName,
                "projectName": projectName,
                "projectExt":projectExt,
                "projectId":projectId,
                "userId": userId,
                "assignationDate": formatDate(dayTS, 'Y-m-d'),
                "assignationMonthYear": formatDate(dayTS, 'm/Y'),
                "weekNumber":  getWeekNumber(new Date(assignationDate)),
                "updater": owner,
            }

            const responseData = await usersAssignations.findOneAndUpdate({_id: { $eq: _id }}, data);
            const assignations = await usersAssignations.find({
                ka_department: {$eq: config.kaDeparment},
                soft_delete: {$eq: null},
                userId: {$eq: userId},
                projectId: {$eq: projectId},
            });

            return {
                upsertedAssignations: [responseData],
                assignations: assignations
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
