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
        role: String
        isActive:Boolean
        activeCode : Int
        createdAt: Float
        updatedAt: Float
    }

    

    #ROOT TYPE
    type Query {
        getAllUsers(q: QueryInput): ResultResponseUserMany
        getUserById(_id:ID): ResultResponseUser
        getUserByName(name:String): ResultResponseUserMany
        getUserByEmail(email: String): ResultResponseUser
        getUserByPhone(phone: String): ResultResponseUser
    }

   
    type ResultResponseUser {
        code: Int
        status: Boolean
        message: String
        data: Users
    }

    type ResultResponseUserMany {
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
        register(user:registerInput) : ResultResponseUser
        updateUserById(_id:ID,user:userInput) : ResultResponseUser
        activeByIdAndCode(_id:ID,code:String) : ResultResponseUser
        updateUserPassword(_id:ID,password:String) : ResultResponseUser
        deleteUserById(_id:ID): ResultResponseUser
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
        address:String
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