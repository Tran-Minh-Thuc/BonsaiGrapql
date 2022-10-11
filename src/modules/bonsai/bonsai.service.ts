import { QueryInput } from "../../base/crudService";
import getDataWithPagination from "../../helper/service/getDataWithPagination";
import { bonsaiModel } from "./bonsai.model";

export async function getAllBonsai(queryInput: QueryInput = {}) {
        return getDataWithPagination(queryInput, bonsaiModel);
    }

export async function getOneBonsai(_id: String) {
        try {
            const bonsai: Bonsai = await bonsaiModel.findById(_id).lean();
            
            return  {
                code: '200',
                status: '',
                mesage: '',
                data: bonsai,
            };
        } catch (err) {
            console.log(err);

            return null;
        }
    }

export async function createBonsai(bonsaiArgs: Bonsai) {
        try {
            const bonsai: Bonsai = await bonsaiModel.create(bonsaiArgs);
            
            return {
                code: '200',
                status: '',
                mesage: '',
                data: bonsai,
            };
        } catch (err) {
            console.log(err);

            return null;
        }
    }

export async function updateBonsai(_id: String, data: any) {
        try {
            const bonsai = await bonsaiModel.findByIdAndUpdate(
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
                data: bonsai,
            };
        } catch (err) {
            console.log(err);

            return null;
        }
    }

export async function deleteBonsai(_id: String) {
        try {
            const bonsai = await bonsaiModel.findByIdAndDelete(_id);
            
            return {
                code: '200',
                status: '',
                mesage: '',
                data: bonsai,
            };
        } catch (err) {
            console.log(err);
            
            return null;
        }
    }
