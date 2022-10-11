import * as bonsaiService from "./bonsai.service";
//import { testLoader } from "../test/test.model";
// import { GraphqlResolver } from "../../helper/graphql/resolver";

export const bonsaiResolver = {
    Query: {
        getAllBonsai: async (root:Bonsai, args:any, context) => {
            const { q } = args;
            const bonsais: any = await bonsaiService.getAllBonsai(q);

            return bonsais;
        },

        getOneBonsai: async (root:Bonsai, args:any, context) => {
            const { _id } = args;
            const bonsai = await bonsaiService.getOneBonsai(_id);

            return bonsai;
        },
    },

    Mutation: {
        createBonsai: async (root:Bonsai, args:any, context) => {
            const {data}= args;

            return await bonsaiService.createBonsai(data);
        },

        updateBonsai: async (root:Bonsai, args:any, context) => {    
            const {_id, data} = args;

            return await bonsaiService.updateBonsai(_id, data);
        },

        deleteBonsai: async (root:Bonsai, args:any, context) => {
            const {_id} = args;

            return await bonsaiService.deleteBonsai(_id); 
        }
    },
   //     Product: {
       // test: GraphqlResolver.load(testLoader, "testId"),
   // },
}