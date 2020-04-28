const router = require("express").Router();
const ExpoMessenger = require('../middleware/expo');

let expo = new ExpoMessenger();
router.post('/send', async (req, res) => {
	let push_token = req.body.push_token;
	let message =req.body.message;
	let data_obj = req.body.data_obj || {} ;

	try {
		let val = await expo.sendMessage(push_token, message, data_obj);
		await res.json({"msg": val})
	} catch (e) {
		await res.status(502).json({"msg": e.name+" "+e.message})
	}

});







module.exports =router;