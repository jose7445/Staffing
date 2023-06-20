import { quizzes, users } from "../../dbModels";
import { getCandidatesData, getOffices } from "../../utils";
const config = useRuntimeConfig();

const quizzType = "candidates";
const ka_department = config.kaDeparment;
const stage = "candidate";
export default defineEventHandler(async (event) => {
    const id = event.context.params.id;
    if(config.envType === "DEV") console.log("GET ID /api/candidates/");
    try {
        if(config.envType === "DEV") console.log("Get candidate info");

        const candidateOptions = getCandidatesData();
        const offices = getOffices();

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


        if(id === "new"){

            /* NEW CANDIDATE */
            return {
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

        }else{

            /* UPDATE CANDIDATE */
            const responseData = await users.findOne({
                id: id,
                stage: { $eq: stage },
                ka_department: { $eq: ka_department },
                soft_delete: { $eq: null },
            });//.select(['name', 'lastname', 'office', 'stage', 'personalData', 'candidate']);
            if (!responseData) {
                if(config.envType === "DEV") console.log(`Candidate with ID ${id} doesn't exists`);
                event.res.statusCode = 404;
                return {
                    code: "USER_NOT_FOUND",
                    message: "Candidate member with given id doesn't exists.",
                };
            } else {
                return {
                    user: {
                        id: responseData._id,
                        name: responseData.name,
                        lastname: responseData.lastname,
                        office: responseData.office,
                        stage: responseData.stage,
                        personalData: responseData.personalData,
                        candidate: responseData.candidate,
                    },
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
            }

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
