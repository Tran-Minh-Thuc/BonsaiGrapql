import { model, Schema } from "mongoose";
import { getModelDataLoader } from "../../helper/dataloader";

const vouchersSchema = new Schema(
    {
        description:{type:String,require: true},
        start_time:{type:String,require: true},
        end_time:{type:String,require: true},
        quantity: {type:Number,require: true},
        min_point: {type:Number,require: true},
        min_order : {type:Number,require: true},
        max_discount: {type:Number,require: true},
        sale_percent: {type:Number,require: true},
        type : {type:String,require: true},
        bonus_decrease: {type:Number,require:true},
        createdAt: {type:String, require: true},
        updatedAt: {type:String, require: true},
    },
    {
        timestamps: true,
        collection: "vouchers"
    }
)

export const vouchersModel = model<Vouchers>("Vouchers", vouchersSchema);
export const vouchersLoader = getModelDataLoader(vouchersModel);