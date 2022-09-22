import { model, Schema } from "mongoose";
import { getModelDataLoader } from "../../helper/dataloader";

const productSchema = new Schema(
    {
        name: { type: String, required: true },
        testId: { type: Schema.Types.ObjectId, ref: "Test", required: true },

    },
    {
        timestamps: true,
        collection: "products"
    }
)

export const productModel = model<Product>("Product", productSchema);
export const productLoader = getModelDataLoader(productModel);