import modelService from "./model.service";
import { GraphqlResolver } from "../../helper/graphql/resolver";
import { bonsaiLoader } from "../bonsai/bonsai.model";
// import logger from "../../helper/logger";
// import Context from '../../helper/graphql/context';

export const modelResolver = {
    Query: {
        getAllModel: async (root:Model, args:any, context) => {
            const { q } = args;
            const models: any = await modelService.getAllModel(q);

            return models;
        },

        getOneModel: async (root:Model, args:any, context) => {
            const { _id } = args;
            const model: Model = await modelService.getOneModel(_id);

            return model;
        },
        getModelByBonsaiId: async (root:Model, args:any, context) => {
            const { _id } = args;
            const model: [Model] = await modelService.getModelByBonsaiId(_id);

            return model;
        }
    },

    Mutation: {
        createModel: async (root:Model, args:any, context) => {
            const {data}= args;

            return await modelService.createModel(data);
        },

        updateModel: async (root:Model, args:any, context) => {    
            const {_id, data} = args;

            return await modelService.updateModel(_id, data);
        },

        deleteModel: async (root:Model, args:any, context) => {
            const {_id} = args;

            return await modelService.deleteModel(_id); 
        }
    },
    Model: {
        bonsai: GraphqlResolver.load(bonsaiLoader, "bonsaiId"),
    }
}