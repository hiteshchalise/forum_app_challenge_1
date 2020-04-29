const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();
const auth = require("./../../middleware/auth");
const Post = require("../../model/Post");


// User Model
const User = require("../../model/User");

// @route POST api/users
// @desc Register new user
// @access Public
router.post("/", (req, res) => {
  const { name, email, password } = req.body;
  console.log("name: " + name + " email: " + email + " password: " + password);

  if (!name || !email || !password) {
    return res.status(400).json({
      msg: "Please enter all field",
    });
  }
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!name.match(usernameRegex)) {
    return res.status(400).json({
      msg: "invalid username"
    })
  }
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!email.match(emailPattern)) {
    return res.status(400).json({
      msg: "invalid email"
    })
  }

  if (!(password.length > 6)) {
    return res.status(400).json({
      msg: "password too short, should be more than 6 Character."
    })
  }

  User.findOne({ email: email }).then((user) => {
    if (user) return res.status(400).json({ msg: "User Already Exists" });

    const newUser = new User({
      name,
      email,
      password
    });

    // Create Salt & Hash
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(newUser.password, salt, (error, hash) => {
        if (error) throw error;
        newUser.password = hash;
        newUser.save()
          .then(user => {

            jwt.sign({ id: user._id }, config.get("REFRESH_TOKEN"), (error, refreshToken) => {
              if (error) throw error;

              res.cookie("refreshToken", refreshToken, {
                expiresIn: Date.now() + 999999999999,
                httpOnly: true
              });
              console.log("cookie is set");
            })

            jwt.sign({ id: user._id }, config.get("ACCESS_TOKEN_SECRET"), { expiresIn: 3600 }, (error, token) => {
              if (error) throw error;
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
          .catch((error) => { throw error; });
      })
    })


  });
});

// @route GET api/users/:name
// @desc GET user by username
// @access Public
router.get("/:name", (req, res) => {
  User.findOne({ name: req.params.name }).then(user => {
    if (!user) res.status(400).json({
      "msg": "User Not Found"
    })

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  })
})

// @route POST api/users/upvote
// @desc Register new user
// @access Public
router.post("/upvote", auth, (req, res) => {
  console.log(req.body);
  const { postId, dir } = req.body
  if (!postId || !dir) {
    return res.status(400).json({ msg: "bad request, include postId or dir" });
  }

  if (dir !== 1 && dir !== 0 && dir !== -1) {
    return res.status(400).json({ msg: "bad request, dir is invalid" });
  }


  User.findById(req.user.id, (error, user) => {
    if (error) return res.status(400).json({ msg: "no user found" });
    Post.findById(postId, (error, post) => {
      if (error) return res.status(400).json({ msg: "no post by Id" });

      upvotedPost = user.upvoted_posts.find((upvoted_post) => {
        if (upvoted_post.postId === postId) return true;
        return false;
      });

      if (upvotedPost === undefined) {
        user.upvoted_posts.push({ postId, upvote_dir: dir });
        post.upvotes += dir;
        res.json({ msg: `upvoted with ${dir}` })
      } else {
        if (upvotedPost.upvote_dir === dir) {
          post.upvotes -= dir;
          upvotedPost.upvote_dir -= dir;
        } else {
          post.upvotes += dir;
          upvotedPost.upvote_dir += dir;
          res.json({ msg: `upvoted with ${dir}` })
        }
        res.json({ msg: `upvoted with ${upvotedPost.upvote_dir}` })
      }

      user.save().then((result) => { console.log(result) }).catch((error) => { console.log(error) });
      post.save().then((result) => { console.log(result) }).catch((error) => { console.log(error) });

    });
  })
})

module.exports = router;
