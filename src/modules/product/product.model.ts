import { model, Schema } from "mongoose";

const productSchema = new Schema(
    {
        name: { type: String, required: true }
    },
    {
        timestamps: true
    }
)

export const productModel = model<Product>("Product", productSchema);
