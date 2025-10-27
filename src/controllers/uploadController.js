const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.uploadImage = async (req, res) => {
  try {
    // file uploaded via multer
    const filePath = req.file.path;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "profile_photos",
      resource_type: "image",
    });

    // Remove local temp file
    fs.unlinkSync(filePath);
    
    // Send Cloudinary URL
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    res.status(500).json({ message: "Image upload failed", error });
  }
};
