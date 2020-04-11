const AWS = require('aws-sdk');
const router = require("express").Router();
const fs = require('fs-extra');
const uniqueId = require('uuid/v4');


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
let s3 = new AWS.S3();

function encode(data) {
    let buf = Buffer.from(data);
    return buf.toString('base64')
}

router.get('/', (req, res) => {
    let image_key = "shop/ER-2.jpeg";
    let read_stream = s3.getObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: image_key,
        }
    ).createReadStream();
    read_stream.on('close', () => {
        res.end()
    });
    read_stream.on('error', () => {
        res.status(502).end();
    });

    read_stream.pipe(res);

});

router.post('/', (req, res) => {
    //let fstream;

    console.log("hvytfyt");

    //fstream = fs.createReadStream(req.busboy);
    console.log(req.files);
    let image_name = uniqueId();
    res.send("gygyg");


    // s3.upload({
    //     Bucket: process.env.AWS_S3_BUCKET,
    //     Key: image_name,
    //     Body: req.busboy
    // }).on('httpUploadProgress',(err,data)=>{
    //     res.json({"message":err || data.Location})
    // })
});

module.exports = router;

