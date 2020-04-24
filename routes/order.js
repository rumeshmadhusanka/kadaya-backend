const router = require("express").Router();
const Order = require('../models/order_model');
const uniqueId = require('uuid/v4');


let order_obj = new Order();

router.get('/:order_id', async (req, res) => {
    let order_id= req.params['order_id'];
    try {
        await res.json(await order_obj.getOrder(order_id));
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});

router.get('/buyer/:buyer_id/ongoing', async (req, res) => {
    let buyer_id = req.params['buyer_id'];
    try {
        await res.json(await order_obj.getOngoingOrdersByIdForBuyer(buyer_id));
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});

router.get('/buyer/:buyer_id/history', async (req, res) => {
    let buyer_id = req.params['buyer_id'];
    try {
        await res.json(await order_obj.getOrderHistoryByIdForBuyer(buyer_id));
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});

router.get('/shop/:shop_id/ongoing', async (req, res) => {
    let shop_id = req.params['shop_id'];
    try {
        await res.json(await order_obj.getOngoingOrdersByIdForShop(shop_id));
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});
router.get('/shop/:shop_id/history', async (req, res) => {
    let shop_id = req.params['shop_id'];
    try {
        await res.json(await order_obj.getOrderHistoryByIdForShop(shop_id));
    } catch (e) {
        await res.status(502).json({"msg": e.name + " " + e.message})
    }
});

router.post('/', async (req, res) => {
    let id = uniqueId();
    let buyer_id = req.body.buyer_id;
    let shop_id = req.body.shop_id;
    let message_body = req.body.message_body;
    let total_price = req.body.total_price;
    let items_list = req.body.items_list; //this is a list

    let started =  Date.now();
    let last_updated_timestamp =  Date.now();

    let reply;
    let code;
    try {
        let result = await order_obj.createNewOrder(id, buyer_id, shop_id, message_body, started, last_updated_timestamp, total_price, items_list);
        if (result) {
            reply = {"msg": "success"};
            code = 200;
        } else {
            reply = {"msg": "failed"};
            code = 400;
        }

        res.status(code).json(reply);
    } catch (e) {
        res.status(502).json({"msg": e.name+" "+e.message})
    }
});


router.put('/:id', async (req, res) => {
    let state = req.body.state;
    let id = req.params['id'];

    try {
        let out = await order_obj.updateOrderStatus(state,id);
        out = out.rowCount;
        console.log(out);
        await res.json({"msg": out})
    } catch (e) {
        await res.status(502).json({"msg": e.name+" "+e.message})
    }

});

router.delete('/:id', async (req, res) => {
    let id = req.params['id'];

    try {
        let out = await order_obj.deleteOrder(id);
        out = out.rowCount;
        console.log(out);
        if (out===1 || out===0){
            await res.json({"msg": out})
        }else{
            new Error("Error sql unknown")
        }
    } catch (e) {
        await res.status(502).json({"msg": e.name+" "+e.message})
    }

});


module.exports =router;