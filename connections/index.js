const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<databaseName>", process.env.DATABASE_NAME
).replace(
  "<password>", process.env.DATABASE_PASSWORD
);

mongoose.connect(DB)
  .then(
    () => { console.log("資料連線成功"); }
  )
  .catch(
    error => { console.log(error.reason); }
  )