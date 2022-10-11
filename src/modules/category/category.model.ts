import { model, Schema } from "mongoose";
import { getModelDataLoader } from "../../helper/dataloader";

const categorySchema = new Schema(
   {
      name: { type: String, required: true },
      description: { type: String },
      // priority:{ type: Boolean, default: false},
      // image: { type: String },
   },
   {
      timestamps: true
   }
)

export const categoryModel = model<Category>("Category", categorySchema);
export const categoryLoader = getModelDataLoader(categoryModel);
