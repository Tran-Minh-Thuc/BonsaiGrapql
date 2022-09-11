import * as productService from "./product.service";

export const productResolver = {
    Query: {
        getAllProduct: async (root:Product, args:any, context) => {
            const { q } = args;
            const products: any = await productService.getAllProduct(q);

            return products;
        },

        getOneProduct: async (root:Product, args:any, context) => {
            const { _id } = args;
            const product: Product = await productService.getOneProduct(_id);

            return product;
        },
    },

    Mutation: {
        createProduct: async (root:Product, args:any, context) => {
            const {data}= args;

            return await productService.createProduct(data);
        },

        updateProduct: async (root:Product, args:any, context) => {    
            const {_id, data} = args;

            return await productService.updateProduct(_id, data);
        },

        deleteProduct: async (root:Product, args:any, context) => {
            const {_id} = args;

            return await productService.deleteProduct(_id); 
        }
    }
}