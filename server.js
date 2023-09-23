const app = require("./app");
const dotenv = require("dotenv");
const main = require("./config/databaseconect");
dotenv.config({ path: "config/config.env" });
process.on("uncaughtException", (err) => {
  console.log(`Error :${err.message}`);
  console.log("shuttng down the server due to uncaughtException");
  process.exit(1);
});

//conecting mongodb
main();
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port${process.env.PORT}`);
});

//unhandled Promise Rejection error
process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log("shutting down the server due to undhandled Promise Rejection");
  server.close(() => {
    process.exit();
  });
});
