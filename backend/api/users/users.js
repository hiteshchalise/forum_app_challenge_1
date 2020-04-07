const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();

// User Model
const User = require("../../model/User");

// @route POST api/users/users
// @desc Register new user
// @access Public
router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      msg: "Please enter all field",
    });
  }

  User.findOne({ email: email }).then((user) => {
    if (user) return res.status(400).json({ msg: "User Already Exists" });

    const newUser = new User({
        name,
        email,
        password
    });

    // Create Salt & Hash
    bcrypt.genSalt(10, (error, salt)=>{
        bcrypt.hash(newUser.password, salt, (error, hash)=>{
            if(error) throw error;
            newUser.password = hash;
            newUser.save()
            .then(user=>{
              jwt.sign({id: user._id}, config.get("ACCESS_TOKEN_SECRET"), {expiresIn: 3600}, (error, token)=>{
                if(error) throw error;
                res.json({
                  token,
                    user: {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email
                    }
                });
              });
            })
            .catch((error)=>{throw error;});
        })
    })


  });
});

router.get("/:name", (req, res)=>{
  User.findOne({name: req.params.name}).then(user => {
    if(!user) res.status(400).json({
      "msg": "User Not Found"
    })

    res.json({user: {
      id: user._id,
      name: user.name,
      email: user.email
    }});
  })
})

module.exports = router;
