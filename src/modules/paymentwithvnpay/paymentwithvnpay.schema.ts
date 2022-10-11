import { gql } from "apollo-server"
import { BaseDocument } from "../../base/baseModel"
import {  bankCodeEnum, languageEnum } from "../paymentwithvnpay/paymentwithvnpay.model"

declare global {
    type Paymentwithvnpay = BaseDocument & {
        _id: string,
        orderId: string,   
        userId: string, 

        amount: number,
        orderType: number,
        TxnRef: string
        bankCode: bankCodeEnum,
        language: languageEnum,
        //clientHost: string,
        //orderInfo: string,        //orderInfo: string,

        createdAt: string,
        updatedAt: string,
    }
}

export default gql`
    #ENUM
    # enum orderTypeEnum{
    #     100000
    # }
    enum languageEnum{
        vn
        en
        vi
    }
    enum bankCodeEnum{
        VNPAYQR
        NCB
        SCB
        SACOMBANK
        EXIMBANK
        MSBANK
        NAMABANK
        VISA
        VNMART
        VIETINBANK
        VIETCOMBANK
        HDBANK
        DONGABANK
        TPBANK
        OJB
        BIDV
        TECHCOMBANK
        VPBANK
        AGRIBANK
        MBBANK
        ACB
        OCB
        SHB
        IVB
    }
    
    # TYPE
    type Paymentwithvnpay {
        _id: ID
        userId: ID
        amount: Int
        orderType: Int
        TxnRef: String
        bankCode: bankCodeEnum
        language: languageEnum
        # clientHost: String
        # orderInfo: String
        createdAt: Float
        updatedAt: Float
        cart: Cart
    }
    type returnUrlVNPay {
        message: String
        Url: String
    }
    # value return vpn url
    type returnVPNURL{
        userId: ID
        vnp_BankTranNo: String
        vnp_TransactionNo: String
        RspCode: String
        Message: String
    }
    #ROOT TYPE
    type Query {
        getAllPaymentwithvnpay(q: QueryInput): PaymentwithvnpayPageData
        getOnePaymentwithvnpay(_id: ID!): Paymentwithvnpay
    }
    type PaymentwithvnpayPageData {
        data: [Paymentwithvnpay]
        pagination: Pagination
    }
    type Mutation {
        createPaymentwithvnpay(data: CreatePaymentwithvnpayInput): Paymentwithvnpay
        # updatePaymentwithvnpay(_id: ID!, data: UpdatePaymentwithvnpayInput): Paymentwithvnpay
        deletePaymentwithvnpay(_id: ID!): Paymentwithvnpay
        createPaymentURL(userId:ID!): returnUrlVNPay
        IPNURL(strURL: String): returnVPNURL
    }
    # INPUT
    input CreatePaymentwithvnpayInput {
        userId: ID!
        # amount: Float!
        orderType: String
        bankCode: String
        language: String
        # clientHost: String
        # orderInfo: String
    }
 
    input UpdatePaymentwithvnpayInput {
        userId: ID!
        amount: Int
        orderType: Int
        bankCode: String
        language: String
        # clientHost: String
        # orderInfo: String
    }
` 