import { gql } from "apollo-server"
import { BaseDocument } from "../../base/baseModel"

declare global {
    type Category = BaseDocument & {
        _id?: string,
        name?: string,
        description?: string,
        // priority?:boolean,r
        // image?: string,
    }
}

export default gql`
    type Category {
        _id: ID
        #----------
        name: String
        description: String
        # priority:Boolean
        # image: String
        # getCountShopByCategory(_id: ID): Int

        updatedAt: Float   
    }

    #ROOT TYPE
    type Query{
        getAllCategory(q:QueryInput): CategoryPageData
        getOneCategory(_id: ID!): Category
    }

    type CategoryPageData {
        data: [Category]
        pagination: Pagination
    }

    type Mutation {
        createCategory(data: CreateCategoryInput): Category
        updateCategory(_id: ID!, data: UpdateCategoryInput): Category
        deleteCategory(_id: ID!): Boolean
    }

    # INPUT
    input CreateCategoryInput{
        name: String!
        description: String
        # priority:Boolean
        # image: String
    }

    input UpdateCategoryInput{
        name: String
        description: String
        # priority:Boolean
        # image: String
    }
`
