const { Pool } = require('pg');

let pgConfig ={
    user: process.env.POSTGRESQL_USER,
    host: process.env.POSTGRESQL_HOST,
    database: process.env.POSTGRESQL_DATABASE,
    password: process.env.POSTGRESQL_PASSWORD,
    port: process.env.POSTGRESQL_PORT,
    // ssl: process.env.POSTGRESQL_SSL,
    // rejectUnauthorized: process.env.POSTGRESQL_REJECT_UNAUTORIZED
};

const pool = new Pool(pgConfig);

module.exports = pool;