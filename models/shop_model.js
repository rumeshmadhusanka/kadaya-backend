const pg_pool = require('../middleware/db');
const bcrypt = require('bcryptjs');

class Shop {

    async getShopById(shop_id){
        //todo remove password from result set
        let query_str = "SELECT shop_id, name, address, latitude, longitude, comments, photo_id, email, category, open_hours, is_open, contact_numbers FROM public.shop where shop_id=($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str,[shop_id]);
                console.log(rows);
                resolve(rows);
            } catch (e) {
                reject(e)
            }

        })

    }
    async getAllShops(){
        //todo remove password from result set
        let query_str = "SELECT shop_id, name, address, latitude, longitude, comments, photo_id, email, category, open_hours, is_open, contact_numbers FROM public.shop";
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

    async getAllShopsByCategory(category){
        //todo remove password from result set
        let query_str = "SELECT shop_id, name, address, latitude, longitude, comments, photo_id, email, category, open_hours, is_open, contact_numbers FROM public.shop where category=($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str,[category]);
                console.log(rows);
                resolve(rows);
            } catch (e) {
                reject(e)
            }

        })
    }

    async getShopsNearLocation(lat, long, radius) {
        // 6.420076, 80.002647
        //todo remove password from result set
        let query_str = "SELECT shop_id, name, address, latitude, longitude, comments, photo_id, email, category, open_hours, is_open, contact_numbers FROM public.shop where cal_distance(($1),($2),public.shop.latitude,public.shop.longitude) < ($3)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str,[lat,long,radius]);
                console.log(rows);
                resolve(rows);
            } catch (e) {
                reject(e)

            }

        })

    }


    async getShopsNearLocationByCategory(lat, long, radius, category){
        //todo remove password from result set
        let query_str = "SELECT shop_id, name, address, latitude, longitude, comments, photo_id, email, category, open_hours, is_open, contact_numbers FROM public.shop where cal_distance(($1),($2),public.shop.latitude,public.shop.longitude) < ($3) and category =($4)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str,[lat,long,radius,category]);
                console.log(rows);
                resolve(rows);
            } catch (e) {
                reject(e)

            }

        })
    }

    //this doesn't update password, location, or photo
    async updateProfile(shop_id, name,address,comments,owner_name, email, phone, category,open_hours,is_open,contact_numbers) {

        let query_str = "UPDATE public.shop set name=COALESCE(($1),name), address=COALESCE(($2),address),comments=COALESCE(($3),comments), owner_name=COALESCE(($4),owner_name), email=COALESCE(($5),email), phone=COALESCE(($6),phone), category=COALESCE(($7),category),open_hours=COALESCE(($8),open_hours),is_open=COALESCE(($9),is_open),contact_numbers=COALESCE(($10),contact_numbers) where shop_id = ($11)";
        return new Promise(async (resolve, reject) => {
            try {
                let result = await pg_pool.query(query_str, [name,address,comments,owner_name, email, phone, category,open_hours,is_open,contact_numbers,shop_id]);
                console.log(result);
                resolve(result);

            } catch (e) {
                reject(e)

            }

        })
    }

    async updateLocation(shop_id,latitude,longitude){
        let query_str = "UPDATE public.shop set latitude=COALESCE(($1),latitude), longitude=COALESCE(($2),longitude) where shop_id=($3)";
        return new Promise(async (resolve, reject) => {
            try {
                let result = await pg_pool.query(query_str, [latitude,longitude,shop_id]);
                resolve(result);
            } catch (e) {
                reject(e)

            }

        })
    }

    async getPassword(shop_id){
        let query_str = "SELECT password from public.shop where shop_id=($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str, [shop_id]);
                console.log(rows);
                resolve(rows)
            } catch (e) {
                reject(e)
            }
        })
    }

    async updatePassword(shop_id,new_pw_hash){
        let query_str = "UPDATE public.shop set password=($1) where shop_id=($2)";
        return new Promise(async (resolve, reject) => {
            try {
                let result = await pg_pool.query(query_str, [new_pw_hash, shop_id]);
                //console.log(result);
                resolve(result);

            } catch (e) {
                reject(e)

            }

        })

    }

    async login(phone, password) {
        let query_str = "SELECT * from shop where phone=($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let result1 = await pg_pool.query(query_str, [phone.toString()]);
                console.log(result1.rows)
                if (result1.rowCount===0) {
                    reject(new Error("Invalid password or phone"));
                } else {
                    let rows = result1.rows[0];
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



    async addNewShop(id, name, address, latitude, longitude, comments, photo_id, owner_name, email, password, phone, category,open_hours,is_open,contact_numbers){
        let query_str = "INSERT INTO public.shop(shop_id, name, address, latitude, longitude, comments, photo_id, owner_name, email, password, phone, category,open_hours,is_open,contact_numbers) values (($1),($2),($3),($4),($5),($6),($7),($8),($9),($10),($11),($12),($13),($14),($15))";
        return new Promise(async (resolve, reject) => {
            try {
                let result = await pg_pool.query(query_str,[id, name, address, latitude, longitude, comments, photo_id, owner_name, email, password, phone, category,open_hours,is_open,contact_numbers]);
                console.log(result);
                resolve(result);
            } catch (e) {
                reject(e)

            }

        })
    }
}

module.exports = Shop;