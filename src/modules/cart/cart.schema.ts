import { gql } from "apollo-server"
import { BaseDocument } from "../../base/baseModel"

declare global {

    type ItemCart = {
        _id?: string,
        bonsaiId: string,
        modelId: string,
        modelDataId: string,
        amount: number,
        // isChecked:boolean,
        quantity: number
        index: number[],

    }

    type Cart = BaseDocument & {
        _id?: string,
        userId?: string,
        uniqueCartItem?: number,
        itemCart?: ItemCart[]
    }
}

export default gql`
    # TYPE
    type Cart {
        _id: ID
        userId: String,
        uniqueCartItem: Int

        itemCart: [ItemCart]

        # user:User
        createdAt: Float
        updatedAt: Float
    }

    type ItemCart {
        _id: ID
        bonsaiId: ID
        modelId: ID
        modelDataId: ID
        #-------------
        amount: Float
        quantity: Int
        index: [Int]
        # isChecked: Boolean
        #-------------
        bonsa: Bonsai
        model: Model
    }

        type ResultCart {
        code: String
        status: String
        mesage: String
        data: Cart
    }

    type ResultItemCart {
        code: String
        status: String
        mesage: String
        data: ItemCart
    }

    #ROOT TYPE
    type Query {
        getAllCart(q: QueryInput): CartPageData
        getOneCart(_id: ID!): ResultCart
        getOneItemCart(_id: ID!, idItemCart:ID!): ItemCart
    }

    type CartPageData {
        data: [Cart]
        pagination: Pagination
    }

    type Mutation {
        createCart(data: CreateCartInput): ResultCart
        updateCart(_id: ID!): ResultCart
        deleteCart(_id: ID!): ResultCart
        createItemCart(_id: ID!, data: CreateItemCartInput): ResultItemCart
        updateItemCart(_id: ID!,idItemCart: ID!, data: UpdateItemCartInput): ResultItemCart
        deleteItemCart(_id: ID!, idItemCart:ID!): ResultItemCart
        DecreaseQuantityItemCart(_id: ID!, idItemCart: ID!): ResultItemCart
        IncreaseQuantityItemCart(_id: ID!, idItemCart: ID!): ResultItemCart
    }

    # INPUT

    input UpdateItemCartInput {
        quantity: Int!
        # isChecked: Boolean
    }

    input CreateItemCartInput {
        bonsaiId: ID
        modelId: ID
        modelDataId: ID
        #-------------
        amount: Float
        quantity: Int
        index: [Int]
    }

    input CreateCartInput {
        name: String!
        itemCart: [CreateItemCartInput!]!
    }

    input UpdateCartInput {
        name: String
        itemCart: [CreateItemCartInput!]
    }
`