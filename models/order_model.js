const pg_pool = require('../middleware/db');
const Buyer = require('./buyer_model');

let buyer_obj1 = new Buyer();
class Order {
     getOrderHistoryById(buyer_id){
         return buyer_obj1.getBuyingHistory(buyer_id)
     }
    getOngoingOrdersById(buyer_id){
         return buyer_obj1.getOngoingOrders(buyer_id)
    }


    async createNewOrder(){

    }

    async updateOrderStatus(){

    }

    async deleteOrder(){

    }

}

module.exports = Order;