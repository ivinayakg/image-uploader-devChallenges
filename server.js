require("express-async-errors");
const cloudResourcePath = "devChallenges/uploadImage/";

const express = require("express");
const app = express();
const axios = require("axios");

const multer = require("multer");
const storage = multer.memoryStorage();
const uploader = multer({ storage });
const uploadeImage = require("./uploadImage");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", express.static("public"));
app.use("/files", express.static("upload"));

app.post("/upload", uploader.single("file"), async (req, res) => {
  const file = req.file.buffer;
  try {
    const uploadedFile = await uploadeImage(file, cloudResourcePath);
    return res.status(200).json({
      success: true,
      data: { uploadedFileurl: uploadedFile.secure_url },
    });
  } catch (error) {
    return res.status(404).json({ success: false, error });
  }
});

app.get("/upload", async (req, res) => {
  try {
    const cloudFiles = await axios.get(
      `https://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}@api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/resources/image`
    );
    const projectFiles = cloudFiles.data.resources
      .filter((image) => {
        return image.folder.includes("devChallenges/uploadImage");
      })
      .map((image) => image.secure_url);

    return res
      .status(200)
      .json({ success: true, data: { files: projectFiles } });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something Went Wrong", error });
    console.log(error);
  }

  return res.status(200).json({ success: true });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Your app is successfully running at ${port}`);
});
