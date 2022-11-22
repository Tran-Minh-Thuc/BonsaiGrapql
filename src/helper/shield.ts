import { shield, rule, allow, deny, and, not, IRule } from "graphql-shield";

let isAuthentication = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return ctx.userId !==  undefined;
})

let isAdmin = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return ctx.userId !==  undefined && ctx.role === 'ADMIN_ROLE';
})



export const permission = {
    Query: {
        
        getOneBonsai: isAuthentication,
        
        getOneCategory: isAuthentication,
        
        getAllModel: isAuthentication,
        
        getAllOrder: isAuthentication,
        getOneOrder: isAuthentication,
        getOrderByUserId: isAuthentication,
        
        getAllCart: isAdmin,
        getOneCart: isAuthentication,
        getOneItemCart: isAuthentication,
        
        getAllPaymentwithvnpay: isAuthentication,
        getOnePaymentwithvnpay: isAuthentication,
        
        getAllUsers: isAdmin,
        getUserById: isAuthentication,
        getUserByName: isAuthentication,
        getUserByEmail: isAuthentication,
        getUserByPhone: isAuthentication,
        
        getVoucherById: isAuthentication,
        getAllVoucherShipping: isAuthentication,
        getAllVoucherOrders: isAuthentication,
        getValidVoucher: isAuthentication,
        getValidVoucherByUser: isAuthentication,
    },
    Mutation:{
        createBonsai: isAdmin,
        updateBonsai: isAdmin,
        deleteBonsai: isAdmin,

        createCart: isAuthentication,
        updateCart: isAuthentication,
        deleteCart: isAuthentication,
        createItemCart: isAuthentication,
        updateItemCart: isAuthentication,
        deleteItemCart: isAuthentication,
        DecreaseQuantityItemCart: isAuthentication,
        IncreaseQuantityItemCart: isAuthentication,

        createCategory: isAdmin,
        updateCategory: isAdmin,
        deleteCategory: isAdmin,

        createModel: isAuthentication,
        updateModel: isAuthentication,
        deleteModel: isAuthentication,
        
        createOrder: isAuthentication,
        updateOrder: isAuthentication,
        deleteOrder: isAuthentication,
        
        createPaymentwithvnpay: isAuthentication,
        deletePaymentwithvnpay: isAuthentication,
        createPaymentURL: isAuthentication,
        IPNURL: isAuthentication,

        updateUserById: isAuthentication,
        updateUserPassword : isAuthentication,
        deleteUserById: isAdmin,

        createVouchers: isAdmin,
        updateVouchers: isAdmin,
        deleteVouchers: isAdmin,
    }
}

