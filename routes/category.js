const router = require("express").Router();
const Category = require('../models/category_model');
const  Shop = require('../models/shop_model');

let category_obj = new Category();
let shop_obj = new Shop();

router.get('/', async (req, res) => {
    try {
        await res.json(await category_obj.getAll());
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});
router.get('/:category/shops', async (req, res) => {
    let category = req.params.category;
    let lat = req.query.latitude;
    let long = req.query.longitude;
    let radius = req.query.radius;
    try {
        await res.json(await shop_obj.getShopsNearLocationByCategory(lat,long,radius,category));
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});


module.exports = router;
