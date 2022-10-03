import { gql } from "apollo-server"
import { BaseDocument } from "../../base/baseModel"

declare global {
    type Users = BaseDocument & {
        _id?: String,
        name: String,
        email: String,
        password:String,
        avatar:String,
        address:String,
        phone:String,
        gender:String,
        point: Number,
        role: String,
        isActive:Boolean,
        activeCode : Number
    }
}

export default gql`
    # TYPE
    type Users {
        _id: ID
        name: String,
        email: String
        password:String
        avatar:String
        address:String
        phone:String
        gender:String
        point: Int
        role: String
        isActive:Boolean
        activeCode : Int
        createdAt: Float
        updatedAt: Float
    }

    

    #ROOT TYPE
    type Query {
        getAllUsers(q: QueryInput): ResultUsers
        getById(_id:ID): ResultResponse
        getByName(name:String): ResultUsers
        getByEmail(email: String): ResultResponse
        getByPhone(phone: String): ResultResponse
    }

   
    type ResultResponse {
        code: Int
        status: Boolean
        message: String
        data: Users
    }

    type ResultUsers {
        code: Int
        status: Boolean
        message:String
        data: [Users]
        pagination: Pagination
    }

    type UsersPageData {
        data: [Users]
        pagination: Pagination
    }

    type LoginResponse{
        code: String!
        status: Boolean!
        message: String!
        access_token : String
        user:Users
    }

    scalar Upload

    type Mutation {
        login(email:String,password:String,rememberMe:Boolean) : LoginResponse
        sendActiveCode(email:String) : SendCodeResponse
        register(user:registerInput) : ResultResponse
        updateById(_id:ID,user:userInput) : ResultResponse
        activeByIdAndCode(_id:ID,code:String) : ResultResponse
        updatePassword(_id:ID,password:String) : ResultResponse
        deleteById(_id:ID): ResultResponse
        uploadImageById(file: Upload): ResultResponse
    }

    # INPUT
    input userInput{
        name:String
        email:String
                
        avatar:String
        phone:String
        gender:String
        point:Int
    }

    input registerInput{
        email:String
        password:String
        name:String
        avatar:String
        phone:String
        gender:String
    }

    input CreateUsersInput {
        name: String!
    }

    input UpdateUsersInput {
        name: String
    }

    type SendCodeResponse {
        code: String!
        status: Boolean!
        message: String!
        activeCode : Int
    }
`