import logger from "../../helper/logger";
import paymentwithvnpayService from "./paymentwithvnpay.service";
import { GraphqlResolver } from "../../helper/graphql/resolver";
import { cartLoader, cartModel } from "../cart/cart.model"
import {paymentwithvnpayModel} from "./paymentwithvnpay.model"
import { format, compareAsc } from 'date-fns'


export const paymentwithvnpayResolver = {
    Query: {
        getAllPaymentwithvnpay: async (root: Paymentwithvnpay, args: any, context) => {
            const { q } = args;
            const paymentwithvnpays: any = await paymentwithvnpayService.getAllPaymentwithvnpay(q);

            return paymentwithvnpays;
        },

        getOnePaymentwithvnpay: async (root: Paymentwithvnpay, args: any, context) => {
            const { _id } = args;
            const paymentwithvnpay: Paymentwithvnpay = await paymentwithvnpayService.getOnePaymentwithvnpay(_id);

            return paymentwithvnpay;
        },
    },

    Mutation: {
        createPaymentwithvnpay: async (root: Paymentwithvnpay, args: any, context) => {
            const { data } = args;
            let countMoney = 0;
            const carts = await cartModel.findOne({userId:data.userId}).lean();
            for(const value of carts.itemCart){
                if(value.amount){
                    countMoney += value.amount;
                }
            }
            data.amount = countMoney;
            const oldPayment:Paymentwithvnpay = await paymentwithvnpayModel.findOne({userId:data.userId}).lean();
            if(oldPayment){
            await paymentwithvnpayModel.findByIdAndDelete(oldPayment._id);
            }
            
            var date = new Date();
            data.TxnRef = format(date, 'yyyyMMddHHmmss');
            // console.log("🚀 ~ cart.activeAmount", cart.activeAmount)
            // console.log("🚀 ~ data.amount", data.amount)
            return await paymentwithvnpayService.createPaymentwithvnpay(data);
        },

        // IPNURL: async (root: Paymentwithvnpay, args: any, context) => {
        //     const { strURL } = args;
        //     return await paymentwithvnpayService.IPNURL(strURL);
        // },
        createPaymentURL: async (root: Paymentwithvnpay, args: any, context) => {
            const { userId } = args;
            console.log("🚀 ~ _id", userId)
            return await paymentwithvnpayService.createPaymentURL(userId);
        },

        deletePaymentwithvnpay: async (root: Paymentwithvnpay, args: any, context) => {
            const { _id } = args;

            return await paymentwithvnpayService.deletePaymentwithvnpay(_id);
        }
    },
    Paymentwithvnpay: {
        cart: GraphqlResolver.load(cartLoader, "cartId")
    }
} 