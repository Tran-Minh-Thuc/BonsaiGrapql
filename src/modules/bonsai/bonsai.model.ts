import { model, Schema } from "mongoose";
import { getModelDataLoader } from "../../helper/dataloader";

const bonsaiSchema = new Schema(
    {
        categoryId: { type: Schema.Types.ObjectId, required: true, default: "ID unknown"},
        name: { type: String, required: true, default: "bonsai unknown"},
        quantity: { type: Number, required: true, default: 0},
        description: { type: String, required: true, default: "description unknown"},
        country: { type: String, required: true, default: "country unknown"},
        bonus_point: { type: Number, required: true, default: 0},
        price: { type: Number, required: true, default: 0},
        image: { type: [String], required: true, default: []}
    },
    {
        timestamps: true,
        collection: "bonsais"
    }
)

export const bonsaiModel = model<Bonsai>("Bonsai", bonsaiSchema);
export const bonsaiLoader = getModelDataLoader(bonsaiModel);