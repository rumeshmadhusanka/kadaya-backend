const router = require("express").Router();
const Buyer = require('../models/buyer_model');

let buyer_obj = new Buyer();

router.get('/',async (req, res)=>{
    let firebase_id = req.query.firebase_id;
    if (firebase_id){
        await res.json(await buyer_obj.getByFirebaseId(firebase_id));
    }else{
        await res.json(await buyer_obj.getAll());
    }

});

router.post('/', async (req, res) => {
    let firebase_id = req.body.firebase_id;
    let name = req.body.name;
    let email = req.body.email;
    let address = req.body.address;
    let phone = req.body.phone;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;

    let status_code = 201;
    let result;
    try {
        result = await buyer_obj.addNewBuyer(firebase_id, name, email, address, phone, latitude, longitude)
    } catch (e) {
        status_code = 300;
        result = {"code":e.toString()};
    }
    await res.status(status_code).json(result)
});

router.get('/history',async (req, res)=>{
    let firebase_id = req.query.firebase_id;
    if (firebase_id){
        await res.json(await buyer_obj.getBuyingHistory(firebase_id));
    }else{
        await res.status(404).end();
    }

});

router.get('/current-orders',async (req, res)=>{
    let firebase_id = req.query.firebase_id;
    if (firebase_id){
        await res.json(await buyer_obj.getOngoingOrders(firebase_id));
    }else{
        await res.status(404).end();
    }

});



module.exports = router;
