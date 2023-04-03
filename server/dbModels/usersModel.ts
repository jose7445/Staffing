import mongoose from "mongoose";
import bcrypt from "mongoose-bcrypt";
const config = useRuntimeConfig();


// USER SCHEMA

const schema = new mongoose.Schema(
    {
        ka_department: { type: String, required: true, default: config.kaDeparment },
        office: { type: String, required: true },
        name: { type: String, required: true },
        lastname: { type: String, required: true },
        stage: { type: String, required: true, default: "candidate" },
        employedId: { type: String, required: false },
        companyEmail: {  type: String, trim: true, unique: true, sparse: true },
        password: { type: String, bcrypt: true },
        personalData: {
            email: { type: String, trim: true, unique: true, sparse: true },
            phone: { type: String }
        },
        security: {
            isSuper: { type: Boolean, default: false },
            roles: [{
                area: { type: String },
                admin: { type: Boolean, default: false },
                read: { type: Boolean, default: false },
                write: { type: Boolean, default: false },
            }]
        },
        candidate: {
            status: { type: String, required: true, default: "pending" },
            cvLink: { type: String, default: null },
            technologies: { type: String, default: null },
            experience: { type: String, default: null },
            categoryPosition: { type: String, default: null },
            categoryLevel: { type: String, default: null },
            salaryExpectations:  { type: String, default: null },
            firstInterviewer: {type: mongoose.Types.ObjectId, ref: "users"},
            secondInterviewer: {type: mongoose.Types.ObjectId, ref: "users"},
            comments: [{
                creator: {type: mongoose.Types.ObjectId, ref: "users"},
                comment: { type: String, required: true }

            }],
        },
        staffing: {
            cvLink: { type: String, default: null },
            tecnologies: { type: String, default: null },
            experience: { type: String, default: null },
            categoryCode: { type: String, default: null },
            categoryPosition: { type: String, default: null },
            categoryLevel: { type: String, default: null },
            salary:  { type: String, default: null },
            unit: {type: mongoose.Types.ObjectId, ref: "categories"},
            budget: {type: mongoose.Types.ObjectId, ref: "categories"},
            endCurrentAsignation: { type: Date, default: null },
            assignations: [{
                creator: {type: mongoose.Types.ObjectId, ref: "users"},
                project: {type: mongoose.Types.ObjectId, ref: "projects"},
                date: {type: Date },
                weekNumber: {type: Number },
                comment: { type: String }

            }],
            comments: [{
                creator: {type: mongoose.Types.ObjectId, ref: "users"},
                comment: { type: String, required: true }

            }],
        },
        soft_delete: { type: Date, default: null},
    },
    { timestamps: true, strict: true, strictQuery: true }
);
schema.index({ companyEmail: 1 }, {
    unique: true,
    partialFilterExpression: {
        'companyEmail': { $type: "string" }
    }
}).index({ "personalData.email": 1 }, {
    unique: true,
    partialFilterExpression: {
        'personalData.email': { $type: "string" }
    }
});
schema.plugin(bcrypt);
export default mongoose.model("users", schema, "users");
