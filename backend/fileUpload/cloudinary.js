import {v2 as cloudinary} from "cloudinary";
import fs from "fs"

cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

export const uploadCloudanary = async (localFilePath)=>{
        try {
            if (!localFilePath) return;
                
            // upload the file---------------
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            console.log("file is uploaded on cloudanary",response.url);
            return response;
            
        } catch (error) {
            fs.unlinkSync(localFilePath)//remove the temporary file
            console.error("Cloudinary upload error:", error);
        }
    }