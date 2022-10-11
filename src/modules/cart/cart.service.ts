import { QueryInput } from "../../base/crudService";
import getDataWithPagination from "../../helper/service/getDataWithPagination";
import { cartModel } from "./cart.model";

export async function getAllCart(queryInput: QueryInput = {}) {
        return getDataWithPagination(queryInput, cartModel);
    }

export async function getOneCart(_id: String) {
        try {
            const cart: Cart = await cartModel.findById(_id).lean();
            
            return  {
                code: '200',
                status: '',
                mesage: '',
                data: cart,
            };
        } catch (err) {
            console.log(err);

            return null;
        }
    }

export async function createCart(cartArgs: Cart) {
        try {
            const cart: Cart = await cartModel.create(cartArgs);
            
            return {
                code: '200',
                status: '',
                mesage: '',
                data: cart,
            };
        } catch (err) {
            console.log(err);

            return null;
        }
    }

export async function updateCart(_id: String, data: any) {
        try {
            const cart = await cartModel.findByIdAndUpdate(
                    _id ,
                    {
                        $set: data
                    },
                    {
                        new: true
                    }
                )

            return {
                code: '200',
                status: '',
                mesage: '',
                data: cart,
            };
        } catch (err) {
            console.log(err);

            return null;
        }
    }

export async function deleteCart(_id: String) {
        try {
            const cart = await cartModel.findByIdAndDelete(_id);
            
            return {
                code: '200',
                status: '',
                mesage: '',
                data: cart,
            };
        } catch (err) {
            console.log(err);
            
            return null;
        }
    }
