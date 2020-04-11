const router = require("express").Router();
const Shop = require('../models/shop_model');

let shop_obj = new Shop();

router.get('/', async (req, res) => {
    let lat = req.query.latitude;
    let long = req.query.longitude;
    let radius = req.query.radius || process.env.DEFAULT_LOCATION_SEARCH_RADIUS;
    if (lat && long) {
        await res.json(await shop_obj.getShopsNearLocation(lat, long, radius));
    } else {
        await res.json(await shop_obj.getAllShops());
    }

});

router.get('/:category_id', async (req, res) => {
    let lat = req.query.latitude;
    let long = req.query.longitude;
    let category_id = req.params['category_id'];
    if (lat && long) {
        await res.json(await shop_obj.getShopsNearLocation(lat, long, process.env.DEFAULT_LOCATION_SEARCH_RADIUS), category_id);
    } else {
        await res.json(await shop_obj.getAllShopsByCategoryId(category_id));
    }

});


router.post('/', async (req, res) => {
    let firebase_id = req.body.firebase_id;
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
    let category_id = req.body.category_id;
    let status_code = 201;
    let result;
    try {
        result = await shop_obj.addNewShop(firebase_id, name, address, latitude, longitude, comments, photo_id, owner_name, email, password, phone, category_id)
    } catch (e) {
        status_code = 300;
        result = {"code":e.toString()};
    }
    await res.status(status_code).json(result)
});


module.exports = router;
