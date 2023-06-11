const express = require("express");
const bodyParser = require("body-parser");
require("./db/conn.js");
require("./db/schema/user.js");
const authRouter = require("./routes/authRouter.js");
const requireToken = require("./middleware/authTokenRequest.js");

const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(authRouter);

app.get("/", requireToken, function (req, res) {
  // res.send("Welcome Zeeshan Nawaz");
  console.log(req.user);
  res.send(req.user);
});

app.post("/signup", function (req, res) {
  const username = req.body;
  res.send(username);
  console.log("🚀 ~ file: index.js:14 ~ username:", username);
});

app.listen(port, function () {
  console.log("Listen on port " + port);
});
