//import { testLoader } from "../test/test.model";
import { GraphqlResolver } from "../../helper/graphql/resolver";
import path from 'path'
import fs from 'fs'

export const ggdriveResolver = {
  Mutation: {

    uploadFile: async (parent, { file }) => {
      try {

        const { createReadStream, filename, mimetype, encoding } = await file;
        
      const stream = createReadStream();
      const path_name = path.join(__dirname, `/public/image/${filename}`)
      await stream.pipe(fs.createWriteStream(path_name))

      return {
        url : `http://localhost:4000/images/${filename}`
      }  
      } catch (error) {
        return {
          url : error.message
        }
      }
      
    },


  },
}