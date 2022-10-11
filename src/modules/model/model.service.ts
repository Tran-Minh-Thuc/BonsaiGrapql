import { QueryInput } from "../../base/crudService";
// import logger from "../../helper/logger";
import getDataWithPagination from "../../helper/service/getDataWithPagination";
import { modelModel } from "./model.model";

export default {
    async getAllModel(queryInput: QueryInput = {}) {
        return getDataWithPagination(queryInput, modelModel);
    },

    async getOneModel(_id: String) {
        try {
            const model: Model = await modelModel.findById(_id).lean();

            return model;
        } catch (err) {
            console.log(err);

            return err;
        }
    },

    async createModel(modelArgs: Model) {
        try {
            const model: Model = await modelModel.create(modelArgs);

            return model;
        } catch (err) {
            console.log(err);

            return err;
        }
    },

    async getModelByBonsaiId(_id: String) {
        try {
            const model: [Model] = await modelModel.find({ bonsaiId: _id }).lean();

            return model;
        } catch (err) {
            console.log(err);

            return err;
        }
    },

    async updateModelByBonsaiId(_id: String, data: any) {
        try {
            const model = await modelModel.findOneAndUpdate(
                { bonsaiId: _id },
                {
                    $set: data
                },
                {
                    new: true, upsert: true
                }
            )

            return model;
        } catch (err) {
            console.log(err);

            return err;
        }
    },

    async updateModel(_id: String, data: any) {
        try {
            const model = await modelModel.findByIdAndUpdate(
                _id,
                {
                    $set: data
                },
                {
                    new: true
                }
            )

            return model;
        } catch (err) {
            console.log(err);

            return err;
        }
    },

    async updateQuantityModelByDataId(_id: String, modelDataId: String, quantity: Number) {
        try {
            const model = await modelModel.findOneAndUpdate(
                { _id: _id, 'data._id': modelDataId },
                {
                    '$set': {
                        'data.$.stock': quantity,
                    }
                },
                {
                    new: true
                }
            )

            return model;
        } catch (err) {
            console.log(err);

            return err;
        }
    },

    async deleteModel(_id: String) {
        try {
            const model = await modelModel.findByIdAndDelete(_id);

            return model;
        } catch (err) {
            console.log(err);

            return err;
        }
    },

    async deleteModelByBonsaiId(_id: String) {
        try {
            const model = await modelModel.findOneAndDelete({ bonsaiId: _id });

            return model;
        } catch (err) {
            console.log(err);

            return err;
        }
    }
}
