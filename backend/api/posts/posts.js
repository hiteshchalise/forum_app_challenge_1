const express = require("express");
const uuid = require("uuid");
const Post = require("../../model/Post");
const User = require("../../model/User");
const auth = require("./../../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
  // Post.find({}, (error, posts) => {
  //   res.json(posts);
  // });
  Post.find({}).sort({ "posted_at": "desc" }).limit(15).exec((error, posts) => {
    res.json(posts);
  })
});

// @route POST api/posts/
// @desc Submit new post
// @access Private
router.post("/", auth, (req, res) => {

  User.findById(req.user.id, (error, user) => {
    if (error) throw error;

    const newPost = new Post({
      post_title: req.body.post_title,
      post_body: req.body.post_body,
      posted_by: user.name,
    });

    if (!newPost.post_title || !newPost.post_body) {
      res.status(400).json({ msg: "Please include post's title and body" });
    }

    newPost
      .save()
      .then((post) => {
        res.json(post);
      })
      .catch((error) => res.json({ error }));
  });
});

// @route GET api/posts/:postId
// @desc Get post with postId
// @access Public
router.get("/:postId", (req, res) => {
  console.log(req.params.postId);
  if (req.params.postId === 'undefined') {
    console.log("here");
    res.status(400).json({ msg: "no postId found" });
  }
  else {
    const foundPost = Post.findById(req.params.postId, (error, post) => {
      if (error) throw error;

      res.json(post);
    })
  }
});

module.exports = router;
