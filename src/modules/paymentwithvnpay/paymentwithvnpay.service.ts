import { QueryInput } from "../../base/crudService";
import logger from "../../helper/logger";
import getDataWithPagination from "../../helper/service/getDataWithPagination";
import { paymentwithvnpayModel } from "./paymentwithvnpay.model";
import { DateTime } from "luxon";
// import dateFormat, { masks } from "dateformat";
import { format, compareAsc } from 'date-fns'
import ip from "ip";
import sha256 from 'sha256';
import qs from 'qs';
import crypto from "crypto";
import { publicIp, publicIpv4, publicIpv6 } from 'public-ip';
import { cartModel } from "../cart/cart.model";

export default {
    async getAllPaymentwithvnpay(queryInput: QueryInput = {}) {
        return getDataWithPagination(queryInput, paymentwithvnpayModel);
    },

    async getOnePaymentwithvnpay(_id: String) {
        try {
            const paymentwithvnpay: Paymentwithvnpay = await paymentwithvnpayModel.findById(_id).lean();

            return paymentwithvnpay;
        } catch (err) {
            logger.error(err);

            return err;
        }
    },

    async createPaymentwithvnpay(paymentwithvnpayArgs: Paymentwithvnpay) {
        try {
            const paymentwithvnpay: Paymentwithvnpay = await paymentwithvnpayModel.create(paymentwithvnpayArgs);

            return paymentwithvnpay;
        } catch (err) {
            logger.error(err);

            return err;
        }
    },

    getConfig() {
        return {
            vnp_TmnCode: process.env.VNP_TMNCODE,
            vnp_HashSecret: process.env.VNP_HASHSECRET,
            vnp_Url: process.env.VNP_URL,
            vnp_ReturnUrl: process.env.VNP_RETURNURL,
        }
    },

    sortObject(obj) {
        var sorted = {};
        var str = [];
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    },

    // async IPNURL(strURL: string) {
    //     var vnp_Params = Object.fromEntries(new URLSearchParams(strURL));
    //     console.log("🚀 ~ vnp_Params", vnp_Params)
    //     console.log("🚀 ~ vnp_Params", typeof (vnp_Params))
    //     var secureHash = vnp_Params['vnp_SecureHash'];
    //     console.log("🚀 ~ secureHash", secureHash)

    //     delete vnp_Params['vnp_SecureHash'];
    //     delete vnp_Params['vnp_SecureHashType'];

    //     vnp_Params = this.sortObject(vnp_Params);
    //     console.log("🚀 ~ vnp_Params", vnp_Params)
    //     var config = this.getConfig();
    //     var secretKey = config.vnp_HashSecret;
    //     var signData = qs.stringify(vnp_Params, { encode: false });
    //     var hmac = crypto.createHmac("sha512", secretKey);
    //     var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    //     console.log("🚀 ~ signed", signed)
    //     const paymentwithvnpay: Paymentwithvnpay = await paymentwithvnpayModel.findOne({ TxnRef: vnp_Params['vnp_TxnRef'] }).lean();
    //     console.log("🚀 ~ paymentwithvnpay", paymentwithvnpay);
    //     var data = {};
    //     data['userId'] = paymentwithvnpay.userId.toString();
    //     data['vnp_BankTranNo'] = vnp_Params['vnp_BankTranNo'];
    //     data['vnp_TransactionNo'] = vnp_Params['vnp_TransactionNo'];
    //     data['rspCode'] = vnp_Params['vnp_ResponseCode'];
    //     if (vnp_Params['vnp_ResponseCode'] == "00") {
    //         data['message'] = "success";
    //     }
    //     //check herroku
    //     else { data['message'] = "fail" }
    //     console.log("🚀 ~ data", data)
    //     console.log("🚀 ~ data", typeof (data))
    //     const resultsReturnedOfVnpay: ResultsReturnedOfVnpay = await resultsReturnedOfVnpayModel.create(data);
    //     console.log("🚀 ~ resultsReturnedOfVnpay", resultsReturnedOfVnpay)
    //     if (secureHash === signed) {
    //         var orderId = vnp_Params['vnp_TxnRef'];
    //         var rspCode = vnp_Params['vnp_ResponseCode'];
    //         var vnp_TransactionNo = vnp_Params['vnp_TransactionNo'];
    //         var vnp_BankTranNo = vnp_Params['vnp_BankTranNo'];
    //         const cart: Cart = await cartModel.findOne({ userId: paymentwithvnpay.userId }).lean();
    //         console.log("🚀 ~ cart", cart)
    //         //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
    //         return { userId: paymentwithvnpay.userId, vnp_BankTranNo: vnp_BankTranNo, vnp_TransactionNo: vnp_TransactionNo, RspCode: '00', Message: 'success' };
    //     }
    //     else {
    //         return { userId: paymentwithvnpay.userId, RspCode: '97', Message: 'Fail checksum' };
    //     }
    // },
    // digits_count(n) {
    //     const str = n.toString();
    //     return str.length;
    // },

    async createPaymentURL(userId: String) {
        try {
            console.log("🚀 ~ _id", userId)
            const paymentwithvnpay: Paymentwithvnpay = await paymentwithvnpayModel.findOne({ userId: userId }).lean();
            console.log("🚀 ~ paymentwithvnpay", paymentwithvnpay);
            var ipAddr = ip.address();
            var config = this.getConfig();
            var tmnCode = config.vnp_TmnCode;
            var secretKey = config.vnp_HashSecret;
            var vnpUrl = config.vnp_Url;
            var returnUrl = config.vnp_ReturnUrl;
            console
            // var date = new Date();
            var datezone = DateTime.now().setZone("Asia/Saigon");
            console.log("🚀 ~ datezone", datezone);
            var date = datezone.c;
            console.log("🚀 ~ date", date)
            let month = date.month;
            let day = date.day;
            let hour = date.hour;
            let minute = date.minute;
            let second = date.second;
            if (this.digits_count(month) === 1) {
                month = '0' + month.toString();
            }
            if (this.digits_count(day) === 1) {
                day = '0' + day.toString();
            }
            if (this.digits_count(hour) === 1) {
                hour = '0' + hour.toString();
            }
            if (this.digits_count(minute) === 1) {
                minute = '0' + minute.toString();
            }
            if (this.digits_count(second) === 1) {
                second = '0' + second.toString();
            }
            console.log("🚀 ~ date", date.year.toString() + month.toString() + date.day.toString());

            // var createDate = format(date, 'yyyyMMddHHmmss');
            var createDate = date.year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString() + second.toString();
            var orderId = paymentwithvnpay.TxnRef;
            var amount = paymentwithvnpay.amount * 100;
            var bankCode = paymentwithvnpay.bankCode;
            // var orderInfo = paymentwithvnpay.orderInfo;
            var message = "Thanh toan don hang" + userId + "Thoi gian :" + createDate.toString();
            var orderInfo = encodeURI(message);
            var orderType = paymentwithvnpay.orderType;
            var locale = paymentwithvnpay.language;
            var currCode = 'VND';
            var vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            // vnp_Params['vnp_Merchant'] = ''
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = orderInfo;
            vnp_Params['vnp_OrderType'] = orderType;
            vnp_Params['vnp_Amount'] = amount;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            if (bankCode !== null) {
                vnp_Params['vnp_BankCode'] = bankCode;
            }
            vnp_Params = this.sortObject(vnp_Params);
            console.log("🚀 ~ vnp_Params", vnp_Params)
            var signData = qs.stringify(vnp_Params, { encode: false });
            var hmac = crypto.createHmac("sha512", secretKey);
            var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
            console.log("🚀 ~ vnpUrl", typeof (vnpUrl))
            return {
                message: message,
                Url: vnpUrl,
            };
        } catch (err) {
            logger.error(err);
            return err;
        }
    },


    async deletePaymentwithvnpay(_id: String) {
        try {
            const paymentwithvnpay = await paymentwithvnpayModel.findByIdAndDelete(_id);

            return paymentwithvnpay;
        } catch (err) {
            logger.error(err);

            return err;
        }
    }
}