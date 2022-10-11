// import logger from "../../helper/logger";
import categoryService from "./category.service";


export const categoryResolver = {
    Query: {
        getAllCategory: async (root, args, context) => {
           console.log("Get all categories");
            const { q }= args;
            const categories = await categoryService.getAllCategory(q);

            return categories;
        },

        getOneCategory: async (root, args, context) => {
            const { _id } = args;
           console.log(`Get category ID <${_id}>`);

            const category: Category = await categoryService.getOneCategory(_id);
            return category;
        },
    },

    Mutation: {
        createCategory: async (root, args, context) => {
            const { data } = args;
           console.log("Create category");

            return await categoryService.createCategory(data);
        },

        updateCategory: async (root, args, context) => {
            const { _id, data } = args;
           console.log(`Update category ID <${_id}>`);

            return await categoryService.updateCategory(_id, data);
        },

        deleteCategory: async (root, args, context) => {
           console.log(`Delete category ID <${args._id}`);
            return await categoryService.deleteCategory(args._id);

        }
    },
}