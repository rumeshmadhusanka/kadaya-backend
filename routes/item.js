const router = require("express").Router();
const Item = require('../models/item_model');
const uniqueId = require('uuid/v4');


let item_obj = new Item();

router.get('/', async (req, res) => {
    try {
        await res.json(await item_obj.getAllItems());
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});

router.get('/:shop_id', async (req, res) => {
    let shop_id = req.params['shop_id'];
    try {
        await res.json(await item_obj.getAllItemsInAShop(shop_id));
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});

router.get('/search', async (req, res) => {
    let keyword = req.query.keyword;
    try {
        await res.json(await item_obj.findItemByName(keyword));
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});


module.exports = router;
