import { gql } from "apollo-server"
import { BaseDocument } from "../../base/baseModel"
import { StatusEnum, TypePaymentEnum } from "./order.model"

declare global {
    type OrderItem = {
        bonsaiId: string,
        amount: number,
        modelId: string,
        modelDataId: string,
        quantity: number
        _id?: string,
    }
    type Order = BaseDocument & {
        _id?: string,
        userId?: string,
        voucherId?: string,
        deliveryId?: string,
        shopId?: string,
        typePayment?: TypePaymentEnum,
        shippingFee?: number,
        finalPrice?: number,
        status?: StatusEnum,
        orderItems?: OrderItem[],
        note: string,
    }
}

export default gql`

enum TypePaymentEnum {
        # PAYMENT_WITH_CARD
        # PAYMENT_WITH_MONEY
        CASH_ON_DELIVERY 
        VNPAY 
        DOMESTIC_PAYMENT_CARD 
        INTERNATIONAL_PAYMENT_CARD
    }

    enum StatusEnum {
        WAITING
        RETURNED    
        EXCHANGE
        PENDING
        CONFIRMED
        DELIVERING
        COMPLETED
        CANCELED
        REFUNDED
    }
    # TYPE
    type Order {
        _id: ID
        userId: ID
        voucherId: ID
        deliveryId: ID
        #------------------
        typePayment: TypePaymentEnum
        shippingFee: Float
        finalPrice: Float
        status: StatusEnum
        orderItems: [OrderItem]
        note:String
        createdAt: Float
        updatedAt: Float
        #------------------
        # user: User
        # voucher: Voucher
        # delivery: Delivery
    }

    type OrderItem {
        _id: ID
        bonsaiId: ID
        modelId: ID
        modelDataId: ID
        #-------------
        amount: Float
        quantity: Int
        # isChecked: Boolean
        #-------------
        bonsai: Bonsai
        model: Model
    }

    type ResultOrder {
        code: String
        status: String
        mesage: String
        data: Order
    }

    #ROOT TYPE
    type Query {
        getAllOrder(q: QueryInput): OrderPageData
        getOneOrder(_id: ID!): ResultOrder
        getOrderByUserId(userId: ID!): [Order]
    }

    type OrderPageData {
        data: [Order]
        pagination: Pagination
    }

    type Mutation {
        createOrder(data: CreateOrderInput): ResultOrder
        updateOrder(_id: ID!, data: UpdateOrderInput): ResultOrder
        deleteOrder(_id: ID!): ResultOrder
    }

    input OrderItemInput {
        productId: ID!
        quantity: Int!
        modelId: ID
        modelDataId: ID
        amount: Float!
    }
    # INPUT
    input CreateOrderInput {
        userId: ID
        voucherId: ID
        deliveryId: ID
        #------------------
        typePayment: TypePaymentEnum
        shippingFee: Float
        finalPrice: Float
        status: StatusEnum
        orderItems: [OrderItemInput]
        note:String
    }

    input UpdateOrderInput {
        userId: ID
        voucherId: ID
        deliveryId: ID
        #------------------
        typePayment: TypePaymentEnum
        shippingFee: Float
        finalPrice: Float
        status: StatusEnum
        orderItems: [OrderItemInput]
        note:String
    }
`