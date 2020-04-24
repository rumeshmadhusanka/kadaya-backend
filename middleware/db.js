const { Pool } = require('pg');

const conf = {
    "connectionString":process.env.DATABASE_URL
};

const pool = new Pool(conf);

module.exports = pool;