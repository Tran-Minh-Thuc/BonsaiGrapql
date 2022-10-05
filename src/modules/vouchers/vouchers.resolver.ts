import * as vouchersService from "./vouchers.service";
import * as userService from "../users/users.service";
//import { testLoader } from "../test/test.model";
import { GraphqlResolver } from "../../helper/graphql/resolver";
import { httpResponse } from "../../helper/HttpResponse";

export const vouchersResolver = {
    Query: {
        getAllVouchers: async (root: Vouchers, args: any, context) => {
            const { q } = args;
            const vouchers = await vouchersService.getAllVouchers(q);

            if (vouchers === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    status: false,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    data: []
                }
            }

            return {
                code: httpResponse.OK.CODE,
                message: httpResponse.OK.MESSAGE,
                status: true,
                data: vouchers.data,
                pagination: vouchers.pagination
            }
        },

        getVoucherById: async (root: Vouchers, args: any, context) => {
            const { _id } = args
            if (_id === undefined) {
                return {

                    code: httpResponse.BAD_REQUEST.CODE,
                    status: false,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    data: null

                }
            }

            const voucher = await vouchersService.getById(_id);
            if (voucher === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    status: false,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    data: null
                }
            }
            else if (voucher.length == 0) {
                return {
                    code: httpResponse.NOT_FOUND.CODE,
                    status: false,
                    message: httpResponse.NOT_FOUND.MESSAGE + ` : Can't find voucher have id = ${_id}`,
                    data: null
                }
            }

            return {
                code: httpResponse.OK.CODE,
                status: true,
                message: httpResponse.OK.MESSAGE,
                data: voucher
            }

        },

        getAllVoucherShipping: async (root: Vouchers, args: any, context) => {
            const { q } = args
            const voucher = await vouchersService.getShippingVoucher(q);

            if (voucher === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    status: false,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    data: null
                }
            }

            return {
                code: httpResponse.OK.CODE,
                message: httpResponse.OK.MESSAGE,
                status: true,
                data: voucher.data,
                pagination: voucher.pagination
            }
        },
        getAllVoucherOrders: async (root: Vouchers, args: any, context) => {
            const { q } = args
            const voucher = await vouchersService.getOrdersVoucher(q);

            if (voucher === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    status: false,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    data: null
                }
            }

            return {
                code: httpResponse.OK.CODE,
                message: httpResponse.OK.MESSAGE,
                status: true,
                data: voucher.data,
                pagination: voucher.pagination
            }
        },

        getValidVoucher: async (root: Vouchers, args: any, context) => {
            const { userId, order_sum } = args;
            if (userId === undefined || order_sum === undefined) {
                return {
                    code: httpResponse.BAD_REQUEST.CODE,
                    status: false,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    data: null
                }
            }

            const user = await userService.getUserById(userId);
            if (user === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    status: false,
                }
            }
            else if (user.length == 0) {
                return {
                    code: httpResponse.NOT_FOUND.CODE,
                    message: httpResponse.NOT_FOUND.MESSAGE + ` : Can't find user with id ${userId}`,
                    status: false,
                }
            }

            const vouchers = await vouchersService.getAllVouchers();

            const filterVoucher = vouchers.data.filter((voucher) => {
                if (voucher.min_point <= user.point && voucher.min_order <= order_sum) {
                    return voucher
                }
            })

            return {
                code: httpResponse.OK.CODE,
                message: httpResponse.OK.MESSAGE,
                status: true,
                data: filterVoucher,
                user: user
            }
        },
        getValidVoucherByUser: async (root: Vouchers, args: any, context) => {
            const { userId } = args;
            if (userId === undefined) {
                return {
                    code: httpResponse.BAD_REQUEST.CODE,
                    status: false,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    data: null
                }
            }

            const user = await userService.getUserById(userId);
            if (user === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    status: false,
                }
            }
            else if (user.length == 0) {
                return {
                    code: httpResponse.NOT_FOUND.CODE,
                    message: httpResponse.NOT_FOUND.MESSAGE + ` : Can't find user with id ${userId}`,
                    status: false,
                }
            }

            const vouchers = await vouchersService.getAllVouchers();

            const filterVoucher = vouchers.data.filter((voucher) => {
                if (voucher.min_point <= user.point) {
                    return voucher
                }
            })

            return {
                code: httpResponse.OK.CODE,
                message: httpResponse.OK.MESSAGE,
                status: true,
                data: filterVoucher,
                user: user
            }
        },
    },

    Mutation: {
        createVouchers: async (root: Vouchers, args: any, context) => {
            const { data } = args;
            if (data === undefined
                || data.description === undefined
                || data.start_time === undefined
                || data.end_time === undefined
                || data.quantity === undefined
                || data.min_point === undefined
                || data.min_order === undefined
                || data.max_discount === undefined
                || data.sale_percent === undefined
                || data.type === undefined
                || data.bonus_decrease === undefined) {
                return {
                    code: httpResponse.BAD_REQUEST.CODE,
                    status: false,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    data: null

                }
            }

            if (data.description === null || data.description === "") {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : descript must be not empty`,
                    status: false,
                }
            }

            if (data.start_time === null || !Number.isInteger(data.start_time) || data.start_time <= Date.now()) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : start time of voucher must be epoch format and start after current time`,
                    status: false,
                }
            }

            if (data.end_time === null || !Number.isInteger(data.end_time) || data.end_time <= data.start_time) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : end time of voucher must be epoch format and start after end time`,
                    status: false,
                }
            }

            if (data.quantity === null || !Number.isInteger(data.quantity) || data.quantity <= 0) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : quantity must be a number lagger than zero`,
                    status: false,
                }
            }

            if (data.min_point === null || !Number.isInteger(data.min_point) || data.min_point <= 0) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : point limit user must be a number lagger than zero`,
                    status: false,
                }
            }

            if (data.min_order === null || !Number.isInteger(data.min_order) || data.min_order <= 0) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : order limit value must be a number lagger than zero`,
                    status: false,
                }
            }

            if (data.max_discount === null || !Number.isInteger(data.max_discount) || data.max_discount <= 0) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : max discount must be a number lagger than zero`,
                    status: false,
                }
            }

            if (data.sale_percent === null || !Number.isInteger(data.sale_percent) || data.sale_percent <= 0 || data.sale_percent >= 100) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : sale percent must be a number range [0,100]`,
                    status: false,
                }
            }

            if (data.bonus_decrease === null || !Number.isInteger(data.bonus_decrease) || data.bonus_decrease <= 0) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : bonus decrease must be a number lagger than 0`,
                    status: false,
                }
            }

            if (data.type === null || (data.type != "ORDER" && data.type != "SHIPPING")) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : type must be ORDER or SHIPPING`,
                    status: false,
                }
            }

            const newVoucher = await vouchersService.createVouchers(data);
            if (newVoucher === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : can't create`,
                    status: false,
                }
            }

            return {
                code: httpResponse.OK.CODE,
                message: httpResponse.OK.MESSAGE,
                status: true,
                data: newVoucher
            }
        },

        updateVouchers: async (root: Vouchers, args: any, context) => {
            const { _id, data } = args;

            if (data === undefined
                || _id === undefined
                || data.description === undefined
                || data.start_time === undefined
                || data.end_time === undefined
                || data.quantity === undefined
                || data.min_point === undefined
                || data.min_order === undefined
                || data.max_discount === undefined
                || data.sale_percent === undefined
                || data.type === undefined
                || data.bonus_decrease === undefined) {
                return {
                    code: httpResponse.BAD_REQUEST.CODE,
                    status: false,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    data: null

                }
            }

            if (data.description === null || data.description === "") {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : descript must be not empty`,
                    status: false,
                }
            }

            if (data.start_time === null || !Number.isInteger(data.start_time) || data.start_time <= Date.now()) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : start time of voucher must be epoch format and start after current time`,
                    status: false,
                }
            }

            if (data.end_time === null || !Number.isInteger(data.end_time) || data.end_time <= data.start_time) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : end time of voucher must be epoch format and start after end time`,
                    status: false,
                }
            }

            if (data.quantity === null || !Number.isInteger(data.quantity) || data.quantity <= 0) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : quantity must be a number lagger than zero`,
                    status: false,
                }
            }

            if (data.min_point === null || !Number.isInteger(data.min_point) || data.min_point <= 0) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : point limit user must be a number lagger than zero`,
                    status: false,
                }
            }

            if (data.min_order === null || !Number.isInteger(data.min_order) || data.min_order <= 0) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : order limit value must be a number lagger than zero`,
                    status: false,
                }
            }

            if (data.max_discount === null || !Number.isInteger(data.max_discount) || data.max_discount <= 0) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : max discount must be a number lagger than zero`,
                    status: false,
                }
            }

            if (data.sale_percent === null || !Number.isInteger(data.sale_percent) || data.sale_percent <= 0 || data.sale_percent >= 100) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : sale percent must be a number range [0,100]`,
                    status: false,
                }
            }

            if (data.bonus_decrease === null || !Number.isInteger(data.bonus_decrease) || data.bonus_decrease <= 0) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : bonus decrease must be a number lagger than 0`,
                    status: false,
                }
            }

            if (data.type === null || (data.type != "ORDER" && data.type != "SHIPPING")) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : type must be ORDER or SHIPPING`,
                    status: false,
                }
            }
            const voucher = await vouchersService.getById(_id);
            if (voucher === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    status: false,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    data: null
                }
            }
            else if (voucher.length == 0) {
                return {
                    code: httpResponse.NOT_FOUND.CODE,
                    status: false,
                    message: httpResponse.NOT_FOUND.MESSAGE + ` : Can't find voucher have id = ${_id}`,
                    data: null
                }
            }
            else if (Date.now() >= voucher.start_time) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    status: false,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + " voucher has started or ended",
                    data: null
                }
            }

            const newVoucher = await vouchersService.updateVouchers(_id, data);

            if (newVoucher === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    status: false,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    data: null
                }
            }
            return {
                code: httpResponse.OK.CODE,
                status: false,
                message: httpResponse.OK.MESSAGE,
                data: newVoucher
            }
        },

        deleteVouchers: async (root: Vouchers, args: any, context) => {
            const { _id } = args;
            if (_id === undefined) {
                return {
                    code: httpResponse.BAD_REQUEST.CODE,
                    status: false,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    data: null

                }
            }

            const voucher = await vouchersService.getById(_id);
            if (voucher === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    status: false,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    data: null
                }
            }
            else if (voucher.length == 0) {
                return {
                    code: httpResponse.NOT_FOUND.CODE,
                    status: false,
                    message: httpResponse.NOT_FOUND.MESSAGE + ` : Can't find voucher have id = ${_id}`,
                    data: null
                }
            }
            else {
                const current_time = Date.now();
                if (current_time >= voucher.start_time && current_time <= voucher.end_time) {
                    return {
                        code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                        status: false,
                        message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + " voucher only can delete before start time or after end time",
                        data: null
                    }
                }
            }

            const newVoucher = await vouchersService.deleteVouchers(_id);

            if (newVoucher === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    status: false,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    data: null
                }
            }
            return {
                code: httpResponse.OK.CODE,
                status: true,
                message: httpResponse.OK.MESSAGE,
                data: newVoucher
            }
        }
    },
}