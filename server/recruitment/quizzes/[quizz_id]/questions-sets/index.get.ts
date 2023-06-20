import { quizzes } from "../../../../../dbModels";
const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
    const quizzId = event.context.params.quizz_id;
    if(config.envType === "DEV") console.log("GET /api/recruitment/quizzes/[quizz_id]/questions-sets");
    try {
        if(config.envType === "DEV") console.log("Get quizz questions-sets");
        let result = [];
        let availableCategories = [];

        const responseData = await quizzes.findOne({
            _id: { $eq: quizzId },
            soft_delete: { $eq: null },
        })

        const available = await quizzes.aggregate([
            {
                $unwind: "$questions"
            },
            {
                $group: {
                    _id: "$questions.questionCategory",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Generate template
        responseData.questionsCategories.forEach(function (item, index){

            let data = {
                _id: item._id,
                name: item.name,
                categorySlug:  item.slug,
                drawNumber: 0,
                total: 0
            }

            available.forEach( item => {
                if(item._id === data.categorySlug) data.total = item.count;
            });

            availableCategories.push(data);

        });

        // If it's random and hasn't categories sets yet
        if(!responseData.questionsSet.randomCategories.length){

            result = availableCategories;

        }else{

            // Find results
            availableCategories.forEach(item => {
                const found = responseData.questionsSet.randomCategories.find(ele => ele.categorySlug === item.categorySlug);
                if(found){
                    item.drawNumber = found.drawNumber;
                    result.push(item);
                }else{
                    result.push(item);
                }
            });
        }
        return result;
    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
});
