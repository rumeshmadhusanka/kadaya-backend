const pg_pool = require('../middleware/db');

class Category {
    async getAll() {
        let query_str = "SELECT id,name FROM public.category";
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

    async getAllShopsByCategory() {
        let categories = await this.getAll();
        let category_ids = [];
        for (let i = 0; i < categories.length; i++) {
            category_ids.push(categories[i].id)
            console.log(categories[i]["name"])
        }
        console.log(category_ids);
        let query_str = "SELECT * from public.shop inner join category on shop.category_id = category.id where category_id = ($1)";

        return new Promise(async (resolve, reject) => {
            try {
                let results = {};
                for (let i = 0; i < category_ids.length; i++) {
                    console.log(categories[i]["name"].toString());
                    results[categories[i].name.toString()] = [];
                    let {rows} = await pg_pool.query(query_str, [category_ids[i]]);
                    results[categories[i].name.toString()].push(...rows)
                }
                console.log(categories[0].name);
                console.log(results);
                resolve(results);

            } catch (e) {
                reject({
                    "status_code": 502,
                    "message": e.toString()
                })

            }

        })
    }

    async getNearToLocation() {
        let query_str = "SELECT id,name FROM public.category";
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



}

module.exports = Category;