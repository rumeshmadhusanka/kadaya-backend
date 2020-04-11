const pg_pool = require('../middleware/db');
const bcrypt = require('bcryptjs');

class Buyer {
    async getAll() {
        let query_str = "SELECT buyer_id,name,email,address,phone,latitude,longitude FROM public.buyer";
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
        let query_str = "SELECT buyer_id,name,email,address,phone,latitude,longitude FROM public.buyer where buyer_id=($1)";
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

    async addNewBuyer(buyer_id, name, email, address, phone, latitude, longitude) {
        let query_str = "INSERT INTO public.buyer(buyer_id, name, email, address, phone, latitude, longitude) values (($1),($2),($3),($4),($5),($6),($7)) on conflict(buyer_id) do update set name=($2), email=($3), address=($4), phone=($5), latitude=($6), longitude=($7)";
        return new Promise(async (resolve, reject) => {
            try {
                let result = await pg_pool.query(query_str, [buyer_id, name, email, address, phone, latitude, longitude]);
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

    async updateProfile(firebase_id, name, email, address, phone, latitude, longitude) {

        let query_str = "UPDATE public.buyer set name=COALESCE(($2),name), email=COALESCE(($3),email), address=COALESCE(($4),address), phone=COALESCE(($5),phone), latitude=COALESCE(($6),latitude), longitude=COALESCE(($7),longitude) where buyer_id = ($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str, [firebase_id, name, email, address, phone, latitude, longitude]);
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

    async updateLocation(firebase_id, lat, long) {
        let query_str = "UPDATE public.buyer set latitude=COALESCE(($2),latitude), longitude=COALESCE(($3),longitude) where buyer_id = ($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str, [firebase_id, lat, long]);
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

    async login(phone, password) {
        let query_str = "SELECT * from buyer where phone=($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str, [phone.toString()]);
                if (rows == null) {
                    reject({
                        "status_code": 404,
                        "message": "Invalid password or phone number"
                    })
                } else {
                    rows = rows[0];
                    let hashedPassword = rows.password;
                    let result = await bcrypt.compare(password, hashedPassword);
                    if (result === true) {
                        delete rows.password;
                        resolve(rows);
                    } else {
                        reject({
                            "status_code": 404,
                            "message": "Invalid password"
                        })
                    }
                }
            } catch (e) {
                reject({
                    "status_code": 502,
                    "message": e.toString()
                })
            }
        })
    }

    async signup(buyer_id, name, email, address, phone, latitude, longitude, password) {
        let query_str = "INSERT INTO public.buyer(buyer_id, name, email, address, phone, latitude, longitude, password) values (($1),($2),($3),($4),($5),($6),($7),($8))";
        return new Promise(async (resolve, reject) => {
            try {
                let result = await pg_pool.query(query_str, [phone.toString()]);
                resolve(result);

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