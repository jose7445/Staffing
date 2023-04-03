import { quizzes } from "../../../dbModels";
import slugify from "slugify";

const config = useRuntimeConfig();
const quizzType = "candidates";
const owner = "641f6b9b314233963dafcdc6"; // TODO Replace with middleware data

interface IRequestBody {
    enabled: boolean;
    name: string;
    category: string;
    description: string;
    quizzLanguage: string;
}
export default defineEventHandler(async (event) => {
    if(config.envType === "DEV") console.log("POST /api/quizzes");
    const { enabled, name, category, description, quizzLanguage } = await readBody<IRequestBody>(event);
    const slug = slugify(name, {remove: /[*+~.()'"!:@]/g, lower: true});
    try {
        const data = await quizzes.findOne({
            ka_department: { $eq: config.kaDeparment },
            type: { $eq: quizzType },
            slug: { $eq: slug },
        });
        if (data) {
            if(config.envType === "DEV") console.log(`Quizz with slug ${slug} already exists`);
            event.res.statusCode = 409;
            return {
                code: "QUIZZ_EXISTS",
                message: "Quizz with given slug already exists.",
            };
        } else {
            if(config.envType === "DEV") console.log("Create quizz");
            const newData = await quizzes.create({
                enabled: enabled,
                ka_department: config.kaDeparment,
                type: quizzType,
                name: name,
                slug: slug,
                category: category,
                questionsCategories: [{ name: "Genérica", slug: "generica"}],
                description: description,
                quizzLanguage: quizzLanguage,
                creator: owner,
                updater: owner,
            });
            return {
                id: newData._id,
                enabled: newData.enabled,
                type: newData.type,
                name: newData.name,
                category: newData.category,
                description: newData.description,
                quizzLanguage: newData.quizzLanguage,
                questionsCategories: newData.questionsCategories,
                createdAt: newData.createdAt,
                updatedAt: newData.updatedAt,
                creator: newData.creator,
                updater: newData.updater,
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
