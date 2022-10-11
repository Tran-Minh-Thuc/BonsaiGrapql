import { QueryInput } from "../../base/crudService";
import logger from "../../helper/logger";
import getDataWithPagination from "../../helper/service/getDataWithPagination";
import { categoryModel } from "./category.model";
// import { shopModel } from "../shop/shop.model";

export default {
    async getAllCategory(queryInput: QueryInput = {}) {
        return getDataWithPagination(queryInput, categoryModel);
    },

    async getOneCategory(_id: String) {
        try {
            const category: Category = await categoryModel.findById(_id).lean();
            return category;

        } catch (err) {
           logger.info(err);
           return null;
        }
    },

    async createCategory(categoryArgs: Category) {
        try {
            const category = await categoryModel.create(categoryArgs);
            return category;

        } catch (err) {
           logger.info(err);
           return null
        }
    },

    async updateCategory(_id: String, data: any) {
        try {
            const category = await categoryModel.findByIdAndUpdate(
                _id,
                {
                    $set: data,
                },
                {
                    new: true,
                }
            );

            return category;

        } catch (err) {
           logger.info(err);
           return null;
        }
    },

    async deleteCategory(_id: String) {
        try {
            const category: Category = await categoryModel.findByIdAndDelete(_id);
            return true;

        } catch (err) {
           logger.info(err);
           return null;
        }
    },

}   