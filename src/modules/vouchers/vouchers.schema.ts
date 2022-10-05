import { gql } from "apollo-server"
import { BaseDocument } from "../../base/baseModel"

declare global {
    type Vouchers = BaseDocument & {
        _id?: string,
        description: string,
        start_time:Date,
        end_time:Date,
        quantity: Number,
        min_point: Number,
        min_order : Number,
        max_discount: Number,
        sale_percent: Number,
        type : String,
        bonus_decrease: Number
    }
}

export default gql`
    # TYPE
    type Vouchers {
        _id: ID
        description: String
        start_time:Float
        end_time:Float
        quantity: Int
        min_point: Int
        min_order : Int
        max_discount: Int
        sale_percent: Int
        type : String
        bonus_decrease: Int

        createdAt: Float
        updatedAt: Float
    }

    type ResultResponseVoucherMany {
        code: Int
        status: Boolean
        message: String
        data: [Vouchers]
        pagination: Pagination
    }

    type ResultResponseVoucher {
        code: Int
        status: Boolean
        message: String
        data: Vouchers
    }

    type ResultResponseValidVoucher{
        code: Int
        status: Boolean
        message: String
        data: [Vouchers]
        user:Users
    }

    #ROOT TYPE
    type Query {
        getAllVouchers(q: QueryInput): ResultResponseVoucherMany
        getVoucherById(_id: ID): ResultResponseVoucher

        getAllVoucherShipping(q: QueryInput) : ResultResponseVoucherMany
        getAllVoucherOrders(q: QueryInput) : ResultResponseVoucherMany
        getValidVoucher(userId:ID,order_sum:Int) : ResultResponseValidVoucher
        getValidVoucherByUser(userId:ID) : ResultResponseValidVoucher
        
    }

    type VouchersPageData {
        data: [Vouchers]
        pagination: Pagination
    }

    type Mutation {
        createVouchers(data: CreateVouchersInput): ResultResponseVoucher
        updateVouchers(_id: ID, data: UpdateVouchersInput): ResultResponseVoucher
        deleteVouchers(_id: ID): ResultResponseVoucher
    }

    # INPUT
    input CreateVouchersInput {
        description: String
        start_time:Float
        end_time:Float
        quantity: Int
        min_point: Int
        min_order : Int
        max_discount: Int
        sale_percent: Int
        type : String
        bonus_decrease: Int
    }

    input UpdateVouchersInput {
        description: String
        start_time:Float
        end_time:Float
        quantity: Int
        min_point: Int
        min_order : Int
        max_discount: Int
        sale_percent: Int
        type : String
        bonus_decrease: Int
    }
`