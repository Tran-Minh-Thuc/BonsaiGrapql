import { model, Schema } from "mongoose";
import { getModelDataLoader } from "../../helper/dataloader";


const ModelItemData = new Schema({
    stock: { type: Number },
    price: { type: Number },
    sku: { type: String, default: "" },
    index: { type: Array }
})

const ModelItem = new Schema({
    name: { type: String },
    values: { type: Array },
    images: { type: Array, default: [] },
})

const modelSchema = new Schema({
    bonsaiId: { type: Schema.Types.ObjectId, ref: "Bonsai" },
    items: { type: [ModelItem] },
    data: [ModelItemData]
}, {
    timestamps: true
})

export const modelModel = model<Model>("Model", modelSchema);
export const modelLoader = getModelDataLoader(modelModel);