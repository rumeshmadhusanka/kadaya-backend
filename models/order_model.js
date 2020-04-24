const pg_pool = require('../middleware/db');
const Buyer = require('./buyer_model');

let buyer_obj1 = new Buyer();

class Order {
	async getOrder(order_id) {
		let query_str = 'SELECT * FROM public."order" left outer join buyer on buyer.buyer_id = "order".buyer_id where "order".id = ($1)';

		return new Promise(async (resolve, reject) => {
			try {
				let {rows} = await pg_pool.query(query_str, [order_id]);
				rows = rows[0]
				console.log(rows);
				delete rows.password;
				delete rows.email;
				delete rows.latitude;
				delete rows.longitude;
				resolve(rows);
			} catch (e) {
				reject(e)
			}
		})
	}

	getOrderHistoryByIdForBuyer(buyer_id) {
		return buyer_obj1.getBuyingHistory(buyer_id)
	}

	getOngoingOrdersByIdForBuyer(buyer_id) {
		return buyer_obj1.getOngoingOrders(buyer_id)
	}

	async getOngoingOrdersByIdForShop(shop_id) {
		let query_str = 'SELECT * FROM public.order left outer join buyer on buyer.buyer_id = "order".buyer_id where shop_id=($1) and state!=($2)';

		return new Promise(async (resolve, reject) => {
			try {
				let {rows} = await pg_pool.query(query_str, [shop_id, "COMPLETED"]);
				console.log(rows);
				for (let i = 0; i < rows.length; i++) {
					delete rows[i].password;
					delete rows[i].email;
					delete rows[i].latitude;
					delete rows[i].longitude;
				}
				resolve(rows);
			} catch (e) {
				reject(e)
			}
		})
	}

	async getOrderHistoryByIdForShop(shop_id) {
		let query_str = 'SELECT * FROM public.order left outer join buyer on buyer.buyer_id = "order".buyer_id where shop_id=($1) and state=($2)';
		return new Promise(async (resolve, reject) => {
			try {
				let {rows} = await pg_pool.query(query_str, [shop_id, "COMPLETED"]);
				//console.log(rows);
				for (let i = 0; i < rows.length; i++) {
					delete rows[i].password;
					delete rows[i].email;
					delete rows[i].latitude;
					delete rows[i].longitude;
				}
				resolve(rows);
			} catch (e) {
				reject(e)
			}
		})
	}


	async createNewOrder(id, buyer_id, shop_id, message_body, started, last_updated_timestamp, total_price, items_list) {
		let query_str = 'INSERT INTO public.order (id,buyer_id, shop_id, message_body, started, last_updated_timestamp, total_price) values (($1),($2),($3),($4),($5),($6),($7))';
		let query2 = 'INSERT INTO public.order_item (order_id, item_id, amount, price) values (($1),($2),($3),(select price from public.item where id=($4))*($5))';
		let query3 = 'UPDATE  public.order set total_price = (select sum(price) from public.order_item where order_id = ($1)) where id=($1)';
		return new Promise(async (resolve, reject) => {
			try {
				let result = await pg_pool.query(query_str, [id, buyer_id, shop_id, message_body, started, last_updated_timestamp, total_price]);
				console.log("check1");
				if (result.rowCount === 1) {
					let prom_list = [];
					console.log("check2")
					for (let i = 0; i < items_list.length; i++) {
						console.log("check3")
						console.log("item_id", items_list[i].item_id);
						console.log("amount", items_list[i].amount);

						prom_list.push(pg_pool.query(query2, [id, items_list[i].item_id, items_list[i].amount, items_list[i].item_id, items_list[i].amount]));
					}
					console.log("check4")
					Promise.all(prom_list).then(async (rs) => {
						console.log(rs)
						let bool_val = true;
						for (let i = 0; i < rs.length; i++) {
							bool_val = bool_val && (rs[i].rowCount === 1);
						}
						console.log("check5")
						if (bool_val) {
							console.log("check6")
							let last = await pg_pool.query(query3, [id]);
							console.log("check7")
							if (last.rowCount === 1) {
								console.log("check8")
								resolve(true)
							} else {
								reject(new Error("Total value calculation error"))
							}

						} else {
							reject(new Error("Some items could not be added"));
						}
					})
				} else {
					reject(new Error("Could not create a new order"));
				}
			} catch (e) {
				reject(e)
			}

		})
	}

	async updateOrderStatus(state, id) {
		let query_str = "UPDATE public.order set state =($1), last_updated_timestamp=($2) where id=($3)";
		let last_updated_timestamp = new Date().getTime();
		return new Promise(async (resolve, reject) => {
			try {
				let result = await pg_pool.query(query_str, [state, last_updated_timestamp, id]);
				console.log(result);
				resolve(result);
			} catch (e) {
				reject(e)
			}
		})
	}

	async deleteOrder(id) {
		let query_str = "DELETE FROM public.order where id=($1)";
		return new Promise(async (resolve, reject) => {
			try {
				let result = await pg_pool.query(query_str, [id]);
				console.log(result);
				resolve(result);
			} catch (e) {
				reject(e)
			}
		})
	}

}

module.exports = Order;