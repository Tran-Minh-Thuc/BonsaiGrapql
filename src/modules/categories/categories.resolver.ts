import * as categoriesService from "./categories.service";
//import { testLoader } from "../test/test.model";
import { GraphqlResolver } from "../../helper/graphql/resolver";
import { httpResponse } from "../../helper/HttpResponse";

export const categoriesResolver = {
    Query: {
        getAllCategories: async (root:Categories, args:any, context) => {
            const { q } = args;
            const categories = await categoriesService.getAllCategories(q);

            if (categories === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    status: false,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    data: [],
                }
            }
            return {
                code: httpResponse.OK.CODE,
                status: true,
                message:httpResponse.OK.MESSAGE,
                data: categories.data,
                pagination: categories.pagination
            }
        },

        getOneCategories: async (root:Categories, args:any, context) => {
           return null;
        },
    },

    Mutation: {
        
    },
}