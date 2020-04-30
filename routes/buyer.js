const router = require("express").Router();
const Buyer = require('../models/buyer_model');
const jwt = require('jsonwebtoken');
const uniqueId = require('uuid/v4');
const bcrypt = require('bcryptjs');
const {verifyToken, isBuyer, isSameBuyer} = require('../middleware/auth');


let buyer_obj = new Buyer();
const config = {
	"secret": process.env.JWT_SECRET,
};

// router.get('/', async (req, res) => {
//     try {
//         await res.json(await buyer_obj.getAll());
//     } catch (e) {
//         await res.status(502).json({"msg": e.name + " " + e.message})
//     }
//
// });

router.get('/:buyer_id', verifyToken, isBuyer, isSameBuyer, async (req, res) => {
	let buyer_id = req.params['buyer_id'];
	try {
		if (buyer_id) {
			await res.json(await buyer_obj.getByFirebaseId(buyer_id));
		} else {
			console.log({"msg": "Id not found", "buyer_id": buyer_id});
			await res.status(404).json({"msg": "Id not found"})
		}
	} catch (e) {
		console.log({"msg": e.name + " " + e.message});
		await res.status(502).json({"msg": e.name + " " + e.message})
	}

});


router.put('/:buyer_id', verifyToken, isBuyer, isSameBuyer, async (req, res) => {
	let buyer_id = req.params['buyer_id'];
	let name = req.body.name;
	let email = req.body.email;
	let address = req.body.address;
	let phone = req.body.phone;
	if (!phone) {
		await res.status(400).json({"msg": "phone number cannot be empty"})
	}

	let result;
	try {
		result = await buyer_obj.updateProfile(buyer_id, name, email, address, phone);
		if (result.rowCount === 1) {
			await res.status(200).json({"msg": "success"})
		} else {
			console.log({"msg": "failed. Could not update buyer general info", "buyer_id": buyer_id});
			await res.status(400).json({"msg": "failed. Could not update"})
		}
	} catch (e) {
		console.log({"msg": e.name + " " + e.message});
		await res.status(502).json({"msg": e.name + " " + e.message})
	}


});

router.put('/:buyer_id/location', verifyToken, isBuyer, isSameBuyer, async (req, res) => {
	let buyer_id = req.params['buyer_id'];
	let latitude = req.body.latitude;
	let longitude = req.body.longitude;

	let result;
	try {
		result = await buyer_obj.updateLocation(buyer_id, latitude, longitude);
		if (result.rowCount === 1) {
			await res.status(201).json({"msg": "success"})
		} else {
			console.log({"msg": "failed. Could not update location", "buyer_id": buyer_id});
			await res.status(400).json({"msg": "failed. Could not update"})
		}
	} catch (e) {
		console.log({"msg": e.name + " " + e.message});
		await res.status(502).json({"msg": e.name + " " + e.message})
	}

});


router.get('/:buyer_id/history', verifyToken, isBuyer, isSameBuyer, async (req, res) => {
	let buyer_id = req.params.buyer_id;
	try {
		if (buyer_id) {
			await res.json(await buyer_obj.getBuyingHistory(buyer_id));
		} else {
			console.log({"msg": "failed. Could not get history", "buyer_id": buyer_id});
			await res.status(404).json({"msg": "buyer not found"});
		}
	} catch (e) {
		console.log({"msg": e.name + " " + e.message});
		await res.status(502).json({"msg": e.name + " " + e.message})
	}

});

router.get('/:buyer_id/current-orders', verifyToken, isBuyer, isSameBuyer, async (req, res) => {
	let buyer_id = req.params.buyer_id;
	try {
		if (buyer_id) {
			await res.json(await buyer_obj.getOngoingOrders(buyer_id));
		} else {
			console.log({"msg": "failed. Could not get current orders", "buyer_id": buyer_id});
			await res.status(404).json({"msg": "buyer not found"});
		}
	} catch (e) {
		console.log({"msg": e.name + " " + e.message});
		await res.status(502).json({"msg": e.name + " " + e.message})
	}
});

router.post('/login', async (req, res) => {
	let phone = req.body.phone;
	let password = req.body.password;
	let expo_token = req.body.expo_token;

	try {
		let result = await buyer_obj.login(phone, password);
		let buyer_id = result.buyer_id;
		let token = jwt.sign({"buyer_id": buyer_id}, config.secret);
		try {
			buyer_obj.setExpoToken(buyer_id, expo_token);
		} catch (e) {
			console.log("Could not set expo token")
		}
		res.header('x-access-token', token).status(200).json(result);
	} catch (e) {
		console.log({"msg": e.name + " " + e.message});
		await res.status(502).json({"msg": e.name + " " + e.message})
	}
});

//signup
router.post('/', async (req, res) => {
	let buyer_id = uniqueId();
	let name = req.body.name;
	let email = req.body.email;
	let address = req.body.address;
	let phone = req.body.phone;
	let latitude = req.body.latitude;
	let longitude = req.body.longitude;
	let password = req.body.password;
	let expo_token = req.body.expo_token;

	let password_hash = bcrypt.hashSync(password);
	let reply;
	let code;
	try {
		let result = await buyer_obj.signup(buyer_id, name, email, address, phone, latitude, longitude, password_hash, expo_token);
		if (result.rowCount === 1) {
			reply = {"status": "success", "buyer_id": buyer_id};
			code = 201;
		} else {
			console.log({"msg": "failed. to update buyer", "buyer_id": buyer_id});
			reply = {"status": "failed"};
			code = 400;
		}
		let token = jwt.sign({"buyer_id": buyer_id}, config.secret);
		res.header('x-access-token', token).status(code).json(reply);
	} catch (e) {
		console.log({"msg": e.name + " " + e.message});
		await res.status(502).json({"msg": e.name + " " + e.message})
	}

});


router.put('/:buyer_id/password', verifyToken, isBuyer, isSameBuyer, async (req, res) => {
	let buyer_id = req.params.buyer_id;
	let old_password = req.body.old_password;
	let new_password = req.body.new_password;

	if (!new_password) {
		await res.status(400).json({"msg": "password cannot be empty"})
	}

	try {
		let pw_hash_from_db = await buyer_obj.getPassword(buyer_id);
		if (pw_hash_from_db[0]) {
			pw_hash_from_db = pw_hash_from_db[0].password;
			let result = await bcrypt.compare(old_password, pw_hash_from_db);
			console.log(old_password, pw_hash_from_db);
			console.log(result);
			if (result === true) {
				bcrypt.genSalt(10, function (err, salt) {
					bcrypt.hash(new_password, salt, async function (err, new_password_hashed) {

						let out = await buyer_obj.updatePassword(buyer_id, new_password_hashed);
						out = out.rowCount;
						console.log(out);
						await res.json({"msg": out})
					});
				});
			} else {
				await res.status(400).json({"msg": "incorrect old password"})
			}

		} else {
			await res.status(404).json({"msg": "invalid buyer id"})
		}
	} catch (e) {
		console.log({"msg": e.name + " " + e.message});
		await res.status(502).json({"msg": e.name + " " + e.message})
	}

});


module.exports = router;
