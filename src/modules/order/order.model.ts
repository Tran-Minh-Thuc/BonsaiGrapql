import { model, Schema } from "mongoose";
import { getModelDataLoader } from "../../helper/dataloader";

export enum TypePaymentEnum {
    // PAYMENT_WITH_CARD = "PAYMENT_WITH_CARD",
    //PAYMENT_WITH_MONEY = "PAYMENT_WITH_MONEY",
    CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
    VNPAY = "VNPAY",
    DOMESTIC_PAYMENT_CARD = "DOMESTIC_PAYMENT_CARD",
    INTERNATIONAL_PAYMENT_CARD = "INTERNATIONAL_PAYMENT_CARD",
}

export enum StatusEnum {
    WAITING = "WAITING",
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    DELIVERING = "DELIVERING",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
    REFUNDED = "REFUNDED",
    RETURNED = "RETURNED",
    EXCHANGE = "EXCHANGE",
}

const orderItemSchema = new Schema({
    bonsaiId: {
        type: Schema.Types.ObjectId,
        ref: "Bonsai",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        default: 0
    },
    modelId: { type: Schema.Types.ObjectId, ref: "Model" },
    modelDataId: { type: String, default: "" },
})

const orderSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        voucherId: { type: Schema.Types.ObjectId, ref: "Voucher" },
        deliveryId: { type: Schema.Types.ObjectId, ref: "Delivery" },
        shippingFee: { type: Number, default: 0 },
        finalPrice: { type: Number, default: 0 },
        typePayment: {
            type: String, enum: Object.values(TypePaymentEnum),
            default: TypePaymentEnum.CASH_ON_DELIVERY
        },
        status: { type: String, default: StatusEnum.PENDING },
        orderItems: { type: [orderItemSchema], default: [] },
        note: { type: String, default: "" },

    },
    {
        timestamps: true,
        collection: "orders"
    }
)

export const orderModel = model<Order>("Order", orderSchema);
export const orderLoader = getModelDataLoader(orderModel);