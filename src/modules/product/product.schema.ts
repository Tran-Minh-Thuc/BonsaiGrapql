import { gql } from "apollo-server"
import { BaseDocument } from "../../base/baseModel"

declare global {
    type Product = BaseDocument & {
        _id?: string,
        testId?: string,
        name?: string,
    }
}

export default gql`
    # TYPE
    type Product {
        _id: ID
        testId: ID
        name: String

        test:Test
        createdAt: Float
        updatedAt: Float
    }
    type Result {
        code: String
        status: String
        mesage: String
        data: Product
    }

    #ROOT TYPE
    type Query {
        getAllProduct(q: QueryInput): ProductPageData
        getOneProduct(_id: ID!): Result
    }

    type ProductPageData {
        data: [Product]
        pagination: Pagination
    }

    type Mutation {
        createProduct(data: CreateProductInput): Result
        updateProduct(_id: ID!, data: UpdateProductInput): Result
        deleteProduct(_id: ID!): Result
    }

    # INPUT
    input CreateProductInput {
        name: String!
    }

    input UpdateProductInput {
        name: String
    }
`