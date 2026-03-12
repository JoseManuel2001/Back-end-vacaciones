const { config } = require("dotenv");
const path = require('path');

config({ path: path.resolve(__dirname, '../.env')});

module.exports = {
  server: process.env.SERVER || "",
  database: process.env.DATABASE || "",
  user: process.env.USER || "",
  password: process.env.PASSWORD || "",
  port: Number(process.env.PORT) || "",
};
