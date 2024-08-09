import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudUploader = async (localfilepath) => {
  try {
    if (!localfilepath) {
      return "error on local file path";
    }
    console.log("loaclfilepath:", localfilepath);
    
    const file = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    // console.log(file);
    
    if (!file) {
      return "there is an error while uploading the file";
    }
    console.log("file has been uploaded", file.url);
    fs.unlink(localfilepath,(err)=>console.log(err));
    return file ;
  } catch (error) {
    fs.unlink(localfilepath,(err)=>console.log(err));
    return null;
  }
};

export { cloudUploader };
