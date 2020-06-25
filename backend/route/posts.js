const express = require("express");
const uuid = require("uuid");
const Post = require("../model/Post");
const User = require("../model/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find({})
    .sort({ "posted_at": "desc" })
    .limit(15);

  res.json(posts);
});

// @route POST api/posts/
// @desc Submit new post
// @access Private
router.post("/", auth, async (req, res) => {

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json("User Not Found");

  const newPost = new Post({
    post_title: req.body.post_title,
    post_body: req.body.post_body,
    posted_by: user.name,
  });

  //TODO: joi validation
  if (!newPost.post_title || !newPost.post_body) {
    res.status(400).json({ msg: "Please include post's title and body" });
  }

  const post = await newPost.save();

  user.upvoted_posts.push({ postId: post._id, upvote_dir: 1 });
  user.save();

  return res.json({ postId: post._id, upvote_dir: 1 });
});

// @route GET api/posts/:postId
// @desc Get post with postId
// @access Public
router.get("/:postId", async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) return res.status(404).json({ msg: "no post found with that id" })

  const comments = post.comments.sort((a, b) => b.commented_at - a.commented_at);
  res.json({
    "_id": post._id,
    "post_title": post.post_title,
    "post_body": post.post_body,
    "posted_by": post.posted_by,
    "posted_at": post.posted_at,
    "comments": comments,
    "upvotes": post.upvotes
  });

});

// @route Post api/posts/:postId/comments/
// @desc Post comment in post with postId
// @access Private
router.post("/:postId/comments", auth, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ msg: "no post found with that id" });

  post.comments.push(req.body);
  await post.save();

  const comments = post.comments.sort((a, b) => b.commented_at - a.commented_at);
  return res.json({
    "_id": post._id,
    "post_title": post.post_title,
    "post_body": post.post_body,
    "posted_by": post.posted_by,
    "posted_at": post.posted_at,
    "_v": post._v,
    "comments": comments,
    "upvotes": post.upvotes
  });
});



module.exports = router;
