import { users } from "../../../dbModels";

const config = useRuntimeConfig();
interface IRequestBody {
    email: string;
    password: string;
}
export default defineEventHandler(async (event) => {
    console.log("POST /api/staffing-members/signin");
    const { email, password } = await readBody<IRequestBody>(event);
    // Check if email is passed.
    if (!email) {
        event.res.statusCode = 400;
        return {
            code: "EMAIL_REQUIRED",
            message: "Body malformed: email is required.",
        };
    }
    // Check if password is passed.
    if (!password) {
        event.res.statusCode = 400;
        return {
            code: "PASSWORD_REQUIRED",
            message: "Body malformed: password is required.",
        };
    }
    try {
        console.log("Find member");
        const responseData = await users.findOne({
            email: email.toLowerCase(),
            soft_delete: { $eq: null },
        });
        if (responseData) {
            console.log("Member found");
            const isPasswordValid = await responseData.verifyPasswordSync(password);
            if (isPasswordValid) {
                // Generate token or create session here
                return {
                    id: responseData._id,
                    name: responseData.name,
                    lastname: responseData.lastname,
                    office: responseData.office,
                    stage: responseData.stage,
                    employedId: responseData.employedId,
                    companyEmail: responseData.companyEmail,
                    security:responseData.security,
                };
            } else {
                console.log("Password is not valid");
                event.res.statusCode = 404;
                return {
                    code: "USER_NOT_FOUND",
                    message: "Member with given email and password doesn't exists.",
                };
            }
        } else {
            console.log("Member not found");
            event.res.statusCode = 404;
            return {
                code: "USER_NOT_FOUND",
                message: "Member user with given email and password doesn't exists.",
            };
        }
    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something wrong.",
        };
    }
});
