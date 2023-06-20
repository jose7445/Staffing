import { usersAssignations } from "../../../dbModels";
const config = useRuntimeConfig();
const ka_department = config.kaDeparment;
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data
interface IRequestBody {
    _id: string;
    projectId: string;
    userId: string;
    rows: [];
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("DELETE /api/staffing/assignations");
    const { _id, projectId, userId, rows } = await readBody<IRequestBody>(event);

    try {
        const getData = await usersAssignations.findOne({
            _id: { $eq: _id },
            ka_department: { $eq: ka_department },
            soft_delete: {$eq: null},
        });
        if (!getData) {
            if(config.envType === "DEV") console.log(`Staff assignation with ID ${_id} doesn't exists`);
            event.res.statusCode = 409;
            return {
                code: "STAFF_ASSIGNATION_NOT_EXISTS",
                message: "Staff assignation with given ID doesn't exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Delete staff assignation");
            let dataObj = {
                soft_delete: Date.now(),
                updater: owner,
            }

            console.log(rows, dataObj);

            const createdData = rows?.length
                ? await usersAssignations.updateMany({ _id: { $in: rows } }, dataObj)
                : await usersAssignations.findOneAndUpdate({_id: _id}, dataObj)

            const getAssignation = await usersAssignations.findOne({
                _id: { $eq: _id },
                ka_department: { $eq: ka_department },
                soft_delete: {$eq: null},
            });

            console.log(createdData);

            const retrieveData = await usersAssignations.find({
                ka_department: { $eq: ka_department },
                soft_delete: { $eq: null },
                userId: {$eq: userId},
                projectId: {$eq: projectId}
            });
            return {
                deleted: !getAssignation ? true : false,
                assignations: retrieveData,
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
