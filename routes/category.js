const router = require("express").Router();
const Category = require('../models/category_model');

let category_obj = new Category();

router.get('/',async (req, res)=>{
    await res.json(await category_obj.getAll());
});
router.get('/shops',async (req, res)=>{
    await res.json(await category_obj.getAllShopsByCategory());
});



module.exports = router;
