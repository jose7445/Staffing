import { users, quizzes } from "../../../dbModels";
import { getCandidatesData, getOffices } from "../../../utils";
const config = useRuntimeConfig();
const quizzType = "candidates";
const ka_department = config.kaDeparment;
const stage = "candidate";
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("GET /api/recruitment/candidates");
    try {

        const candidateOptions = getCandidatesData();
        const offices = getOffices();

        if(config.envType === "DEV") console.log("Get candidates list");
        const usersData = await users.find({
            ka_department: { $eq: ka_department },
            stage: { $eq: stage },
            soft_delete: { $eq: null },
        });

        /* GET QUIZZES */
        // TODO filter by active quizzes
        const quizzesData = await quizzes.find({
            ka_department: { $eq: ka_department },
            type: { $eq: quizzType },
            soft_delete: { $eq: null },
        }).select(['_id', 'name']);

        /* GET INTERVIEWERS */
        // TODO Filter intefviewers
        const interviewersData = await users.find({
            ka_department: { $eq: ka_department },
            stage: { $eq: 'staffing' },
            soft_delete: { $eq: null },
        });


        /*const users = usersData.map((user) => ({
            id: user._id,
            ka_department: user.ka_department,
            office: user.office,
            name: user.name,
            lastname: user.lastname,
            stage: user.stage,
            personalData: user.personalData,
            candidate: user.candidate,
        }));*/
        return {
            users: usersData.map((user) => ({
                id: user._id,
                ka_department: user.ka_department,
                office: user.office,
                name: user.name,
                lastname: user.lastname,
                stage: user.stage,
                personalData: user.personalData,
                candidate: user.candidate,
            })),
            candidate_options: candidateOptions,
            offices: offices,
            quizzes: quizzesData.map( (quizz) => ({
                "label": quizz.name,
                "value": quizz._id
            })),
            interviewers: interviewersData.map( (quizz) => ({
                "label": quizz.name +' '+ quizz.lastname,
                "value": quizz._id
            })),
        };

        /*
        return {
            "offices": getOffices(),
            "questionTypes": getQuestionTypes(),
            "languages": getLanguages(),
            "ka_departments": getKADepartments()
        }*/

    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
});
