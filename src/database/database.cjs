const sql = require("mssql");
const config = require("../config.cjs");

const pool = new sql.ConnectionPool({
  user: config.user,
  password: config.password,
  server: config.server,
  database: config.database,
  port: config.port,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});

const poolConnect = pool.connect();

const getConnection = async () => {
  await poolConnect;
  return pool;
};

module.exports = { getConnection, sql };
