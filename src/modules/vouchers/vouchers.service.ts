import { QueryInput } from "../../base/crudService";
import getDataWithPagination, { getDataPaginationWithQuery } from "../../helper/service/getDataWithPagination";
import { vouchersModel } from "./vouchers.model";

export async function getAllVouchers(queryInput: QueryInput = {}) {
    return getDataWithPagination(queryInput, vouchersModel);
}

export async function getById(_id: String) : Promise<Vouchers|any>{
    try {
        const voucher = await vouchersModel.findById(_id);
        if (voucher === null) {
            return [];
        }
        return voucher;
    } catch (err) {
        console.log(err);

        return null;
    }
}

export async function createVouchers(vouchersArgs: Vouchers) {
    try {
        const newVoucher = {
            ...vouchersArgs,
            ...{
                createdAt: Date.now(),
                updatedAt: Date.now(),
            }
        }
        const vouchers: Vouchers = await vouchersModel.create(newVoucher);
        if(vouchers === null){
            return null;
        }

        return vouchers;
        
    } catch (err) {
        console.log(err);

        return null;
    }
}

export async function updateVouchers(_id: String, data: any) {
    try {
        data.updatedAt = Date.now();

        const vouchers = await vouchersModel.findByIdAndUpdate(
            _id,
            {
                $set: data
            },
            {
                new: true,
                timestamps : false
            }
        )
        
        if(!vouchers){
            return null;
        }
        return vouchers;
    } catch (err) {
        console.log(err);

        return null;
    }
}

export async function deleteVouchers(_id: String) {
    try {
        const vouchers = await vouchersModel.findByIdAndDelete(_id);

        return {
            code: '200',
            status: '',
            mesage: '',
            data: vouchers,
        };
    } catch (err) {
        console.log(err);

        return null;
    }
}

export async function getShippingVoucher(queryInput: QueryInput = {}) {
    const query = vouchersModel.find({type:"SHIPPING"})
    if(query === null){
        return null;
    }
    return getDataPaginationWithQuery(queryInput,query,vouchersModel);
}

export async function getOrdersVoucher(queryInput: QueryInput = {}) {
    const query = vouchersModel.find({type:"ORDER"})
    if(query === null){
        return null;
    }
    return getDataPaginationWithQuery(queryInput,query,vouchersModel);
}
