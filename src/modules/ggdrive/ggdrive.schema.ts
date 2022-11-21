import { gql } from "apollo-server"
import { BaseDocument } from "../../base/baseModel"

declare global {
    type Ggdrive = BaseDocument & {
        _id?: string,
        //testId?: string,
        name?: string,
    }
}

export default gql`
    # TYPE
    
    type ResultGgdrive {
        code: String
        status: String
        mesage: String
        url: String
    }

    #ROOT TYPE

    type Mutation {
        singleUpload(file: Upload!): String
    }
`