const pg_pool = require('../middleware/db');

class Shop {
    async getAllShops(){
        let query_str = "SELECT * FROM public.shop";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str);
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

    async getAllShopsByCategoryId(category_id){
        let query_str = "SELECT * FROM public.shop where category_id=($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str,[category_id]);
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

    async getShopsNearLocation(lat, long, radius) {
        // 6.420076, 80.002647
        let query_str = "SELECT * FROM public.shop where cal_distance(($1),($2),public.shop.latitude,public.shop.longitude) < ($3)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str,[lat,long,radius]);
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

    //todo By category id or name?
    async getShopsNearLocationByCategory(lat, long, radius, category_id){
        let query_str = "SELECT * FROM public.shop where cal_distance(($1),($2),public.shop.latitude,public.shop.longitude) < ($3) and category_id =($4)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str,[lat,long,radius,category_id]);
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


    //todo handle photo adding when sign in
    async addNewShop(firebase_id, name, address, latitude, longitude, comments, photo_id, owner_name, email, password, phone, category_id){
        let query_str = "INSERT INTO public.shop(shop_id, name, address, latitude, longitude, comments, photo_id, owner_name, email, password, phone, category_id) values (($1),($2),($3),($4),($5),($6),($7),($8),($9),($10),($11),($12))"
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str,[firebase_id, name, address, latitude, longitude, comments, photo_id, owner_name, email, password, phone, category_id]);
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

module.exports = Shop;