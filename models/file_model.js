const pg_pool = require('../middleware/db');

class FileUpload {
	async saveUploadUrl(url, shop_id) {
		let query_str = "INSERT INTO  public.shop_photos(shop_id, url) values (($2),($1))";
		return new Promise(async (resolve, reject) => {
			try {
				let result = await pg_pool.query(query_str, [url, shop_id]);
				console.log("URL");
				console.log(result);
				if (result.rowCount === 1) {
					resolve(result.rowCount);
				} else {
					reject(new Error("Could not upload"))
				}
			} catch (e) {
				reject(e)

			}

		})
	}

	async getAllImageKeysOfAShop(shop_id) {
		let query_str = "SELECT * FROM public.shop_photos where shop_id=($1)";
		return new Promise(async (resolve, reject) => {
			try {
				let {rows} = await pg_pool.query(query_str, [shop_id]);
				console.log(rows);
				resolve(rows);
			} catch (e) {
				reject(e)
			}
		})
	}
}

module.exports = FileUpload;