import { model, Schema } from "mongoose";
import { getModelDataLoader } from "../../helper/dataloader";

const categoriesSchema = new Schema(
    {
        name: { type: String, required: true },
        description: {type: String ,require: true},
        createdAt: {type: Date ,require: true},
        updatedAt: {type: Date ,require: true},
    },
    {
        timestamps: true,
        collection: "categories"
    }
)

export const categoriesModel = model<Categories>("Categories", categoriesSchema);
export const categoriesLoader = getModelDataLoader(categoriesModel);