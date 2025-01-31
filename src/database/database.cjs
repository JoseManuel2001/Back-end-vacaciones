const mysql = require ('mysql2/promise');
const config = require ('../config.cjs');

const pool = mysql.createPool({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
    port: config.port
});

const getConnection = async () => {
    return await pool.getConnection();
};

module.exports =  { getConnection };
