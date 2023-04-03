import mongoose from "mongoose";
const config = useRuntimeConfig();

// Quizz answers categories model
const categoriesQuestionsSchema = new mongoose.Schema(
    {
            name: { type: String, required: true },                             // Answer category name
            slug: { type: String, required: true, unique: true },               // Slug identifier
    },
    { timestamps: true, strict: true, strictQuery: true }
);

// Quizz question answers model
const answersSchema = new mongoose.Schema(
    {
            answer: { type: String, required: true },            // Answer text
            isCorrect: { type: Boolean, default: false },       // Define if it's correct answer
    },
    { timestamps: true, strict: true, strictQuery: true }
);
// Quizzz question model
const questionsSchema = new mongoose.Schema(
    {
            question: { type: String, required: true },                         // Question text
            type: { type: String, required: true },                             // Question type single-choice|multiple-choice...
            questionCategory: { type: String, required: true, default: "generic" },       // Quizz question category, slug value
            correctPoints: {type: Number, default: 0},                          // Point won by correct answer
            incorrectPoints: {type: Number, default: 0},                        // Points won by incorrect answer, negative value
            showQuestionPoints: { type: Boolean, default: false },              // Boolean to show puntuation on question form
            forceResponse: { type: Boolean, default: false },                   // Force response
            terminateOnWrong: { type: Boolean, default: false },                // Force terminate quizz on wrong answer
            answers: [answersSchema],                                           // Array of possible answers
            creator: {type: mongoose.Types.ObjectId, ref: "users"},   // Member who create answer
            updater: {type: mongoose.Types.ObjectId, ref: "users"},   // Member who update answer
    },
    { timestamps: true, strict: true, strictQuery: true }
);


const schema = new mongoose.Schema(
    {
            enabled: { type: Boolean, default: false },                                         // Enabled quizz
            status: { type: String, default: "setup" },                                         // Quizz status: (setup|active|inactive|ended)
            ka_department: { type: String, required: true, default: config.kaDeparment },       // KA department
            type: { type: String, required: true, default: "candidates" },                      // Quizz type: (candidates|formation|generic)
            name: { type: String, required: true },                                             // Quizz name
            slug: { type: String, required: true },                                             // Quizz name slug
            category: {type: mongoose.Types.ObjectId, ref: "categories"},                       // Quizz category ID
            description: { type: String },                                                      // Quizz desciption
            quizzLanguage: { type: String, required: true, default: "es" },                     // Quizz language
            questionsCategories: [categoriesQuestionsSchema],                                       // Array quizz answers categories
            questions: [questionsSchema],                                                       // Array of questions associates to quizz
            questionsSet: {
                    type: { type: String, default: "fixed" },                                   // Answer set type: (fixed|random)
                    randomCategories: [{
                            categorySlug: { type: String, default: "generic" },                 // If type random, associate answer category slug
                            drawNumber: { type: Number, default: 0}                             // If type random, number of category question
                    }]
            },
            security: {
                    level: { type: String, required: true, default: "disabled"},                // Security level: (disabled|warning|terminate)
                    attemptsByUser: { type: Number, required: true, default: 1 },               // Attempts to make quizz
                    warningAttempts: { type: Number, required: true, default: 1 },              // If level type is terminate, number time user can leave test before terminate
            },
            startPage: {
                    instructions: { type: String, default: null },                              // Text quizz instrucctions on star page
                    consent: { type: String, default: null },                                   // If set show legal consent policy
            },
            finishPage: {
                    endMessage: { type: String },                                               // End message text
                    passMark: { type: Boolean, default: false },                                // Show passed mark
                    passMarkValue: { type: Number },                                            // If mark is set, minimun value
                    passMarkType: { type: String },                                             // If mark is set, type value: (points|percentage)
                    passMessage: { type: String },                                              // If mark is set, pass message
                    enableGrades: { type: Boolean, default: false },                            // Enable grades information
                    gradesRanges: [
                            {
                               from: { type: Number },                                          // If grades is set, start range value
                               to: { type: Number },                                            // If grades is set, finish range value
                               grade: { type: String },                                         // If grades is set, grade name
                               gradeDescription: { type: String }                               // If grades is set, grade description
                            }
                    ],
                    feedback: {
                            showPercentageScore: { type: Boolean, default: false },             // On finish page, show percentage score
                            showPointsScore: { type: Boolean, default: false },                 // On finish page, show points score
                            showGrade: { type: Boolean, default: false },                       // On finish page, if grades enabled, show it
                            showCorrectAnswers: { type: Boolean, default: false },              // On finish page, show number of correct answers
                            showPassOrFailMessage: { type: Boolean, default: false },           // On finish page, if pass enabled, show it
                    }
            },
            timeSettings: {
                    publishType: { type: String, default: "manual" },                           // Quizz publish type: (manual|scheduled)
                    publishDate: { type: Date },                                                // If type is scheduled, start datetime
                    finishDate: { type: Date },                                                 // If type is scheduled, finish datetime
                    timeAnswerLimit: { type: String, default: "01:00" },                        // Default allowed time per question format: mm:ss
            },
            certificateSetting: {
                    enabled: { type: Boolean, default: false },                                 // Enable certificate generation
                    logo: { type: Boolean, default: false },                                    // Show logo
                    subtitle: { type: Boolean, default: false },                                // Show subtitle
                    showPercentage: { type: Boolean, default: false },                          // Show result percentage
                    showScorePoints: { type: Boolean, default: false },                         // Show score points
                    showGrade: { type: Boolean, default: false },                               // Show grade

            },
            creator: {type: mongoose.Types.ObjectId, ref: "users"},                   // Member who create answer
            updater: {type: mongoose.Types.ObjectId, ref: "users"},                   // Member who update answer
            soft_delete: { type: Date, default: null},                                          // Soft delete strategy
    },
    { timestamps: true, strict: true, strictQuery: true }
);
export default mongoose.model("quizzes", schema, "quizzes");
