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

router.get('/search/', async (req, res) => {
    let keyword = req.query.keyword;
    console.log(keyword)
    try {
        await res.json(await item_obj.findItemByName(keyword));
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});

router.get('/shop/:shop_id', async (req, res) => {
    let shop_id = req.params.shop_id;
    console.log(shop_id)
    try {
        await res.json(await item_obj.getAllItemsInAShop(shop_id));
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});



router.post('/', async (req, res) => {
    let shop_id = req.body.shop_id;
    let id = uniqueId();
    let name = req.body.name;
    let description = req.body.description;
    let amount_available = req.body.amount_available;
    let price = req.body.price;
    let photo_id = req.body.photo_id;
    let unit = req.body.unit;

    try {
        let result = await item_obj.createNewItem(id, name, description, amount_available, shop_id, price, photo_id, unit);
        if (result.rowCount === 1) {
            await res.status(201).json({"msg": "success"});
        } else {
            await res.status(502).json({"msg": "failed"});
        }

    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});

router.delete('/:id', async (req, res) => {
    let id = req.params['id'];
    try {
        let result = await item_obj.removeItem(id);
        //or already deleted
        if (result.rowCount === 1 || result.rowCount === 0) {
            await res.json({"msg": "success"});
        } else {
            await res.status(502).json({"msg": "failed"});
        }
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});

router.put('/:id', async (req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    let description = req.body.description;
    let amount_available = req.body.amount_available;
    let price = req.body.price;
    let unit = req.body.unit;

    try {
        let result = await item_obj.updateItem(name, description, amount_available, price, unit, id);
        if (result.rowCount === 1) {
            await res.json({"msg": "success"});
        } else {
            await res.status(502).json({"msg": "failed"});
        }
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});

router.put('/:id/amount/:value', async (req, res) => {
    let id =req.params['id'];
    let amount = req.params['value'];
    try {
        let result = await item_obj.updateAmountAvailable(id,amount);
        if (result.rowCount === 1) {
            await res.json({"msg": "success"});
        } else {
            await res.status(502).json({"msg": "failed"});
        }
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});


module.exports = router;
