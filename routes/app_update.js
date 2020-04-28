const router = require("express").Router();
const AppUpdate = require('../models/app_model');

let app_obj =  new AppUpdate();

router.post('/',async(req,res)=>{

	try {
		let version = req.body.version;
		let major = version.split(".")[0];
		let db_version = (await app_obj.getVersion())["version"];
		let major_db = db_version.split(".")[0];

		if (major_db > major) {
			await res.json({"msg": true})
		} else {
			await res.json({"msg": false})
		}
	}catch (e) {
		await res.status(502).json({"msg": e.name + " " + e.message})
	}

});





module.exports =router;