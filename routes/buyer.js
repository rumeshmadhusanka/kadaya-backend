const router = require("express").Router();
const Buyer = require('../models/buyer_model');
const jwt = require('jsonwebtoken');
const uniqueId = require('uuid/v4');
const bcrypt = require('bcryptjs');


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

router.get('/:buyer_id', async (req, res) => {
    let buyer_id = req.params['buyer_id'];
    try {
        if (buyer_id) {
            await res.json(await buyer_obj.getByFirebaseId(buyer_id));
        } else {
            await res.status(404).json({"msg": "Id not found"})
        }
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }

});


router.put('/:buyer_id', async (req, res) => {
    let buyer_id = req.params['buyer_id'];
    let name = req.body.name;
    let email = req.body.email;
    let address = req.body.address;
    let phone = req.body.phone;
    if (!phone){
        await res.status(400).json({"msg": "phone number cannot be empty"})
    }

    let result;
    try {
        result = await buyer_obj.updateProfile(buyer_id, name, email, address, phone);
        if (result.rowCount === 1) {
            await res.status(200).json({"msg": "success"})
        } else {
            await res.status(400).json({"msg": "failed. Could not update"})
        }
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }


});

router.put('/:buyer_id/location', async (req, res) => {
    let buyer_id = req.params['buyer_id'];
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;

    let result;
    try {
        result = await buyer_obj.updateLocation(buyer_id, latitude, longitude);
        if (result.rowCount === 1) {
            await res.status(201).json({"msg": "success"})
        } else {
            await res.status(400).json({"msg": "failed. Could not update"})
        }
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }

});


router.get('/:buyer_id/history', async (req, res) => {
    let buyer_id = req.params.buyer_id;
    try {
        if (buyer_id) {
            await res.json(await buyer_obj.getBuyingHistory(buyer_id));
        } else {
            await res.status(404).json({"msg": "buyer not found"});
        }
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }

});

router.get('/:buyer_id/current-orders', async (req, res) => {
    let buyer_id = req.params.buyer_id;
    try {
        if (buyer_id) {
            await res.json(await buyer_obj.getOngoingOrders(buyer_id));
        } else {
            await res.status(404).json({"msg": "buyer not found"});
        }
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});

router.post('/login', async (req, res) => {
    let phone = req.body.phone;
    let password = req.body.password;

    try {
        let result = await buyer_obj.login(phone, password);
        let buyer_id = result.buyer_id;
        let token = jwt.sign({"buyer_id": buyer_id}, config.secret);
        res.header('x-access-token', token).status(200).json(result);
    } catch (e) {
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

    let password_hash = bcrypt.hashSync(password);
    let reply;
    let code;
    try {
        let result = await buyer_obj.signup(buyer_id, name, email, address, phone, latitude, longitude, password_hash);
        if (result.rowCount === 1) {
            reply = {"status": "success","buyer_id":buyer_id};
            code = 201;
        } else {
            reply = {"status": "failed"};
            code = 400;
        }
        let token = jwt.sign({"buyer_id": buyer_id}, config.secret);
        res.header('x-access-token', token).status(code).json(reply);
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }

});


module.exports = router;
