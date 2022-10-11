import * as cartService from "./cart.service";
//import { testLoader } from "../test/test.model";
import { GraphqlResolver } from "../../helper/graphql/resolver";

export const cartResolver = {
    Query: {
        getAllCart: async (root:Cart, args:any, context) => {
            const { q } = args;
            const carts: any = await cartService.getAllCart(q);

            return carts;
        },

        getOneCart: async (root:Cart, args:any, context) => {
            const { _id } = args;
            const cart = await cartService.getOneCart(_id);

            return cart;
        },
    },

    Mutation: {
        createCart: async (root:Cart, args:any, context) => {
            const {data}= args;

            return await cartService.createCart(data);
        },

        updateCart: async (root:Cart, args:any, context) => {    
            const {_id, data} = args;

            return await cartService.updateCart(_id, data);
        },

        deleteCart: async (root:Cart, args:any, context) => {
            const {_id} = args;

            return await cartService.deleteCart(_id); 
        }
    },
   //     Product: {
       // test: GraphqlResolver.load(testLoader, "testId"),
   // },
}