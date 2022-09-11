import { gql } from "apollo-server"
import { BaseDocument } from "../../base/baseModel"

declare global {
    type Product = BaseDocument & {
        _id?: string,
        name?: string,
    }
}

export default gql`
    # TYPE
    type Product {
        _id: ID
        name: String

        createdAt: Float
        updatedAt: Float
    }

    #ROOT TYPE
    type Query {
        getAllProduct(q: QueryInput): ProductPageData
        getOneProduct(_id: ID!): Product
    }

    type ProductPageData {
        data: [Product]
        pagination: Pagination
    }

    type Mutation {
        createProduct(data: CreateProductInput): Product
        updateProduct(_id: ID!, data: UpdateProductInput): Product
        deleteProduct(_id: ID!): Product
    }

    # INPUT
    input CreateProductInput {
        name: String!
    }

    input UpdateProductInput {
        name: String
    }
`