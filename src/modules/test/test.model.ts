import { model, Schema } from "mongoose";
import { getModelDataLoader } from "../../helper/dataloader";

const testSchema = new Schema(
    {
        name: { type: String, required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    },
    {
        timestamps: true,
        collection: "tests"
    }
)

export const testModel = model<Test>("Test", testSchema);
export const testLoader = getModelDataLoader(testModel);
