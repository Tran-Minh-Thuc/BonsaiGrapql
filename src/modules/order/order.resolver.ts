import * as orderService from "./order.service";
//import { testLoader } from "../test/test.model";
import { GraphqlResolver } from "../../helper/graphql/resolver";

export const orderResolver = {
    Query: {
        getAllOrder: async (root:Order, args:any, context) => {
            const { q } = args;
            const orders: any = await orderService.getAllOrder(q);

            return orders;
        },

        getOneOrder: async (root:Order, args:any, context) => {
            const { _id } = args;
            const order = await orderService.getOneOrder(_id);

            return order;
        },
    },

    Mutation: {
        createOrder: async (root:Order, args:any, context) => {
            const {data}= args;

            return await orderService.createOrder(data);
        },

        updateOrder: async (root:Order, args:any, context) => {    
            const {_id, data} = args;

            return await orderService.updateOrder(_id, data);
        },

        deleteOrder: async (root:Order, args:any, context) => {
            const {_id} = args;

            return await orderService.deleteOrder(_id); 
        }
    },
   //     Product: {
       // test: GraphqlResolver.load(testLoader, "testId"),
   // },
}