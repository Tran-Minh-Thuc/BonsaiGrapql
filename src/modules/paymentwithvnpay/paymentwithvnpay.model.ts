import { model, Schema } from "mongoose";
import { getModelDataLoader } from "../../helper/dataloader";

// export enum orderTypeEnum{
//     100000 = "100000",
// }

export enum languageEnum {
    vn = "vn",
    en = "en",
    vi = "vi",
}

export enum bankCodeEnum {
    VNPAYQR = "VNPAYQ",
    NCB = "NCB",
    SCB = "SCB",
    SACOMBANK = "SACOMBANK",
    EXIMBANK = "EXIMBANK",
    MSBANK = "MSBANK",
    NAMABANK = "NAMABANK",
    VISA = "VISA",
    VNMART = "VNMART",
    VIETINBANK = "VIETINBANK",
    VIETCOMBANK = "VIETCOMBANK",
    HDBANK = "HDBANK",
    DONGABANK = "DONGABANK",
    TPBANK = "TPBANK",
    OJB = "OJB",
    BIDV = "BIDV",
    TECHCOMBANK = "TECHCOMBANK",
    VPBANK = "VPBANK",
    AGRIBANK = "AGRIBANK",
    MBBANK = "MBBANK",
    ACB = "ACB",
    OCB = "OCB",
    SHB = "SHB",
    IVB = "IVB",
}

const paymentwithvnpaySchema = new Schema(
    {
        userId:{type: Schema.Types.ObjectId,ref:"User", default: ""},
        amount: { type: Number, default: ""},
        orderType: {type: String, default: ""},
        TxnRef: {type: String},
        bankCode: {type: String, default: null},
        language: {type: String, default: languageEnum.vn},
        //clientHost: { type: String, default: ""},
        orderInfo: { type: String, default: "payment with vnpay" },
    },
    {
        timestamps: true
    }
)

export const paymentwithvnpayModel = model<Paymentwithvnpay>("Paymentwithvnpay", paymentwithvnpaySchema);
export const paymentwithvnpayLoader = getModelDataLoader(paymentwithvnpayModel); 