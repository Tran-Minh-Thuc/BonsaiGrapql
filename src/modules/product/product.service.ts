import { QueryInput } from "../../base/crudService";
import getDataWithPagination from "../../helper/service/getDataWithPagination";
import { productModel } from "./product.model";

export async function getAllProduct(queryInput: QueryInput = {}) {
        return getDataWithPagination(queryInput, productModel);
    }

export async function getOneProduct(_id: String) {
        try {
            const product: Product = await productModel.findById(_id).lean();
            
            return product;
        } catch (err) {
            console.log(err);

            return err;
        }
    }

export async function createProduct(productArgs: Product) {
        try {
            const product: Product = await productModel.create(productArgs);
            
            return product;
        } catch (err) {
            console.log(err);

            return err;
        }
    }

export async function updateProduct(_id: String, data: any) {
        try {
            const product = await productModel.findByIdAndUpdate(
                    _id ,
                    {
                        $set: data
                    },
                    {
                        new: true
                    }
                )

            return product;
        } catch (err) {
            console.log(err);

            return err;
        }
    }

export async function deleteProduct(_id: String) {
        try {
            const product = await productModel.findByIdAndDelete(_id);
            
            return product;
        } catch (err) {
            console.log(err);
            
            return err;
        }
    }
