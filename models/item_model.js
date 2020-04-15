const pg_pool = require('../middleware/db');

class Item {
    //all items in all shops
    async getAllItems() {
        let query_str = "SELECT * FROM public.item";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str);
                //console.log(rows);
                resolve(rows);
            } catch (e) {
                reject(e)
            }
        })
    }

    async getAllItemsInAShop(shop_id) {
        let query_str = "SELECT * FROM public.item where shop_id=($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str, [shop_id]);
                //console.log(rows);
                resolve(rows);
            } catch (e) {
                reject(e)
            }
        })
    }

    //have to implement full text search with multiple languages
    //todo order by location
    async findItemByName(keyword) {
        let query_str = 'SELECT * FROM public.item where to_tsvector(name) @@ to_tsquery(($1)) union SELECT * FROM public.item where to_tsvector(description) @@ to_tsquery(($1))';
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str, [keyword]);
                console.log(rows);
                resolve(rows);
            } catch (e) {
                reject(e)
            }
        })
    }


    async createNewItem(id, name, description, amount_available, shop_id, price, photo_id, unit) {
        let query_str = "INSERT INTO public.item (id, name, description, amount_available, shop_id, price, photo_id, unit) values (($1),($2),($3),($4),($5),($6),($7),($8))";
        return new Promise(async (resolve, reject) => {
            try {
                let result = await pg_pool.query(query_str, [id, name, description, amount_available, shop_id, price, photo_id, unit]);
                //console.log(rows);
                resolve(result);
            } catch (e) {
                reject(e)
            }
        })
    }

    async removeItem(id) {
        let query_str = "DELETE FROM public.item where id=($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let result = await pg_pool.query(query_str, [id]);
                //console.log(rows);
                resolve(result);
            } catch (e) {
                reject(e)
            }
        })
    }

    //id,shop_id, photo_id cannot be changed from here
    async updateItem(name, description, amount_available, price, unit,id) {
        let query_str = "UPDATE public.item set name=COALESCE(($1),name),description=COALESCE(($2),description), amount_available=COALESCE(($3),amount_available), price=COALESCE(($4),price),unit=COALESCE(($5),unit) where id=($6)";
        return new Promise(async (resolve, reject) => {
            try {
                let result = await pg_pool.query(query_str, [name, description, amount_available, price, unit,id]);
                //console.log(rows);
                resolve(result);
            } catch (e) {
                reject(e)
            }
        })
    }

    async updateAmountAvailable(item_id, current_amount) {
        let query_str = "UPDATE public.item set amount_available=($1) where id=($2)";
        return new Promise(async (resolve, reject) => {
            try {
                let result = await pg_pool.query(query_str, [current_amount, item_id]);
                //console.log(rows);
                resolve(result);
            } catch (e) {
                reject(e)
            }
        })
    }


}


module.exports = Item;