const router = require("express").Router();
const cloudinary = require('cloudinary');
const multer = require("multer");
const cloudinaryStorage = require("multer-storage-cloudinary");
const FileUpload = require('../models/file_model');

const fileUpload_obj = new FileUpload();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: process.env.CLOUDINARY_UPLOAD_FOLDER,
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
});
const parser = multer({storage: storage});
router.post('/', parser.single("image"), async (req, res) => {
    let shop_id = req.body.shop_id;
    console.log(req.file); // to see what is returned to you
    try {
        const image = {};
        image.url = req.file.url;
        image.id = req.file.public_id;

        //todo change params
        await fileUpload_obj.saveUploadUrl(image.url,shop_id);
        await res.json({
            "message": "success",
            "url": image.url
        });
    }catch (e) {
        await res.json({"msg": e.name + " " + e.message})
    }

});


module.exports = router;