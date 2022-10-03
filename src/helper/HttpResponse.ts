import { StatusCodes } from 'http-status-codes';

export const httpResponse = {
    BAD_REQUEST:{
        CODE :     StatusCodes.BAD_REQUEST,
        MESSAGE: "BAD_REQUEST"
    },
    INTERNAL_SERVER_ERROR:{
        CODE :     StatusCodes.INTERNAL_SERVER_ERROR,
        MESSAGE: "INTERNAL_SERVER_ERROR"
    },
    OK:{
        CODE :     StatusCodes.OK,
        MESSAGE: "SUCCESS"
    },
    NOT_FOUND:{
        CODE :     StatusCodes.NOT_FOUND,
        MESSAGE: "NOT_FOUND"
    },
    FORBIDDEN:{
        CODE :     StatusCodes.FORBIDDEN,
        MESSAGE: "FORBIDDEN"
    }
}