import cloudinary from "../lib/cloudinary.js";

// Upload a base64 image to Cloudinary and return the URL
export async function uploadImage(req, res) {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    // Upload to cloudinary - it accepts base64 data URLs directly
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "pingme_profiles",
      transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
    });

    res.status(200).json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error.message);
    res.status(500).json({ message: "Image upload failed" });
  }
}
