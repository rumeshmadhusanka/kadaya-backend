const router = require("express").Router();
const Category = require('../models/category_model');

let category_obj = new Category();

router.get('/', async (req, res) => {
    try {
        await res.json(await category_obj.getAll());
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});
router.get('/shops', async (req, res) => {
    try {
        await res.json(await category_obj.getAllShopsByCategory());
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});


module.exports = router;
