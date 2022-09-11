import * as testService from "./test.service";

export const testResolver = {
    Query: {
        getAllTest: async (root:Test, args:any, context) => {
            const { q } = args;
            const tests: any = await testService.getAllTest(q);

            return tests;
        },

        getOneTest: async (root:Test, args:any, context) => {
            const { _id } = args;
            const test: Test = await testService.getOneTest(_id);

            return test;
        },
    },

    Mutation: {
        createTest: async (root:Test, args:any, context) => {
            const {data}= args;

            return await testService.createTest(data);
        },

        updateTest: async (root:Test, args:any, context) => {    
            const {_id, data} = args;

            return await testService.updateTest(_id, data);
        },

        deleteTest: async (root:Test, args:any, context) => {
            const {_id} = args;

            return await testService.deleteTest(_id); 
        }
    }
}