const pg_pool = require('../middleware/db');

class Buyer {
    async getAll() {
        let query_str = "SELECT firebase_id,name,email,address,phone,latitude,longitude FROM public.buyer";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str);
                console.log(rows)
                resolve(rows);

            } catch (e) {
                reject({
                    "status_code": 502,
                    "message": e.toString()
                })

            }

        })

    }

    async getByFirebaseId(buyer_id) {
        let query_str = "SELECT firebase_id,name,email,address,phone,latitude,longitude FROM public.buyer where firebase_id=($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str, [buyer_id]);
                console.log(rows);
                resolve(rows);

            } catch (e) {
                reject({
                    "status_code": 502,
                    "message": e.toString()
                })

            }

        })

    }

    async addNewBuyer(firebase_id, name, email, address, phone, latitude, longitude){
        let query_str = "INSERT INTO public.buyer(firebase_id, name, email, address, phone, latitude, longitude) values (($1),($2),($3),($4),($5),($6),($7))";
        return new Promise(async (resolve, reject) => {
            try {
                let result = await pg_pool.query(query_str, [firebase_id, name, email, address, phone, latitude, longitude]);
                console.log(result);
                resolve(result);

            } catch (e) {
                reject({
                    "status_code": 502,
                    "message": e.toString()
                })

            }

        })
    }

    async getBuyingHistory(buyer_id) {
        let query_str = "SELECT id,shop_id,message_body,started,last_updated_timestamp,state FROM public.order where buyer_id=($1) AND state='COMPLETED'";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str, [buyer_id]);
                console.log(rows);
                resolve(rows);

            } catch (e) {
                reject({
                    "status_code": 502,
                    "message": e.toString()
                })

            }

        })

    }

    async getOngoingOrders(buyer_id) {
        let query_str = "SELECT id,shop_id,message_body,started,last_updated_timestamp,state FROM public.order where buyer_id=($1) AND state!='COMPLETED'";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str, [buyer_id]);
                console.log(rows);
                resolve(rows);

            } catch (e) {
                reject({
                    "status_code": 502,
                    "message": e.toString()
                })

            }

        })

    }

}

module.exports = Buyer;