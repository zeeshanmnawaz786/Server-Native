const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = function (req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).send({
      error: "You must be logged in. Authorization header not provided.",
    });
  }

  const token = authorization;
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return res
        .status(403)
        .send({ error: "You must be logged in. Invalid token." });
    }

    const { _id } = payload;
    User.findById(_id).then((userData) => {
      req.user = userData;
      next();
    });
  });
};
