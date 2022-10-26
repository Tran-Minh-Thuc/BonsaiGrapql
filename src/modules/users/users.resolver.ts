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
                    message: httpResponse.NOT_FOUND.MESSAGE + ` : Can't find user have id = ${_id}`,
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
                    message: httpResponse.NOT_FOUND.MESSAGE+ `: Can't find user have name = ${name}`,
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
                    message: httpResponse.NOT_FOUND.MESSAGE+ `: Can't find user have email = ${email}`,
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
                    message: httpResponse.NOT_FOUND.MESSAGE+ `: Can't find user have phone = ${phone}`,
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
                    message: httpResponse.NOT_FOUND.MESSAGE,
                    status: false,
                }
            }

            if (!user.isActive) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Account not active",
                    status: false,
                }
            }

            const validPassword = await bcrypt.compare(password == null ? "" :password, user.password);

            if (!validPassword) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Wrong password",
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
                    message: httpResponse.NOT_FOUND.MESSAGE + ` : Can't find user match with email = ${email}`,
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
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Email must be format abc@xyz.com",
                    status: false,
                }
            }

            const existsUser = await usersService.getByEmail(user.email)
            

            if ( existsUser!== null && existsUser.length != 0) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Email already used",
                    status: false,
                }
            }


            if (!passwordRegex.test(user.password)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Password containing at least 8 characters, 1 number, 1 upper, 1 lowercase and 1 special character",
                    status: false,
                }
            }

            if (!usernameRegex.test(convert_vi_to_en(user.name))) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Username not contains character or number",
                    status: false,
                }
            }

            if (!imageRegex.test(user.avatar)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Avatar only support (jpg|jpeg|png|svg)",
                    status: false,
                }
            }



            if (!phoneRegex.test(user.phone)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Phone number must have 10 to 12 number and first number is zero",
                    status: false,
                }
            }

            const existsUserPhone = await usersService.getByPhone(user.phone);

            if (existsUserPhone !== null && existsUserPhone.length != 0) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Phone number already used",
                    status: false,
                }
            }

            if (user.gender === "" || (user.gender !== "Male" && user.gender !== "Female" && user.gender !== "Hide")) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Gender must be 'Male' or 'Female' or 'Hide'",
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
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + " : Fail create new user [user.service error]",
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
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Email must be format abc@xyz.com",
                    status: false,
                }
            }

            // email
            const userByEMail = await usersService.getByEmail(user.email);

            if(userByEMail !== null && userByEMail.length !=0 && !userByEMail._id.equals(_id)){
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Email have used",
                    status: false,
                }
            }

            //name
            if (!usernameRegex.test(convert_vi_to_en(user.name))) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Username must contains character or number",
                    status: false,
                }
            }
            //avatar
            if (!imageRegex.test(user.avatar)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Avatar only support (jpg|jpeg|png|svg)",
                    status: false,
                }
            }


            //phone
            if (!phoneRegex.test(user.phone)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Phone number must have 10 to 12 number and first number is zero",
                    status: false,
                }
            }

            const existsUserPhone = await usersService.getByPhone(user.phone);

            if (existsUserPhone !== null && existsUserPhone.length != 0 && !existsUserPhone._id.equals(_id)) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Phone number already used by another user",
                    status: false,
                }
            }

            //Gender
            if (user.gender === "" || (user.gender !== "Male" && user.gender !== "Female" && user.gender !== "Hide")) {
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Gender must be 'Male' or 'Female' or 'Hide'",
                    status: false,
                }
            }

            //Point
            if(user.point === null || !Number.isInteger(user.point) || user.point < 0){
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Point must be 'positive number'",
                    status: false,
                }
            }
            const updateUser = await usersService.updateUsers(_id,user);

            if (updateUser === null) {
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + " : Fail update user",
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
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Code s a number and have 6 character",
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
                    message: httpResponse.NOT_FOUND.MESSAGE + ` : Can't find user with id ${_id}`,
                    status: false,
                }
            }
            else if(user.isActive){
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + ` : User ${_id} have already actived`,
                    status: false,
                }
            }
            else if(code != user.activeCode){
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + ` : code not exactly`,
                    status: false,
                }
            }

            const activeReuslt = await usersService.activeUser(_id,code)
            if(!activeReuslt){
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : Can't active ${_id}`,
                    status: false,
                }
            } 

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
                    message: httpResponse.FORBIDDEN.MESSAGE + " : Password containing at least 8 characters, 1 number, 1 upper, 1 lowercase and 1 special character",
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
                    message: httpResponse.NOT_FOUND.MESSAGE + ` : Can't find user with id ${_id}`,
                    status: false,
                }
            }
            const cmpPassword = await bcrypt.compare(password == null ? "" :password, user.password);
           if(cmpPassword){
                return {
                    code: httpResponse.FORBIDDEN.CODE,
                    message: httpResponse.FORBIDDEN.MESSAGE + ` : The new password is the same as the current password`,
                    status: false,
                }
            }

            const bcryptPassword = await bcrypt.hashSync(password,10);

            const changePassword = await usersService.changePassword(_id,bcryptPassword)
            if(!changePassword){
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : Can't change password ${_id}`,
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
                    message: httpResponse.NOT_FOUND.MESSAGE + ` : Can't find user with id ${_id}`,
                    status: false,
                }
            }

            const deleteResult = await usersService.deleteUsers(_id);

            if(!deleteResult){
                return {
                    code: httpResponse.INTERNAL_SERVER_ERROR.CODE,
                    message: httpResponse.INTERNAL_SERVER_ERROR.MESSAGE + ` : Can't delete user with id ${_id}`,
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
        uploadImageById: async (root: Users, args: any, context)=>{
            console.log(args);
        },
        // base: async (root: Users, args: any, context)=>{

        // },
    },
}