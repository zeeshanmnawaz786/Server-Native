const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

require("dotenv").config();

router.post("/signup", function (req, res) {
  const { name, email, password, dob } = req.body;

  if (!name || !email | !password || !dob) {
    return res.status(422).send({ error: "please fill all required fields" });
  } else {
    User.findOne({ email: email }).then(async function (savedUser) {
      if (savedUser) {
        return res.status(422).send({ error: "Invalid Credentials" });
      }
      const user = new User({
        name,
        email,
        password,
        dob,
      });

      try {
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
        res.send({ user: user, token: token });
      } catch (error) {
        console.log(error);
        return res.status(400).send({ error: error.message });
      }
    });
  }
});

router.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(403).send({ error: "please add email or password" });
  }

  const savedUser = await User.findOne({ email: email });

  if (!savedUser) {
    res.status(422).send({ error: "Invalid Credentials" });
  }

  try {
    bcrypt.compare(password, savedUser.password, function (err, result) {
      if (result) {
        console.log("password matched");
        const token = jwt.sign(
          { _id: savedUser._id },
          process.env.JWT_SECRET_KEY
        );
        res.send({ token });
      } else {
        res.status(422).send({ error: "Invalid Credentials" });
      }
    });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
