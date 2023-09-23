const mongoose = require("mongoose");

const main = async () => {
  try {
    //connecting to database
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log("DataBase Connected successfully");
  } catch (err) {
    console.error(`Error connecting ${err}`);
  }
};
module.exports = main;
