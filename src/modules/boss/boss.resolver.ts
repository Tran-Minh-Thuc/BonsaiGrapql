import * as bossService from "./boss.service";

export const bossResolver = {
    Query: {
        getAllBoss: async (root:Boss, args:any, context) => {
            const { q } = args;
            const bosses: any = await bossService.getAllBoss(q);

            return bosses;
        },

        getOneBoss: async (root:Boss, args:any, context) => {
            const { _id } = args;
            const boss: Boss = await bossService.getOneBoss(_id);

            return boss;
        },
    },

    Mutation: {
        createBoss: async (root:Boss, args:any, context) => {
            const {data}= args;

            return await bossService.createBoss(data);
        },

        updateBoss: async (root:Boss, args:any, context) => {    
            const {_id, data} = args;

            return await bossService.updateBoss(_id, data);
        },

        deleteBoss: async (root:Boss, args:any, context) => {
            const {_id} = args;

            return await bossService.deleteBoss(_id); 
        }
    }
}