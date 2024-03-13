 import {v2 as cloudinary} from "cloudinary";
 import fs from "fs"; //fs is a file system module
 //operation on file system are upload, read, delete, update

 cloudinary.config({ 
   cloud_name:process.env.CLOUDINARY_CLOUD_NAME , 
   api_key: process.env.CLOUDINARY_API_KEY , 
   api_secret: process.env.CLOUDINARY_API_SECRET 
 });


const UploadonCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) 
            return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploaded successfully
        console.log(`file is upload on cloudinary`,
        response.url)
        return response
        
    } catch (error) {
        //we got file in our local file, but agar vo upload nehi ho raha hai
        //tho problem hai and for cleaning purpose us file ko computer se hatadena chahiye
        //varna bahut sare malicius file and jo currupted file reh jayenge server pe
        fs.unlinkSync(localFilePath) //remove the locally saved temporary saved file as the uploas operation got failed
        return null;
    }
}

export {UploadonCloudinary}



