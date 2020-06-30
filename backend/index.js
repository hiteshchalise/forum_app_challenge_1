require('express-async-errors');
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("config");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const db = config.get("mongoURI");
console.log(db);
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log("mongodb Connected"))
  .catch((error) => console.log(error));

app.use("/api/posts", require("./route/posts"));
app.use("/api/users", require("./route/users"));
app.use("/api/auth", require("./route/auth"));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = server;