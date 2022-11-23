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

    type File {
        #filename: String!
        #mimetype: String!
        #encoding: String!
        url : String
      }
    
  

    #ROOT TYPE

    type Mutation {
        uploadFile(file: Upload!): File!
    }
`