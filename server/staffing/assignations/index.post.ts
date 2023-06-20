import { usersAssignations } from "../../../dbModels";
import { generateWorkingDatesWithInfo } from '../../../utils/modules/timeUtils';
import {ObjectId} from "bson";
const config = useRuntimeConfig();

const ka_department = config.kaDeparment;
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    assignationHours: string;
    dedication: number;
    employedId: string;
    fullName: string;
    projectName: string;
    projectExt: string;
    projectId: string;
    range: [];
    hollydays: [];
    userId: string;
}

async function upsertAssignations(inputObject, dateArray) {
    const workingDatesWithInfo = generateWorkingDatesWithInfo(inputObject, dateArray);

    const upsertPromises = workingDatesWithInfo.map(async (item) => {
        const { userId, employedId, projectId, assignationDate } = item;

        const filter = {
            userId,
            employedId,
            projectId,
            assignationDate,
        };

        const update = item;

        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        return usersAssignations.findOneAndUpdate(filter, update, options).exec();
    });

    const upsertedAssignations = await Promise.all(upsertPromises);

    return upsertedAssignations;
}

export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("POST /api/staffing/assignations");
    const { assignationHours, dedication, employedId, fullName, projectName, projectExt, projectId, hollydays, range, userId } = await readBody<IRequestBody>(event);

    const assign = {
        assignationHours: assignationHours,
        dedication: dedication,
        employedId: employedId,
        fullName: fullName,
        projectName: projectName,
        projectExt: projectExt,
        projectId: projectId,
        range: range,
        userId: userId
    }

    try {

        if(assign && hollydays.length>0) {

            const upsertedAssignations = await upsertAssignations(assign, hollydays);
            //console.log('Upserted assignations:', upsertedAssignations);

            const assignations = await usersAssignations.find({
                ka_department: {$eq: config.kaDeparment},
                soft_delete: {$eq: null},
                userId: {$eq: userId},
                projectId: {$eq: projectId},
            });

            return {
                upsertedAssignations: upsertedAssignations,
                assignations: assignations
            };

        }else{
            event.res.statusCode = 500;
            return {
                code: "ERROR",
                message: "Data error.",
            };
        }

    } catch (err) {
        if(config.envType === "DEV") console.error('Error upserting assignations:', err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something wrong.",
        };
    }
});
