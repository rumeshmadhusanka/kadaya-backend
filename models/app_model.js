const pg_pool = require('../middleware/db');


class AppUpdate {
	async getVersion(){
		let query_str = "SELECT version from public.app";
		return new Promise(async (resolve, reject) => {
			try {
				let {rows} = await pg_pool.query(query_str);
				console.log(rows);
				resolve(rows[0]);
			} catch (e) {
				reject(e)

			}

		})
	}
}

module.exports = AppUpdate;