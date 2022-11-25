//import { testLoader } from "../test/test.model";
import { google } from 'googleapis'
import { parse } from "path"; // This is node built in package


export const uploadfileResolver = {

    Mutation: {
        uploadFile: async (root, args: any, context) => {
            try {

                const { createReadStream, filename } = await args.file.file;
                const stream = createReadStream();
                var { ext, name } = parse(filename);

                const random_name = `bonsai_${name}-${Date.now()}${ext}`
                
                const oauth2Client = new google.auth.OAuth2(
                    process.env.CLIENT_ID,
                    process.env.CLIENT_SECRET,
                    process.env.REDIRECT_URI
                );
                
                oauth2Client.setCredentials({
                    refresh_token : process.env.REFRESH_TOKEN
                })
                
                const drive = google.drive({
                    version : "v3",
                    auth : oauth2Client
                })

                const uploadDrive = await uploadImage(random_name);
                const publicLink =  await getPublicURLGGDrive(uploadDrive.id);

                return {
                    'contentLink' : publicLink.webContentLink,
                    'driveLink' : publicLink.webViewLink,
                    'message' : "Success"
                }
                
                async function uploadImage(name){
                    const response = await drive.files.create({
                        requestBody:{
                            name:random_name,
                            mimeType: 'image/jpg',
                        },
                        media:{
                            mimeType: 'image/jpg',
                            body: stream
                        }
                    })
            
                    return response.data
                }

                async function getPublicURLGGDrive(file_id){
                    const response = await drive.permissions.create({
                        fileId : file_id,
                        requestBody:{
                            role : 'reader',
                            type: 'anyone'
                        }
                    })
            
                    const result = await drive.files.get({
                        fileId : file_id,
                        fields : 'webViewLink,webContentLink',
                    })
            
                    return (result.data)
                
                }
            } catch (error) {
                console.log(error)
                return {
                    'contentLink' : '',
                    'driveLink' : '',
                    'message' : `FAIL ${error.message}`
                }
            }
        },
    },
}