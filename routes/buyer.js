const router = require("express").Router();
const Buyer = require('../models/buyer_model');
const jwt = require('jsonwebtoken');
const uniqueId = require('uuid/v4');


let buyer_obj = new Buyer();
const config = {
    "secret": process.env.JWT_SECRET,
};

router.get('/', async (req, res) => {
    let buyer_id = req.query.buyer_id;
    if (buyer_id) {
        await res.json(await buyer_obj.getByFirebaseId(buyer_id));
    } else {
        await res.json(await buyer_obj.getAll());
    }

});

router.post('/', async (req, res) => {
    let buyer_id = req.body.buyer_id;
    let name = req.body.name;
    let email = req.body.email;
    let address = req.body.address;
    let phone = req.body.phone;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;

    let status_code = 201;
    let result;
    try {
        result = await buyer_obj.addNewBuyer(buyer_id, name, email, address, phone, latitude, longitude)
        if (result.rowCount === 1) {
            result = {"status": "success"}
        }
    } catch (e) {
        status_code = 300;
        console.log(e);
        result = {"code": e.toString()};
    }
    await res.status(status_code).json(result)
});

router.put('/', async (req, res) => {
    let buyer_id = req.body.buyer_id;
    let name = req.body.name;
    let email = req.body.email;
    let address = req.body.address;
    let phone = req.body.phone;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;

    let status_code = 201;
    let result;
    try {
        result = await buyer_obj.updateProfile(buyer_id, name, email, address, phone, latitude, longitude);
        if (result.rowCount === 1) {
            result = {"status": "success"}
        }
    } catch (e) {
        status_code = 300;
        console.log(e);
        result = {"code": e.toString()};
    }
    await res.status(status_code).json(result)

});

router.put('/location', async (req, res) => {
    let buyer_id = req.body.buyer_id;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;

    let status_code = 201;
    let result;
    try {
        result = await buyer_obj.updateLocation(buyer_id, latitude, longitude);
        if (result.rowCount === 1) {
            result = {"status": "success"}
        }
    } catch (e) {
        status_code = 300;
        console.log(e);
        result = {"code": e.toString()};
    }
    await res.status(status_code).json(result)

});


router.get('/history', async (req, res) => {
    let buyer_id = req.query.buyer_id;
    if (buyer_id) {
        await res.json(await buyer_obj.getBuyingHistory(buyer_id));
    } else {
        await res.status(404).end();
    }

});

router.get('/current-orders', async (req, res) => {
    let buyer_id = req.query.buyer_id;
    if (buyer_id) {
        await res.json(await buyer_obj.getOngoingOrders(buyer_id));
    } else {
        await res.status(404).end();
    }

});

router.post('/login', async (req, res) => {
    let phone = req.body.phone;
    let password = req.body.password;
    let result = await buyer_obj.login(phone, password);
    let buyer_id = result.buyer_id;
    let token = jwt.sign({"buyer_id": buyer_id, "user_type": "BUYER"}, config.secret);
    res.header('x-access-token', token).status(200).json(result);
});

router.post('/signup', async (req, res) => {
    let buyer_id = uniqueId();
    let email = req.body.email;
    let address = req.body.address;
    let phone = req.body.phone;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let password = req.body.password;

    let reply;
    let code;
    try {
        let result = await buyer_obj.signup(buyer_id, name, email, address, phone, latitude, longitude, password);
        if (result.rowCount === 1) {
            reply = {"status": "success"};
            code = 200;
        }else {
            reply = {"status": "failed"};
            code = 400;
        }
        let token = jwt.sign({"buyer_id": buyer_id, "user_type": ""}, config.secret);
        res.header('x-access-token', token).status(code).json(reply);
    }catch (e) {
        res.status(404).send(e.toString());
    }

});


module.exports = router;
