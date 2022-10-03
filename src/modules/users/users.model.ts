import { model, Schema } from "mongoose";
import { getModelDataLoader } from "../../helper/dataloader";

const usersSchema = new Schema(
    {
        name: { type: String, required: true },
        password: {type:String, require: true},
        email: {type:String, require: true},
        avatar: {type:String, require: true},
        address: {type:String, require: true},
        phone: {type:String, require: true},
        gender: {type:String, require: true},
        point: {type:Number, require: true},
        role: {type:String, require: true},
        isActive: {type:Boolean, require: true},
        activeCode: {type:Number, require: true},
        createdAt: {type:String, require: true},
        updatedAt: {type:String, require: true},

    },
    {
        timestamps: true,
        collection: "users"
    }
)

export const usersModel = model<Users>("Users", usersSchema);
export const usersLoader = getModelDataLoader(usersModel);