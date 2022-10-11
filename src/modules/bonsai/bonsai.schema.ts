import { gql } from "apollo-server"
import { BaseDocument } from "../../base/baseModel"

declare global {
    type Bonsai = BaseDocument & {
        _id?: string,
        categoryId: string,
        name: string,
        quantity: number,
        description: string,
        country: string,
        bonus_point:number,
    }
}

export default gql`
    # TYPE
    type Bonsai {
        _id: ID
        categoryId:ID
        
        name: String
        quantity: Int
        description: String
        country: String
        bonus_point:Float
        
        category:Category
        
        createdAt: Float
        updatedAt: Float
    }

        type Result {
        code: String
        status: String
        mesage: String
        data: Bonsai
    }

    #ROOT TYPE
    type Query {
        getAllBonsai(q: QueryInput): BonsaiPageData
        getOneBonsai(_id: ID!): Result
    }

    type BonsaiPageData {
        data: [Bonsai]
        pagination: Pagination
    }

    type Mutation {
        createBonsai(data: CreateBonsaiInput): Result
        updateBonsai(_id: ID!, data: UpdateBonsaiInput): Result
        deleteBonsai(_id: ID!): Result
    }

    # INPUT
    input CreateBonsaiInput {
        categoryId:ID
        name: String
        quantity: Int
        description: String
        country: String
        bonus_point:Float
    }

    input UpdateBonsaiInput {
        categoryId:ID
        name: String
        quantity: Int
        description: String
        country: String
        bonus_point:Float
    }
`