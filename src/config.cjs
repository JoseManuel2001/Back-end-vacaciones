const { config } = require("dotenv");

config();

module.exports = {
  server: process.env.SERVER || "",
  database: process.env.DATABASE || "",
  user: process.env.USER || "",
  password: process.env.PASSWORD || "",
  port: Number(process.env.PORT) || "",
};
