const express = require("express");
const uploadRouter = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp", "heic", "heif", "avif", "jfif"],
  },
});

const upload = multer({ storage });

// ✅ POST /upload/image
uploadRouter.post("/image", upload.single("file"), async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      url: req.file.path, // <--- URL is here, ready to be sent to the client
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

module.exports = uploadRouter;
