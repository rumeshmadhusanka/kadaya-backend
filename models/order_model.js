const pg_pool = require('../middleware/db');
const Buyer = require('./buyer_model');

let buyer_obj1 = new Buyer();

class Order {
	getOrderHistoryByIdForBuyer(buyer_id) {
		return buyer_obj1.getBuyingHistory(buyer_id)
	}

	getOngoingOrdersByIdForBuyer(buyer_id) {
		return buyer_obj1.getOngoingOrders(buyer_id)
	}

	async getOngoingOrdersByIdForShop(shop_id) {
		let query_str = 'SELECT * FROM public.order where shop_id=($1) and state!=($2)';

		return new Promise(async (resolve, reject) => {
			try {
				let {rows} = await pg_pool.query(query_str, [shop_id, "COMPLETED"]);
				//console.log(rows);
				resolve(rows);
			} catch (e) {
				reject(e)
			}
		})
	}

	async getOrderHistoryByIdForShop(shop_id) {
		let query_str = 'SELECT * FROM public.order where shop_id=($1) and state=($2)';
		return new Promise(async (resolve, reject) => {
			try {
				let {rows} = await pg_pool.query(query_str, [shop_id, "COMPLETED"]);
				//console.log(rows);
				resolve(rows);
			} catch (e) {
				reject(e)
			}
		})
	}


	async createNewOrder(id, buyer_id, shop_id, message_body, started, last_updated_timestamp, total_price, items_list) {
		let query_str = 'INSERT INTO public.order (id,buyer_id, shop_id, message_body, started, last_updated_timestamp, total_price) values (($1),($2),($3),($4),($5),($6))';
		let query2 = 'INSERT INTO public.order_item (order_id, item_id, amount, price) values (($1),($2),($3),(select price from public.item where id=public.order_item.item_id))';
		let query3 = 'UPDATE  public.order set total_price = (select sum(price) from public.order_item where order_id = ($1)) where id=($1)';
		return new Promise(async (resolve, reject) => {
			try {
				let result = await pg_pool.query(query_str, [id, buyer_id, shop_id, message_body, started, last_updated_timestamp, total_price]);
				console.log(result);
				if (result.rowCount === 1) {
					let prom_list = [];
					for (let i = 0; i < items_list.length; i++) {
						prom_list.push(pg_pool.query(query2, [id, items_list[i].item_id, items_list[i].amount]));
					}
					Promise.all(prom_list).then(async (rs) => {
						let bool_val = true;
						for (let i = 0; i < rs.length; i++) {
							bool_val = bool_val && (rs[i].rowCount === 1);
						}
						if (bool_val) {
							let last = await pg_pool.query(query3, [id]);
							if (last.rowCount === 1) {
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