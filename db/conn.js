const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(function () {
    console.log("connected to database");
  })
  .catch(function () {
    console.log("connected failed!");
  });
