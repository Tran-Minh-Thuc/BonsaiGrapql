import { gql } from "apollo-server"
import { BaseDocument } from "../../base/baseModel"

declare global {
    type ModeItemData = {
        _id?: string,
        sku: string,
        stock: number,
        price?: number
    }
    type ModelItem = {
        _id?: string,
        name: string,
        values: string[],

    }
    type Model = BaseDocument & {
        _id?: string,
        bonsaiId: string,
        items?: ModelItem[],
        data?: ModeItemData[]
    }
}

export default gql`
    # TYPE
    type Model {
        _id: ID
        bonsaiId: ID
        items: [ModelItem]
        data: [ModelItemData]

        bonsai:Bonsai
        # createdAt: Float
        # updatedAt: Float
    }
    type ModelItem {
        _id: ID
        name: String
        values: [String]
        images: [String]
    }

    type ModelItemData {
        _id: ID
        stock: Int
        price: Float
        sku: String
        index: [Int]
    }

    #ROOT TYPE
    type Query {
        getAllModel(q: QueryInput): ModelPageData
        getOneModel(_id: ID!): Model
        getModelByBonsaiId(_id: ID!): [Model]
    }

    type ModelPageData {
        data: [Model]
        pagination: Pagination
    }

    type Mutation {
        createModel(data: CreateModelInput): Model
        updateModel(_id: ID!, data: UpdateModelInput): Model
        deleteModel(_id: ID!): Model
    }

    # INPUT
    input CreateModelInput {
        bonsaiId: ID
        models: [ModelItemInput]
        data: [ModelItemDataInput]
    }
    input ModelItemInput {
        name: String
        values: [String]
    }

    input ModelItemDataInput {
        stock: Int
        price: Float
        index: [Int]
    }

    input UpdateModelInput {
        bonsaiId: ID
        title: String
        modelItem: [ModelItemInput]
    }
`