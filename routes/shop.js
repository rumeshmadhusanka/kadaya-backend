const router = require("express").Router();
const Shop = require('../models/shop_model');
const jwt = require('jsonwebtoken');
const uniqueId = require('uuid/v4');
const bcrypt = require('bcryptjs');

let shop_obj = new Shop();
const config = {
    "secret": process.env.JWT_SECRET,
};


router.get('/', async (req, res) => {
    let lat = req.query.latitude;
    let long = req.query.longitude;
    let radius = req.query.radius || process.env.DEFAULT_LOCATION_SEARCH_RADIUS;
    //console.log(radius)
    try {
        if (lat && long) {
            await res.json(await shop_obj.getShopsNearLocation(lat, long, radius));
        } else {
            await res.json(await shop_obj.getAllShops());
        }
    }catch (e) {
        await res.status(502).json({"msg": e.name+" "+e.message})
    }

});

router.get('/all', async (req, res) => {
    try {
        await res.json(await shop_obj.getAllShops());
    }catch (e) {
        await res.status(502).json({"msg": e.name+" "+e.message})
    }
});


router.get('/:category', async (req, res) => {
    let lat = req.query.latitude;
    let long = req.query.longitude;
    let category = req.params['category'];
    let radius = req.query.radius || process.env.DEFAULT_LOCATION_SEARCH_RADIUS;
    try {
        if (lat && long) {
            await res.json(await shop_obj.getShopsNearLocationByCategory(lat, long, radius, category));
        } else {
            await res.json(await shop_obj.getAllShopsByCategory(category));
        }
    } catch (e) {
        await res.status(502).json({"msg": e.name+" "+e.message})
    }

});

router.put('/', async (req, res) => {
    let shop_id = req.body.shop_id;
    let name = req.body.name;
    let address = req.body.address;
    let comments = req.body.comments;
    let owner_name = req.body.owner_name;
    let email = req.body.email;
    let phone = req.body.phone;
    let category = req.body.category;
    let open_hours = req.body.open_hours;
    let is_open = req.body.is_open;
    try {
        let out = await shop_obj.updateProfile(shop_id, name, address, comments, owner_name, email, phone, category, open_hours, is_open);
        out = out.rowCount;
        console.log(out);
        await res.json({"msg": out})
    } catch (e) {
        await res.status(502).json({"msg": e.name+" "+e.message})
    }
});

router.put('/location', async (req, res) => {
    let shop_id = req.body.shop_id;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    try {
        let out = await shop_obj.updateLocation(shop_id, latitude, longitude);
        out = out.rowCount;
        console.log(out);
        await res.json({"msg": out})
    } catch (e) {
        await res.status(502).json({"msg": e.name+" "+e.message})
    }

});

router.put('/password', async (req, res) => {
    let shop_id = req.body.shop_id;
    let old_password = req.body.old_password;
    let new_password = req.body.new_password;

    try {
        let pw_hash_from_db = await shop_obj.getPassword(shop_id);
        if (pw_hash_from_db[0]) {
            pw_hash_from_db = pw_hash_from_db[0].password;
            let result = await bcrypt.compare(old_password, pw_hash_from_db);
            console.log(old_password, pw_hash_from_db);
            console.log(result);
            if (result === true) {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(new_password, salt, async function (err, new_password_hashed) {

                        let out = await shop_obj.updatePassword(shop_id, new_password_hashed);
                        out = out.rowCount;
                        console.log(out);
                        await res.json({"msg": out})
                    });
                });
            } else {
                await res.status(400).json({"msg": "incorrect old password"})
            }

        } else {
            await res.status(404).json({"msg": "invalid shop id"})
        }
    } catch (e) {
        await res.status(502).json({"msg": e.name+" "+e.message})
    }

});


router.post('/login', async (req, res) => {
    let phone = req.body.phone;
    let password = req.body.password;
    try {
        let result = await shop_obj.login(phone, password);
        let shop_id = result.shop_id;
        let token = jwt.sign({"shop_id": shop_id}, config.secret);
        res.header('x-access-token', token).status(200).json(result);
    }catch (e) {
        await res.status(502).json({"msg": e.name+" "+e.message})
    }
});

router.post('/', async (req, res) => {
    let shop_id = uniqueId();
    let name = req.body.name;
    let address = req.body.address;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let comments = req.body.comments;
    let photo_id = req.body.photo_id;
    let owner_name = req.body.owner_name;
    let email = req.body.email;
    let password = req.body.password;
    let phone = req.body.phone;
    let category = req.body.category;

    let reply;
    let code;
    try {
        let result = await shop_obj.addNewShop(shop_id, name, address, latitude, longitude, comments, photo_id, owner_name, email, password, phone, category);
        if (result.rowCount === 1) {
            reply = {"status": "success"};
            code = 200;
        } else {
            reply = {"status": "failed"};
            code = 400;
        }
        let token = jwt.sign({"shop_id": shop_id}, config.secret);
        res.header('x-access-token', token).status(code).json(reply);
    } catch (e) {
        res.status(404).json({"msg": e.name+" "+e.message})
    }
});


module.exports = router;
