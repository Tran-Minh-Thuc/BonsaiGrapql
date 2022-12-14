import * as usersService from "./users.service";
//import { testLoader } from "../test/test.model";
import { GraphqlResolver } from "../../helper/graphql/resolver";
import { StatusCodes } from 'http-status-codes';
import {httpResponse} from '../../helper/HttpResponse'
import { activeCodeRegex, emailRegex, imageRegex, passwordRegex, phoneRegex, usernameRegex } from '../../helper/regexValidation'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "process";
import { convert_vi_to_en } from "../../helper/string_handling";


export const usersResolver = {
    Query: {
        getAllUsers: async (root: Users, args: any, context) => {
            const { q } = args;
            const users = await usersService.getAllUsers(q);
            if (users === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    status: false,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    data: []
                }
            }
            return {
                code: httpResponse.OK.CODE,
                status: true,
                message:httpResponse.OK.MESSAGE,
                data: users.data,
                pagination: users.pagination
            }
        },

        getUserById: async (root: Users, args: any, context) => {
            const { _id } = args
            if(_id === undefined){
                return {
                    code: httpResponse.BAD_REQUEST.CODE,
                    status: false,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    data: null
                }
            }
            const user = await usersService.getUserById(_id);
            if (user === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    status: false,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    data: null
                }
            }
            else if (user.length == 0) {
                return {
                    code: httpResponse.NOT_FOUND.CODE,
                    status: false,
                    message: httpResponse.NOT_FOUND.MESSAGE + ` : Kh??ng th??? tim  d??ng v???i id = ${_id}`,
                    data: null
                }
            }

            return {
                code: httpResponse.OK.CODE,
                status: true,
                message: httpResponse.OK.MESSAGE,
                data: user
            }
        },
        getUserByName: async (root: Users, args: any, context) => {
            const { name } = args
            if(name === undefined){
                return {
                    code: httpResponse.BAD_REQUEST.CODE,
                    status: false,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    data: null
                }
            }
            const user = await usersService.getUserByName(name)
            if (user === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    status: false,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    data: null
                }
            }
            else if (user.length == 0) {
                return {
                    code: httpResponse.NOT_FOUND.CODE,
                    status: false,
                    message: httpResponse.NOT_FOUND.MESSAGE+ `: Kh??ng th??? t??m ng?????i d??ng c?? t??n = ${name}`,
                    data: null
                }
            }

            return {
                code: httpResponse.OK.CODE,
                status: true,
                message: httpResponse.OK.MESSAGE,
                data: user
            }
        },
        getUserByEmail: async (root: Users, args: any, context) => {
            const { email } = args
            if(email === undefined){
                return {
                    code: httpResponse.BAD_REQUEST.CODE,
                    status: false,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    data: null
                }
            }
            const users = await usersService.getByEmail(email);

            if (users === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    status: false,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    data: null
                }
            }
            else if (users.length == 0) {
                return {
                    code: httpResponse.NOT_FOUND.CODE,
                    status: false,
                    message: httpResponse.NOT_FOUND.MESSAGE+ `: Kh??ng th??? t??m ng?????i d??ng c?? email = ${email}`,
                    data: null
                }
            }
            return {
                code: httpResponse.OK.CODE,
                status: true,
                message: httpResponse.OK.MESSAGE,
                data: users
            }

        },
        getUserByPhone: async (root: Users, args: any, context) => {
            const { phone } = args
            if(phone === undefined){
                return {
                    code: httpResponse.BAD_REQUEST.CODE,
                    status: false,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    data: null
                }
            }
            const users = await usersService.getByPhone(phone);

            if (users === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    status: false,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    data: null
                }
            }
            else if (users.length == 0) {
                return {
                    code: httpResponse.NOT_FOUND.CODE,
                    status: false,
                    message: httpResponse.NOT_FOUND.MESSAGE+ `: Kh??ng th??? t??m ng?????i d??ng c?? s??? ??i???n tho???i = ${phone}`,
                    data: null
                }
            }
            return {
                code: httpResponse.OK.CODE,
                status: true,
                message: httpResponse.OK.MESSAGE,
                data: users
            }

        },
        
    },


    Mutation: {
        login: async (root: Users, args: any, context) => {

            const { email, password, rememberMe } = args;
            if (email === undefined ||
                password === undefined ||
                rememberMe === undefined) {
                return {
                    code: httpResponse.BAD_REQUEST.CODE,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    status: false,
                }
            }

            const user = await usersService.getByEmail(email)


            //User not exists in DB
            if (user == null || user.length == 0) {
                return {
                    code: httpResponse.NOT_FOUND.CODE,
                    message: httpResponse.NOT_FOUND.MESSAGE + ": T??i kho???n kh??ng t???n t???i",
                    status: false,
                }
            }

            if (!user.isActive) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : T??i kho???n ch??a ???????c k??ch ho???t",
                    status: false,
                }
            }

            const validPassword = await bcrypt.compare(password == null ? "" :password, user.password);

            if (!validPassword) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Sai m???t kh???u",
                    status: false,
                }
            }

            const token = jwt.sign(
                {
                    userId: user._id,
                    role: user.role
                },
                process.env.PRIVATE_KEY as string,
                {
                    expiresIn: rememberMe ? '30 days' : '30m',
                }
            );

            user.password = undefined
            return {
                code: httpResponse.OK.CODE,
                message: httpResponse.OK.MESSAGE,
                status: true,
                access_token: "Bearer " + token,
                user: user

            }
        },
        sendActiveCode: async (root: Users, args: any, context) => {
            const { email } = args;
            if (email === undefined) {
                return {
                    code: httpResponse.BAD_REQUEST.CODE,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    status: false,
                }
            }

            let user = await usersService.getByEmail(email);
            if (user === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    status: false,
                }
            }
            else if(user.length == 0){
                return {
                    code: httpResponse.NOT_FOUND.CODE,
                    status: false,
                    message: httpResponse.NOT_FOUND.MESSAGE + ` : Kh??ng th??? t??m ng?????i d??ng c?? email = ${email}`,
                    data: null
                }
            }

            const code = Math.floor(Math.random() * 999999) + 100000;
            await usersService.sendActiveCode(email, code);

            user.activeCode = code;

            await usersService.updateActiveCode(user._id, code);
           
            return {
                code: httpResponse.OK.CODE,
                message: httpResponse.OK.MESSAGE,
                status: true,
                activeCode: code
            }
        },
        register: async (root: Users, args: any, context) => {
            const { user } = args;
            if (user == undefined ||
                user.email === undefined ||
                user.password === undefined ||
                user.name === undefined ||
                user.avatar === undefined ||
                user.phone === undefined ||
                user.gender === undefined) {
                return {
                    code: httpResponse.BAD_REQUEST.CODE,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    status: false,
                }
            }

            if (!emailRegex.test(user.email)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : ?????nh d???ng email ph???i l?? abc@xyz.com",
                    status: false,
                }
            }

            const existsUser = await usersService.getByEmail(user.email)
            

            if ( existsUser!== null && existsUser.length != 0) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Email ???? ???????c s??? d???ng",
                    status: false,
                }
            }


            if (!passwordRegex.test(user.password)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " :M???t kh???u ph???i ch???a ??t nh???t 8 k?? t??? bao g???m { 1 s???, 1 ch??? in hoa,1 ch??? th?????ng,1 k?? t??? ?????c bi???t}",
                    status: false,
                }
            }

            if (!usernameRegex.test(convert_vi_to_en(user.name))) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : T??n ng?????i d??ng kh??ng ch???a ch??? s???",
                    status: false,
                }
            }

            if (!imageRegex.test(user.avatar)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : ???nh ?????i di???n ch??? h??? tr??? (jpg|jpeg|png|svg)",
                    status: false,
                }
            }



            if (!phoneRegex.test(user.phone)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : S??? ??i???n tho???i ph???i c?? 10-12 s??? v?? s??? ?????u ti??n l?? 0",
                    status: false,
                }
            }

            const existsUserPhone = await usersService.getByPhone(user.phone);

            if (existsUserPhone !== null && existsUserPhone.length != 0) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : S??? ??i???n tho???i ???? ???????c s??? d???ng",
                    status: false,
                }
            }

            if (user.gender === "" || (user.gender !== "Nam" && user.gender !== "N???" && user.gender !== "Hide")) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Gi???i t??nh ph???i l?? 'Nam' ho???c 'N???'",
                    status: false,
                }
            }

            user.password = await bcrypt.hashSync(user.password,10);
            const newUser : Users = {
                ...user, 
                ...{
                    point: 0,
                    role: "USER_ROLE",
                    isActive: false,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                }
            }

            const createUser = await usersService.createUsers(newUser);
            createUser.password = undefined

            if (createUser === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + " : T???o th???t b???i [user.service error]",
                    status: false,
                };
            }

            return {
                code: httpResponse.OK.CODE,
                message: httpResponse.OK.MESSAGE,
                status: true,
                data: createUser
            };
        },
        updateUserById: async (root: Users, args: any, context)=>{
            const {_id,user} = args


            if(_id === undefined || 
                user === undefined ||
                user.name === undefined ||
                user.email === undefined ||
                user.avatar === undefined ||
                user.phone === undefined ||
                user.gender === undefined ||
                user.point === undefined){
                    return {
                        code: httpResponse.BAD_REQUEST.CODE,
                        message: httpResponse.BAD_REQUEST.MESSAGE,
                        status: false
                    };
                }
            
            const userDB = await usersService.getUserById(_id);

            if(userDB === null || userDB.length == 0){
                return {
                    code: httpResponse.NOT_FOUND.CODE,
                    message: httpResponse.NOT_FOUND.MESSAGE,
                    status: false,
                    data: null
                };
            }

            if (!emailRegex.test(user.email)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Email ph???i c?? d???ng abc@xyz.com",
                    status: false,
                }
            }

            // email
            const userByEMail = await usersService.getByEmail(user.email);

            if(userByEMail !== null && userByEMail.length !=0 && !userByEMail._id.equals(_id)){
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Email ???? ???????c s??? d???ng",
                    status: false,
                }
            }

            //name
            if (!usernameRegex.test(convert_vi_to_en(user.name))) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : T??n ng?????i d??ng kh??ng ???????c ch???a k?? t??? s???",
                    status: false,
                }
            }
            //avatar
            if (!imageRegex.test(user.avatar)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : ???nh ?????i di???n ch??? h??? tr??? (jpg|jpeg|png|svg)",
                    status: false,
                }
            }


            //phone
            if (!phoneRegex.test(user.phone)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : S??? ??i???n tho???i ph???i c?? 10-12 s??? v?? s??? ?????u ti??n l?? 0",
                    status: false,
                }
            }

            const existsUserPhone = await usersService.getByPhone(user.phone);

            if (existsUserPhone !== null && existsUserPhone.length != 0 && !existsUserPhone._id.equals(_id)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : S??? ??i???n tho???i ???? ???????c s??? d???ng",
                    status: false,
                }
            }

            //Gender
            if (user.gender === "" || (user.gender !== "Nam" && user.gender !== "N???")) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Gi???i t??nh ph???i l?? Nam ho???c N???",
                    status: false,
                }
            }

            
            const updateUser = await usersService.updateUsers(_id,user);

            if (updateUser === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + " : C???p nh???t kh??ng th??nh c??ng [L???i h??? th???ng]",
                    status: false,
                };
            }

            return {
                code: httpResponse.OK.CODE,
                message: httpResponse.OK.MESSAGE,
                status: true,
                data: updateUser
            };
        },
        activeByIdAndCode: async (root: Users, args: any, context)=>{
            const { _id, code } = args;
            if (_id === undefined || code === undefined) {
                return {
                    code: httpResponse.BAD_REQUEST.CODE,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    status: false,
                }
            }

            if (!activeCodeRegex.test(code)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : OTP ph???i c?? 6 k?? t???",
                    status: false,
                }
            }

            const user = await usersService.getUserById(_id);
            if(user === null){
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    status: false,
                }
            }
            else if(user.length == 0){
                return {
                    code: httpResponse.NOT_FOUND.CODE,
                    message: httpResponse.NOT_FOUND.MESSAGE + ` : Kh??ng th??? t??m ng?????i d??ng c?? id ${_id}`,
                    status: false,
                }
            }
            else if(user.isActive){
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + ` : Ng?????i d??ng c?? id = ${_id} ???? ???????c k??ch ho???t tr?????c ????`,
                    status: false,
                }
            }
            else if(code != user.activeCode){
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + ` : OTP kh??ng ch??nh x??c`,
                    status: false,
                }
            }

            const activeReuslt = await usersService.activeUser(_id,code)
            if(!activeReuslt){
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : Kh??ng th??? k??ch ho???t [L???i h??? th???ng]`,
                    status: false,
                }
            } 

            //createCart
            
            return {
                code: httpResponse.OK.CODE,
                message: httpResponse.OK.MESSAGE,
                status: true,
                data:activeReuslt
            }
        },
        updateUserPassword: async (root: Users, args: any, context)=>{
            const { _id, password } = args;
            if (_id === undefined || password === undefined) {
                return {
                    code: httpResponse.BAD_REQUEST.CODE,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    status: false,
                }
            }

            if (!passwordRegex.test(password)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : M???t kh???u ph???i ch???a ??t nh???t 8 k?? t??? bao g???m: 1 s???, 1 ch??? in hoa,1 ch??? th?????ng,1 k?? t??? ?????c bi???t",
                    status: false,
                }
            }

            const user = await usersService.getUserById(_id);
            if(user === null){
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    status: false,
                }
            }
            else if(user.length == 0){
                return {
                    code: httpResponse.NOT_FOUND.CODE,
                    message: httpResponse.NOT_FOUND.MESSAGE + ` : Kh??ng th??? t??m ng?????i d??ng c?? id ${_id}`,
                    status: false,
                }
            }
            const cmpPassword = await bcrypt.compare(password == null ? "" :password, user.password);
           if(cmpPassword){
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + ` : M???t kh???u m???i tr??ng v???i m???t kh???u hi???n t???i`,
                    status: false,
                }
            }

            const bcryptPassword = await bcrypt.hashSync(password,10);

            const changePassword = await usersService.changePassword(_id,bcryptPassword)
            if(!changePassword){
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : Kh??ng th??? thay ?????i m???t kh???u [L???i h??? th???ng] ${_id}`,
                    status: false,
                }
            } 

            return {
                code: httpResponse.OK.CODE,
                message: httpResponse.OK.MESSAGE,
                status: true,
                data:changePassword
            }
        },
        deleteUserById: async (root: Users, args: any, context)=>{
            const {_id} = args
            if(_id == undefined){
                return {
                    code: httpResponse.BAD_REQUEST.CODE,
                    message: httpResponse.BAD_REQUEST.MESSAGE,
                    status: false,
                }
            }

            const user = await usersService.getUserById(_id);

            if(user === null){
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE,
                    status: false,
                }
            }
            else if(user.length == 0){
                return {
                    code: httpResponse.NOT_FOUND.CODE,
                    message: httpResponse.NOT_FOUND.MESSAGE + ` : Kh??ng th??? t??m ng?????i d??ng c?? id = ${_id}`,
                    status: false,
                }
            }

            const deleteResult = await usersService.deleteUsers(_id);

            if(!deleteResult){
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : Kh??ng th??? xo?? ng?????i d??ng c?? id = ${_id}`,
                    status: false,
                }
            } 

            return {
                code: httpResponse.OK.CODE,
                message: httpResponse.OK.MESSAGE,
                status: true,
                data:deleteResult
            }
        },
        
        // base: async (root: Users, args: any, context)=>{

        // },
    },
}