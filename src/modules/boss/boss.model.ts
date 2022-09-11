import { model, Schema } from "mongoose";

const bossSchema = new Schema(
    {
        name: { type: String, required: true }
    },
    {
        timestamps: true,
        collection: "bosss"
    }
)

export const bossModel = model<Boss>("Boss", bossSchema);
