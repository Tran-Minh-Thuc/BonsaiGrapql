import { model, Schema } from "mongoose";

const testSchema = new Schema(
    {
        name: { type: String, required: true }
    },
    {
        timestamps: true,
        collection: "tests"
    }
)

export const testModel = model<Test>("Test", testSchema);
