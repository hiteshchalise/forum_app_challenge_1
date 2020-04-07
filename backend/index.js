const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const db = config.get("mongoURI") ;
mongoose
  .connect(db, {useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex:true})
  .then(() => console.log("mongodb Connected"))
  .catch((error) => console.log(error));

app.use("/api/posts", require("./api/posts/posts"));
app.use("/api/users", require("./api/users/users"));
app.use("/api/auth", require("./api/auth/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
