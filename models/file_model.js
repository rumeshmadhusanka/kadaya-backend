const pg_pool = require('../middleware/db');

class FileUpload{
    async saveUploadUrl(url,shop_id){
        let query_str = "UPDATE public.shop set photo_id=($1)  where shop_id=CAST ( $2 AS varchar )";
        return new Promise(async (resolve, reject) => {
            try {
                let {rows} = await pg_pool.query(query_str,[url,shop_id]);
                console.log("URL");
                console.log(rows);
                resolve(rows);

            } catch (e) {
                reject(e)

            }

        })
    }

    async getAllImageKeysOfAShop(shop_id){
        let query_str = "SELECT * FROM public.shop_photos where shop_id=($1)";
        return new Promise(async (resolve, reject) => {
            try {
                let result = await pg_pool.query(query_str, [shop_id]);
                console.log(result);
                resolve(result);
            } catch (e) {
                reject(e)
            }
        })
    }
}
module.exports = FileUpload;