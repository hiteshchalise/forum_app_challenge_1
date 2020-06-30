const _ = require('lodash');
const express = require("express");
const { User } = require("../model/User");
const Joi = require('@hapi/joi');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();

const validateAuth = (req) => {
  const schema = Joi.object({
    email: Joi.string().max(255).pattern(new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')).required().email(),
    password: Joi.string().min(6).max(1024).required()
  });

  return schema.validate(req);
}

// @route POST api/auth/
// @desc Authenticate user
// @access Public
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "No user by that email" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ msg: "Invalid Credential" });

  const refreshToken = user.generateRefreshToken();
  const authToken = user.generateAuthToken();

  res.cookie("refreshToken", refreshToken, {
    expiresIn: Date.now() + 99999999999,
    httpOnly: true,
    sameSite: "strict"
  }).json({
    authToken,
    user: _.pick(user, ['_id', 'name', 'email', 'upvoted_posts', 'upvoted_comments'])
  });
});

router.get("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ msg: "Invalid refreshtoken" });

  const { id } = jwt.verify(refreshToken, config.get("REFRESH_TOKEN"));
  const user = await User.findOne({ _id: id });
  if (!user) return res.status(400).json({ msg: "No user found" });

  const authToken = user.generateAuthToken();
  return res.json({
    authToken,
    user: _.pick(user, ['_id', 'name', 'email', 'upvoted_posts', 'upvoted_comments'])
  });
});

router.post("/logout", (req, res) => {
  res.cookie("refreshToken", "InValidCookie", {
    expiresIn: Date.now(),
    httpOnly: true,
    sameSite: "strict"
  });

  res.json({ msg: "cookie distroyed" })
});

module.exports = router;
