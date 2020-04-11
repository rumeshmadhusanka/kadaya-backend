const pg_pool = require('../middleware/db');
const Buyer = require('./buyer_model');

let buyer_obj1 = new Buyer();
class Order {
     getOrderHistoryByFirebaseId(buyer_id){
         return buyer_obj1.getBuyingHistory(buyer_id)
     }
    getOngoingOrdersByFirebaseId(buyer_id){
         return buyer_obj1.getOngoingOrders(buyer_id)
    }

    async createNewOrder(){

    }

    async updateOrderStatus(){

    }

}

module.exports = Order;