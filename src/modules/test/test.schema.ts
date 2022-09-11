import { gql } from "apollo-server"
import { BaseDocument } from "../../base/baseModel"

declare global {
    type Test = BaseDocument & {
        _id?: string,
        name?: string,
    }
}

export default gql`
    # TYPE
    type Test {
        _id: ID
        name: String

        createdAt: Float
        updatedAt: Float
    }

    #ROOT TYPE
    type Query {
        getAllTest(q: QueryInput): TestPageData
        getOneTest(_id: ID!): Test
    }

    type TestPageData {
        data: [Test]
        pagination: Pagination
    }

    type Mutation {
        createTest(data: CreateTestInput): Test
        updateTest(_id: ID!, data: UpdateTestInput): Test
        deleteTest(_id: ID!): Test
    }

    # INPUT
    input CreateTestInput {
        name: String!
    }

    input UpdateTestInput {
        name: String
    }
`