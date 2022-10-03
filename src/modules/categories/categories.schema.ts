import { gql } from "apollo-server"
import { BaseDocument } from "../../base/baseModel"

declare global {
    type Categories = BaseDocument & {
        _id?: string,
        name: string,
        description:String
    }
}

export default gql`
    # TYPE
    type Categories {
        _id: ID
        name: String
        description: String
        createdAt: Float
        updatedAt: Float
    }

    type ResultResponce {
        code: String
        status: String
        message: String
        data: Categories
    }

    type ResultResponceMany {
        code: String
        status: String
        message: String
        data: [Categories]
        pagination : Pagination
    }

    #ROOT TYPE
    type Query {
        getAllCategories(q: QueryInput): ResultResponceMany
        getOneCategories(_id: ID!): ResultResponce
    }


    # INPUT
`