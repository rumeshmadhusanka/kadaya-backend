const pg_pool = require('../middleware/db');
const bcrypt = require('bcryptjs');

class Buyer {
    async getAll() {
        let query_str = "SELECT buyer_id,name,email,address,phone,latitude,longitude FROM public.buyer";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str);
                console.log(rows);
                resolve(rows);

            } catch (e) {
                reject(e)

            }

        })

    }

    async getByFirebaseId(buyer_id) {
        let query_str = "SELECT buyer_id,name,email,address,phone,latitude,longitude FROM public.buyer where buyer_id=($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str, [buyer_id]);
                console.log(rows);
                resolve(rows);

            } catch (e) {
                reject(e)

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
                reject(e)

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
                reject(e)

            }

        })

    }

    async updateProfile(buyer_id, name, email, address, phone) {

        let query_str = "UPDATE public.buyer set name=COALESCE(($2),name), email=COALESCE(($3),email), address=COALESCE(($4),address), phone=COALESCE(($5),phone) where buyer_id = ($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str, [buyer_id, name, email, address, phone]);
                console.log(rows);
                resolve(rows);

            } catch (e) {
                reject(e)

            }

        })
    }

    async updateLocation(buyer_id, lat, long) {
        let query_str = "UPDATE public.buyer set latitude=COALESCE(($2),latitude), longitude=COALESCE(($3),longitude) where buyer_id = ($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str, [buyer_id, lat, long]);
                console.log(rows);
                resolve(rows);

            } catch (e) {
                reject(e)

            }

        })
    }

    async login(phone, password) {
        let query_str = "SELECT * from buyer where phone=($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str, [phone.toString()]);
                if (rows.length===0) {
                    reject(new Error("Invalid username"))
                } else {
                    rows = rows[0];
                    let hashedPassword = rows.password;
                    let result = await bcrypt.compare(password, hashedPassword);
                    if (result === true) {
                        delete rows.password;
                        console.log(rows);
                        resolve(rows);
                    } else {
                        reject(new Error("Invalid password"))
                    }
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    async signup(buyer_id, name, email, address, phone, latitude, longitude, password) {
        let query_str = "INSERT INTO public.buyer(buyer_id, name, email, address, phone, latitude, longitude, password) values (($1),($2),($3),($4),($5),($6),($7),($8))";
        return new Promise(async (resolve, reject) => {
            try {
                let result = await pg_pool.query(query_str, [buyer_id, name, email, address, phone, latitude, longitude, password]);
                console.log(result);
                resolve(result);

            } catch (e) {
                console.log(e);
                reject(e)
            }
        })
    }


}

module.exports = Buyer;