import { model, Schema } from "mongoose";
import { getModelDataLoader } from "../../helper/dataloader";

const itemCartSchema = new Schema(
    {
        bonsaiId: { type: Schema.Types.ObjectId, ref: "Bonsai", required: true, },
        modelId: { type: Schema.Types.ObjectId, ref: "Model" },
        modelDataId: { type: String, default: "" },
        amount: { type: Number, required: true, default: 0 },
        quantity: { type: Number, required: true, default: 0 },
        index: { type: Array, default: [] },
    }
)

const cartSchema = new Schema(
    {   
        userId: { type: Schema.Types.ObjectId, ref : "User",required: true,},
        uniqueCartItem: { type: Number, required: true, default: 0 },
        itemCart: { type: [itemCartSchema], default: [] },
    },
    {
        timestamps: true,
        collection: "carts"
    }
)

export const cartModel = model<Cart>("Cart", cartSchema);
export const cartLoader = getModelDataLoader(cartModel);