import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: "dfos8wwny",
  api_key: "671991446811879",
  api_secret: "eVt9l7QxCZlee8QNkNTCWWp2fDY",
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    console.log("localFilepath", localFilePath)
    if (!localFilePath) {
      console.log("uploadOnCloudinary: File path is missing");
      return null;
    }
    const uploadResult = await cloudinary.uploader.upload(localFilePath,{
        resource_type: "auto",
    })

    if (!uploadResult || !uploadResult.secure_url) {
      console.error("Cloudinary upload failed:", uploadResult);
      return null;
    }

    fs.unlinkSync(localFilePath);
    return uploadResult;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    fs.unlinkSync(localFilePath);
  }
};
