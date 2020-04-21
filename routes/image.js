const AWS = require('aws-sdk');
const router = require("express").Router();
const fs = require('fs-extra');
const uniqueId = require('uuid/v4');
const sharp = require('sharp');
const multer = require('multer');
const multerS3 = require('multer-s3');
const Image = require('../models/file_model');

let image_obj = new Image();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
let s3 = new AWS.S3();

function encode(data) {
    let buf = Buffer.from(data);
    return buf.toString('base64')
}

router.get('/:key', async(req, res) => {
    let key = req.params['key'];
    try {
        let read_stream = s3.getObject({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
            }
        ).createReadStream();
        read_stream.on('close', () => {
            res.end()
        });
        read_stream.on('error', () => {
            res.status(502).end();
        });

        read_stream.pipe(res);
    }catch (e) {
        await res.status(502).json({"msg": e.name+" "+e.message})
    }

});


router.get('/shop/:shop_id/keys',async(req, res)=>{
    let shop_id = req.params['shop_id'];
    try{
        let result =  await image_obj.getAllImageKeysOfAShop(shop_id);
        await res.json(result)
    }catch (e) {
        await res.status(502).json({"msg": e.name+" "+e.message})
    }
});

let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            console.log(file);
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            let file_name = file.originalname;
            file_name = file_name.split('.');
            let extension = file_name[file_name.length-1];
            cb(null,  "shop/"+uniqueId()+"."+extension)
        }
    })
});

router.post('/shop/:shop_id', upload.array('image', 5), async (req, res, next)=> {
    let shop_id = req.body.shop_id;
    try{
        console.log(req.files);
        for (let i = 0; i < req.files.length; i++) {
             await image_obj.saveUploadUrl(req.files[i].location,shop_id)
        }
        await res.json({"msg": req.files.length})
    }catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }

});

module.exports = router;

