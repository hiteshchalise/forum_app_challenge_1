const _ = require('lodash');
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const router = express.Router();
const auth = require("../middleware/auth");
const { Post } = require("../model/Post");
const { User, validateUser } = require("../model/User");

// @route POST api/users
// @desc Register new user
// @access Public
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ msg: "User Already Exists" });

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const refreshToken = user.generateRefreshToken();
  const authToken = user.generateAuthToken();

  return res.cookie("refreshToken", refreshToken, {
    expiresIn: Date.now() + 999999999999,
    httpOnly: true
  }).json({
    authToken,
    user: _.pick(user, ['_id', 'name', 'email'])
  });
});

// @route GET api/users/:name
// @desc GET user by username
// @access Public
router.get("/:name", async (req, res) => {
  const user = await User.findOne({ name: req.params.name });
  if (!user) return res.status(404).json({ "msg": "User Not Found" })

  res.json(_.pick(user, ['_id', 'name', 'email', 'upvoted_posts']));
});

// @route POST api/users/upvote
// @desc POST upvote when user wants to upvote or downvote a post
// @access Private
router.post("/upvote", auth, async (req, res) => {
  const { postId, dir } = req.body;
  const schema = Joi.object({
    postId: Joi.objectId().required(),
    dir: Joi.valid(1, 0, -1).required()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(400).json({ msg: "no user found" });

  const post = await Post.findById(postId);
  if (!post) return res.status(400).json({ msg: "no post by Id" });

  const upvotedPost = user.upvoted_posts.find(upvoted_post => upvoted_post.postId === postId);

  if (!upvotedPost) {
    user.upvoted_posts.push({ postId, upvote_dir: dir });
    post.upvotes += dir;
  } else if (upvotedPost.upvote_dir !== dir) {
    post.upvotes += dir - (upvotedPost.upvote_dir);
    upvotedPost.upvote_dir = dir;
  }
  res.json({ upvotes: post.upvotes });

  await user.save();
  await post.save();
});

// @route POST api/users/upvote/comment
// @desc POST upvote comments
// @access Private
router.post("/upvote/comment", auth, async (req, res) => {
  const { postId, commentId, dir } = req.body;
  const schema = Joi.object({
    postId: Joi.objectId().required(),
    commentId: Joi.objectId().required(),
    dir: Joi.valid(1, 0, -1).required()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ msg: "invalid body" });
  const user = await User.findById(req.user.id);
  if (!user) return res.status(400).json({ msg: "no user found" });
  const post = await Post.findById(postId);
  if (!post) return res.status(400).json({ msg: "no post by Id" });

  const upvotedCommentPost = user.upvoted_comments.find(
    upvoted_comment => upvoted_comment.postId === postId
  );
  const comment = post.comments.find(comment => {
    return comment._id.toString() === commentId
  });

  if (!upvotedCommentPost) {
    user.upvoted_comments.push({
      postId: postId,
      comments: [{
        commentId: commentId,
        upvote_dir: dir
      }]
    });
    comment.upvotes += dir;
    res.json({ upvotes: comment.upvotes })
  } else {
    const upvotedComment = upvotedCommentPost.comments.find(
      comment => comment.commentId === commentId
    );
    if (!upvotedComment) {
      upvotedCommentPost.comments.push({
        commentId: commentId,
        upvote_dir: dir
      });
      comment.upvotes += dir;
      res.json({ upvotes: comment.upvotes })
    } else {
      if (upvotedComment.upvote_dir !== dir) {
        comment.upvotes += dir - upvotedComment.upvote_dir;
        upvotedComment.upvote_dir = dir;
      }
      res.json({ upvotes: comment.upvotes });
    }
  }
  await user.save();
  await post.save();
});

module.exports = router;
