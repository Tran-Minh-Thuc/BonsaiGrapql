import { QueryInput } from "../../base/crudService";
import getDataWithPagination from "../../helper/service/getDataWithPagination";
import { testModel } from "./test.model";

export async function getAllTest(queryInput: QueryInput = {}) {
        return getDataWithPagination(queryInput, testModel);
    }

export async function getOneTest(_id: String) {
        try {
            const test: Test = await testModel.findById(_id).lean();
            
            return test;
        } catch (err) {
            console.log(err);

            return err;
        }
    }

export async function createTest(testArgs: Test) {
        try {
            const test: Test = await testModel.create(testArgs);
            
            return test;
        } catch (err) {
            console.log(err);

            return err;
        }
    }

export async function updateTest(_id: String, data: any) {
        try {
            const test = await testModel.findByIdAndUpdate(
                    _id ,
                    {
                        $set: data
                    },
                    {
                        new: true
                    }
                )

            return test;
        } catch (err) {
            console.log(err);

            return err;
        }
    }

export async function deleteTest(_id: String) {
        try {
            const test = await testModel.findByIdAndDelete(_id);
            
            return test;
        } catch (err) {
            console.log(err);
            
            return err;
        }
    }
