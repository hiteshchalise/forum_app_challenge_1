const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../model/Post");


// User Model
const User = require("../model/User");

// @route POST api/users
// @desc Register new user
// @access Public
router.post("/", (req, res) => {
  const { name, email, password } = req.body;
  console.log("name: ", name, " email: ", email, " password: ", password);

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
    if (!user) return res.status(400).json({
      "msg": "User Not Found"
    })

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        upvoted_posts: user.upvoted_posts
      }
    });
  })
})

// @route POST api/users/upvote
// @desc POST upvote
// @access Private
router.post("/upvote", auth, (req, res) => {
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
        res.json({ dir, upvotes: post.upvotes })
      } else {
        if (upvotedPost.upvote_dir === dir) {
          post.upvotes -= dir;
          upvotedPost.upvote_dir -= dir;
        } else {
          post.upvotes += dir;
          upvotedPost.upvote_dir += dir;
        }
        res.json({ postId, dir: upvotedPost.upvote_dir, upvotes: post.upvotes })
      }

      user.save().then((result) => { console.log(result) }).catch((error) => { console.log(error) });
      post.save().then((result) => { console.log(result) }).catch((error) => { console.log(error) });

    });
  })
});

// @route POST api/users/upvote/comment
// @desc POST upvote comments
// @access Private
router.post("/upvote/comment", auth, (req, res) => {
  const { postId, commentId, dir } = req.body;
  console.log("PostId: ", postId, "commentId: ", commentId, "dir: ", dir);

  if (!postId || !dir || !commentId) {
    return res.status(400).json({ msg: "bad request, include postId or dir" });
  }

  if (dir !== 1 && dir !== 0 && dir !== -1) {
    return res.status(400).json({ msg: "bad request, dir is invalid" });
  }

  User.findById(req.user.id, (error, user) => {
    if (error) return res.status(400).json({ msg: "no user found" });
    Post.findById(postId, (error, post) => {
      if (error) return res.status(400).json({ msg: "no post by Id" });

      const upvotedCommentPost = user.upvoted_comments.find(upvoted_comment => upvoted_comment.postId === postId);
      const comment = post.comments.find(comment => {
        return comment._id.toString() === commentId
      });

      if (upvotedCommentPost === undefined) {
        user.upvoted_comments.push({
          postId: postId,
          comments: [{
            commentId: commentId,
            upvote_dir: dir
          }]
        });
        comment.upvotes += dir;
        res.json({ postId, commentId, dir, upvotes: comment.upvotes })
      } else {
        const upvotedComment = upvotedCommentPost.comments.find(
          comment => comment.commentId === commentId
        );
        if (upvotedComment === undefined) {
          upvotedCommentPost.comments.push({
            commentId: commentId,
            upvote_dir: dir
          });
          comment.upvotes += dir;
          res.json({ postId, commentId, dir: dir, upvotes: comment.upvotes })
        } else {
          if (upvotedComment.upvote_dir === dir) {
            console.log("same");
            comment.upvotes -= dir;
            upvotedComment.upvote_dir -= dir;
          } else {
            console.log("different");
            comment.upvotes += dir;
            upvotedComment.upvote_dir += dir;
          }
          res.json({ postId, commentId, dir: upvotedComment.upvote_dir, upvotes: comment.upvotes });
        }
      }
      user.save().then((result) => { console.log(result) }).catch((error) => { console.log(error) });
      post.save().then((result) => { console.log(result) }).catch((error) => { console.log(error) });
    });

  });
});

module.exports = router;
