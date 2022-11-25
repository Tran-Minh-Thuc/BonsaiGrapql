import { gql } from "apollo-server"
import { BaseDocument } from "../../base/baseModel"



export default gql`
    
    type uploadResponse{
        contentLink:String
        driveLink: String
        message: String
    }

    type Mutation {
       uploadFile(file : Upload): uploadResponse
    }
`