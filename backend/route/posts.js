const express = require("express");
const uuid = require("uuid");
const Post = require("../model/Post");
const User = require("../model/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
  // Post.find({}, (error, posts) => {
  //   res.json(posts);
  // });
  console.log("Get Request");
  Post.find({}).sort({ "posted_at": "desc" }).limit(15).exec((error, posts) => {
    res.json(posts);
  })
});

// @route POST api/posts/
// @desc Submit new post
// @access Private
router.post("/", auth, (req, res) => {

  User.findById(req.user.id, (error, user) => {
    if (error) return res.status(404).json("User Not Found");

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
        console.log(post);
        user.upvoted_posts.push({ postId: post._id, upvote_dir: 1 });
        user.save();
        return res.json({ postId: post._id, upvote_dir: 1 });
      })
      .catch((error) => res.json({ error }));
  });
});

// @route GET api/posts/:postId
// @desc Get post with postId
// @access Public
router.get("/:postId", (req, res) => {
  console.log("Get request, api/posts/:postId, postId: ", req.params.postId);
  if (req.params.postId === 'undefined') {
    console.log("postId is undefined");
    res.status(400).json({ msg: "no postId found" });
  }
  else {
    Post.findById(req.params.postId, (error, post) => {
      if (error) {
        res.status(404).json({ msg: "no post found with that id" })
      }
      else {
        const comments = post.comments.sort((a, b) => b.commented_at - a.commented_at);
        res.json({
          "_id": post._id,
          "post_title": post.post_title,
          "post_body": post.post_body,
          "posted_by": post.posted_by,
          "posted_at": post.posted_at,
          "_v": post._v,
          "comments": comments,
          "upvotes": post.upvotes
        });
      }
    })
  }
});

// @route Post api/posts/:postId/comments/
// @desc Post comment in post with postId
// @access Private
router.post("/:postId/comments", auth, (req, res) => {
  console.log("Post request for adding comment with postId: ", req.params.postId);
  if (req.params.postId === 'undefined') {
    console.log("no post found with Id");
    res.status(400).json({ msg: "no postId found" });
  } else {
    // Post.updateOne({
    //   _id: req.params.postId
    // }, {
    //   $push: { comments: req.body }
    // }, (error, success) => {
    //   if (error) {
    //     console.log("error: " + error);
    //     return res.json({ msg: "error when wrting comment" });
    //   } else {
    //   }
    // })
    Post.findById(req.params.postId, (error, post) => {
      if (error) {
        return res.status(404).json({ msg: "no post found with that id" })
      }
      else {
        post.comments.push(req.body);
        post.save().then(
          () => {
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
          }
        ).catch(
          (error) => {
            console.log(error);
            return res.json({ error });
          }
        );

      }
    });
  }
});



module.exports = router;
