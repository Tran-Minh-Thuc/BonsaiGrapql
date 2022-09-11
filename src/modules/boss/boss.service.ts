import { QueryInput } from "../../base/crudService";
import getDataWithPagination from "../../helper/service/getDataWithPagination";
import { bossModel } from "./boss.model";

export async function getAllBoss(queryInput: QueryInput = {}) {
        return getDataWithPagination(queryInput, bossModel);
    }

export async function getOneBoss(_id: String) {
        try {
            const boss: Boss = await bossModel.findById(_id).lean();
            
            return boss;
        } catch (err) {
            console.log(err);

            return err;
        }
    }

export async function createBoss(bossArgs: Boss) {
        try {
            const boss: Boss = await bossModel.create(bossArgs);
            
            return boss;
        } catch (err) {
            console.log(err);

            return err;
        }
    }

export async function updateBoss(_id: String, data: any) {
        try {
            const boss = await bossModel.findByIdAndUpdate(
                    _id ,
                    {
                        $set: data
                    },
                    {
                        new: true
                    }
                )

            return boss;
        } catch (err) {
            console.log(err);

            return err;
        }
    }

export async function deleteBoss(_id: String) {
        try {
            const boss = await bossModel.findByIdAndDelete(_id);
            
            return boss;
        } catch (err) {
            console.log(err);
            
            return err;
        }
    }
