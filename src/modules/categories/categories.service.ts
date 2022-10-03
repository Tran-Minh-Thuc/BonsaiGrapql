import { QueryInput } from "../../base/crudService";
import getDataWithPagination from "../../helper/service/getDataWithPagination";
import { categoriesModel } from "./categories.model";

export async function getAllCategories(queryInput: QueryInput = {}) {
        return getDataWithPagination(queryInput, categoriesModel);
    }

export async function getOneCategories(_id: String) {
        try {
            const categories: Categories = await categoriesModel.findById(_id).lean();
            
            return  {
                code: '200',
                status: '',
                mesage: '',
                data: categories,
            };
        } catch (err) {
            console.log(err);

            return null;
        }
    }

export async function createCategories(categoriesArgs: Categories) {
        try {
            const categories: Categories = await categoriesModel.create(categoriesArgs);
            
            return {
                code: '200',
                status: '',
                mesage: '',
                data: categories,
            };
        } catch (err) {
            console.log(err);

            return null;
        }
    }

export async function updateCategories(_id: String, data: any) {
        try {
            const categories = await categoriesModel.findByIdAndUpdate(
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
                data: categories,
            };
        } catch (err) {
            console.log(err);

            return null;
        }
    }

export async function deleteCategories(_id: String) {
        try {
            const categories = await categoriesModel.findByIdAndDelete(_id);
            
            return {
                code: '200',
                status: '',
                mesage: '',
                data: categories,
            };
        } catch (err) {
            console.log(err);
            
            return null;
        }
    }
