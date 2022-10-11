import { QueryInput } from "../../base/crudService";
import getDataWithPagination from "../../helper/service/getDataWithPagination";
import { orderModel } from "./order.model";
import logger from "../../helper/logger";

export async function getAllOrder(queryInput: QueryInput = {}) {
        return getDataWithPagination(queryInput, orderModel);
    }

export async function getOneOrder(_id: String) {
        try {
            const order: Order = await orderModel.findById(_id).lean();
            
            return  {
                code: '200',
                status: '',
                mesage: '',
                data: order,
            };
        } catch (err) {
            logger.info(err);

            return null;
        }
    }

export async function createOrder(orderArgs: Order) {
        try {
            const order: Order = await orderModel.create(orderArgs);
            
            return {
                code: '200',
                status: '',
                mesage: '',
                data: order,
            };
        } catch (err) {
            logger.info(err);

            return null;
        }
    }

export async function updateOrder(_id: String, data: any) {
        try {
            const order = await orderModel.findByIdAndUpdate(
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
                data: order,
            };
        } catch (err) {
            logger.info(err);

            return null;
        }
    }

export async function deleteOrder(_id: String) {
        try {
            const order = await orderModel.findByIdAndDelete(_id);
            
            return {
                code: '200',
                status: '',
                mesage: '',
                data: order,
            };
        } catch (err) {
            logger.info(err);
            
            return null;
        }
    }
