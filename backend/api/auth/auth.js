const express = require("express");
const uuid = require("uuid");
const User = require("../../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const router = express.Router();

// @route POST api/auth/auth
// @desc Authenticate user
// @access Public
router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Please enter all fields" });

  User.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ msg: "No user by that email" });

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid Credential" });

      jwt.sign(
        { id: user.id },
        config.get("REFRESH_TOKEN"),
        (error, refreshToken) => {
          if (error) throw error;
          res.cookie("refreshToken", refreshToken, { httpOnly: true });
          console.log("cookie is set");
        }
      );

      jwt.sign(
        { id: user._id },
        config.get("ACCESS_TOKEN_SECRET"),
        { expiresIn: 3600 },
        (error, token) => {
          if (error) throw error;
          res.json({
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
            },
          });
        }
      );
    });
  });
});

router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    res
      .status(401)
      .json({ msg: "invalid refreshtoken, refresh action denied" });

  try {
    const decoded = jwt.verify(refreshToken, config.get("REFRESH_TOKEN"));
    User.findOne({ _id: decoded.id }).then((user) => {
      if (!user) return res.status(400).json({ msg: "No user found" });

      jwt.sign(
        { id: user._id },
        config.get("ACCESS_TOKEN_SECRET"),
        { expiresIn: 3600 },
        (error, token) => {
          if (error) throw error;
          res.json({
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
            },
          });
        }
      );
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "Token not valid" });
  }
});

module.exports = router;
