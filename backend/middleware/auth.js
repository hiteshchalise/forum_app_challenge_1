const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token)
    return res.status(401).json({ msg: "No token, authorization deneid" });

  try {
    const decoded = jwt.verify(token, config.get("ACCESS_TOKEN_SECRET"));
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ msg: "token not valid" });
  }
}

module.exports = auth;
