const router = require("express").Router();
const Order = require('../models/order_model');
const Buyer = require('../models/buyer_model');
const Shop = require('../models/shop_model');
const uniqueId = require('uuid/v4');
const ExpoMessenger = require('../middleware/expo');

let expo_obj = new ExpoMessenger();
let order_obj = new Order();
let buyer_obj = new Buyer();
let shop_obj = new Shop();

router.get('/:order_id', async (req, res) => {
	let order_id = req.params['order_id'];
	try {
		let result1 = await order_obj.getOrder(order_id);
		result1["items"] = await order_obj.getOrderItems(order_id);
		result1["buyer_details"] = await buyer_obj.getByFirebaseId(result1["buyer_id"]);
		result1["shop_details"] = await shop_obj.getShopById(result1["shop_id"]);
		await res.json(result1);
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
	try {
		let id = uniqueId();
		let buyer_id = req.body.buyer_id;
		let shop_id = req.body.shop_id;
		let message_body = req.body.message_body;
		let total_price = req.body.total_price;
		let items_list = req.body.items_list; //this is a list

		let started = Date.now();
		let last_updated_timestamp = Date.now();

		let reply;
		let code;

		let result = await order_obj.createNewOrder(id, buyer_id, shop_id, message_body, started, last_updated_timestamp, total_price, items_list);
		let expo_shop_token = null;
		try {
			expo_shop_token = await shop_obj.getExpoToken(shop_id);
		} catch (e) {
			console.log("Token fetching failed")
		}
		if (result) {
			reply = {"msg": "success"};
			code = 200;
			expo_obj.sendMessage(expo_shop_token, "New Order arrived", {})
		} else {
			reply = {"msg": "failed"};
			code = 400;
		}

		res.status(code).json(reply);
	} catch (e) {
		res.status(502).json({"msg": e.name + " " + e.message})
	}
});


router.put('/:id', async (req, res) => {
	let state = req.body.state;
	let id = req.params['id'];
	let shops_reply = req.body.shops_reply;

	if (!shops_reply) {
		shops_reply = null
	}

	// 'ACCEPTED', 'ORDER-READY', 'COMPLETED', 'CANCELLED'
	let message = null;
	if (state === 'ACCEPTED') {
		message = "Your order is accepted"
	} else if (state === 'ORDER-READY') {
		message = "Your order is ready"
	} else if (state === 'CANCELLED') {
		message = "Your order was cancelled"
	}


	try {
		let out = await order_obj.updateOrderStatus(state, id, shops_reply);
		out = out.rowCount;
		console.log(out);

		try {
		    if(message) {
                let row = await order_obj.getOrder(id);
                let buyer_id = row.buyer_id;
                let expo_buyer_token = await buyer_obj.getExpoToken(buyer_id);
                expo_obj.sendMessage(expo_buyer_token, message, {})
            }

		} catch (e) {
			console.log("Message could not be sent")
		}
		await res.json({"msg": out})
	} catch (e) {
		await res.status(502).json({"msg": e.name + " " + e.message})
	}

});

router.delete('/:id', async (req, res) => {
	let id = req.params['id'];

	try {
		let out = await order_obj.deleteOrder(id);
		out = out.rowCount;
		console.log(out);
		if (out === 1 || out === 0) {
			await res.json({"msg": out})
		} else {
			new Error("Error sql unknown")
		}
	} catch (e) {
		await res.status(502).json({"msg": e.name + " " + e.message})
	}

});


module.exports = router;