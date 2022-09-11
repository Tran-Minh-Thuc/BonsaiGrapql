import { gql } from "apollo-server"
import { BaseDocument } from "../../base/baseModel"

declare global {
    type Boss = BaseDocument & {
        _id?: string,
        name?: string,
    }
}

export default gql`
    # TYPE
    type Boss {
        _id: ID
        name: String

        createdAt: Float
        updatedAt: Float
    }

    #ROOT TYPE
    type Query {
        getAllBoss(q: QueryInput): BossPageData
        getOneBoss(_id: ID!): Boss
    }

    type BossPageData {
        data: [Boss]
        pagination: Pagination
    }

    type Mutation {
        createBoss(data: CreateBossInput): Boss
        updateBoss(_id: ID!, data: UpdateBossInput): Boss
        deleteBoss(_id: ID!): Boss
    }

    # INPUT
    input CreateBossInput {
        name: String!
    }

    input UpdateBossInput {
        name: String
    }
`