const express = require('express')
const { Post, validatePost } = require('../model/Post')
const { User } = require('../model/User')
const validateObjectId = require('../middleware/validateObjectId')
const auth = require('../middleware/auth')
const { Comment, validateComment } = require('../model/Comment')
const Joi = require('@hapi/joi')

const router = express.Router()

// @route GET api/posts/
// @desc Get all posts
// @access Public
router.get('/', async (req, res) => {
  const posts = await Post.find({
    post_title: { $ne: '[removed]' }
  })
    .populate({
      path: 'comments',
      populate: { path: 'child_comments' }
    })
    .sort({ 'posted_at': 'desc' })
    .limit(15)

  res.json(posts)
})

// @route GET api/posts/:postId
// @desc Get post with postId
// @access Public
router.get('/:postId', validateObjectId, async (req, res) => {
  const post = await Post
    .findById(req.params.postId)
    .populate({
      path: 'comments',
      populate: {
        path: 'child_comments',
        populate: { path: 'child_comments' }
      }
    })
    .sort({ 'posted_at': 'asc' })
    .limit(15)
  if (!post) return res.status(404).json({ error: 'no post found with that id' })

  post.comments.sort((a, b) => b.commented_at - a.commented_at)
  res.json(post)
})

// @route POST api/posts/
// @desc Submit new post
// @access Private
router.post('/', auth, async (req, res) => {

  const { error } = validatePost(req.body)
  if (error) return res.status(400).json({ msg: error.details[0].message })

  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).json('User Not Found')

  const newPost = new Post({
    post_title: req.body.post_title,
    post_body: req.body.post_body,
    posted_by: {
      id: user._id,
      name: user.name,
      email: user.email
    },
  })

  const post = await newPost.save()
  user.posts = user.posts.concat({ _id: post._id })
  user.voted_posts = user.voted_posts.concat({ _id: post._id, dir: 1 })
  await user.save()

  return res.status(201).json(post)
})

// @route DELETE api/posts/:postId
// @desc Remove post by id
// @access Private
router.delete('/:postId', auth, async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).json('User Not Found')

  const post = await Post
    .findById(req.params.postId)
  if (!post) return res.status(404).json({ error: 'no post found with that id' })

  post.post_title = '[removed]'
  post.post_body = '[removed]'
  await post.save()
  return res.status(204)
})

// @route Post api/posts/:postId/comments/
// @desc Post comment in post with postId
// @access Private
router.post('/:postId/comments', auth, async (req, res) => {
  const { error } = validateComment(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const post = await Post.findById(req.params.postId)
  if (!post) return res.status(404).json({ error: 'no post found with that id' })

  const user = await User.findById(req.user.id)
  if (!user) return res.status(400).json({ error: 'User not found' })

  const comment = new Comment({
    comment_body: req.body.comment_body,
    commented_by: {
      _id: user._id,
      name: user.name,
      email: user.email
    },
    commented_to: post._id
  })
  await comment.save()

  post.comments.push(comment._id)
  await post.save()

  user.voted_comments.push({ _id: comment._id, dir: 1 })
  await user.save()

  await post
    .populate({
      path: 'comments',
      populate: { path: 'child_comments' }
    })
  post.comments.sort((a, b) => b.commented_at - a.commented_at)

  // return res.json(_.pick(post, ["_id", "post_title", "post_body", "posted_by", "posted_at", "comments", "upvotes"]));
  res.status(201).json(post)
})

// @route GET api/posts/:postId/comments/:commentId
// @desc Get comment with commentId of post with postId, with three level deep child comments
// @access PUBLIC
router.get('/:postId/comments/:commentId', async (req, res) => {

  const post = await Post.findById(req.params.postId)
  if (!post) return res.status(404).json({ error: 'no post found with that id' })

  const comment = await Comment.findById(req.params.commentId)
  if (!comment) return res.status(400).json({ error: 'Comment not found' })

  const populatedComment = await comment.populate({
    path: 'child_comments',
    populate: {
      path: 'child_comments',
      populate: { path: 'child_comments' }
    }
  })

  res.status(200).json(populatedComment)
})

// @route Post api/posts/:postId/comments/:commentId
// @desc Submit comment under comment with commentId of post with postId.
// @access Private
router.post('/:postId/comments/:commentId', auth, async (req, res) => {

  const { error } = validateComment(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const post = await Post.findById(req.params.postId)
  if (!post) return res.status(404).json({ error: 'no post found with that id' })

  const user = await User.findById(req.user.id)
  if (!user) return res.status(400).json({ error: 'User not found' })

  const parentComment = await Comment.findById(req.params.commentId)
  if (!parentComment) return res.status(400).json({ error: 'Comment not found' })

  const comment = new Comment({
    comment_body: req.body.comment_body,
    commented_by: {
      _id: user._id,
      name: user.name,
      email: user.email
    },
    commented_to: req.params.postId,
  })

  await comment.save()

  user.voted_comments.push({ _id: comment._id, dir: 1 })
  await user.save()

  parentComment.child_comments.push({ _id: comment._id })
  await parentComment.save()

  const populatedPost = await post.populate({
    path: 'comments',
    populate: { path: 'child_comments' }
  })

  return res.status(201).json(populatedPost)
})



// @route POST api/posts/upvote
// @desc POST upvote when user wants to upvote or downvote a post
// @access Private
router.post('/upvote', auth, async (req, res) => {
  const { postId, dir } = req.body
  const schema = Joi.object({
    postId: Joi.objectId().required(),
    dir: Joi.valid(1, 0, -1).required()
  })
  const { error } = schema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const post = await Post.findById(postId)
  if (!post) return res.status(404).json({ error: 'no post by Id' })

  const user = await User.findById(req.user.id)
  if (!user) return res.status(401).json({ error: 'no user found' })

  const votedPost = user.voted_posts.find(
    voted_post => voted_post._id && voted_post._id.toString() === post._id.toString()
  )
  if (!votedPost) {
    user.voted_posts.push({ _id: postId, dir })
    post.upvotes += dir
  } else if (votedPost.dir !== dir) {
    // if user_voted dir goes from -1 to 1 OR 1 to -1, final upvotes in post should increase OR decrease by 2
    // 0 to 1 -> +1
    // 0 to -1 -> -1
    // 1 to 0 | -1 to 0 -> -1 & +1 respectively
    post.upvotes += dir - (votedPost.dir)
    votedPost.dir = dir
  }

  await user.save()
  await post.save()
  res.status(200).json({ upvotes: post.upvotes })

})

// @route POST api/posts/upvote/comment
// @desc POST upvote comments
// @access Private
router.post('/upvote/comment', auth, async (req, res) => {
  const { commentId, dir } = req.body
  const schema = Joi.object({
    commentId: Joi.objectId().required(),
    dir: Joi.valid(1, 0, -1).required()
  })
  const { error } = schema.validate(req.body)
  if (error) return res.status(400).json({ error: 'invalid body' })

  const user = await User.findById(req.user.id)
  if (!user) return res.status(401).json({ error: 'no user found' })

  const comment = await Comment.findById(commentId)
  if (!comment) return res.status(404).json({ error: 'no comment found for id.' })

  const votedComment = user.voted_comments.find(
    votedComment => votedComment._id.toString() === commentId
  )

  if (!votedComment) {
    user.voted_comments.push({
      _id: comment._id,
      dir
    })
    comment.upvotes += dir
  } else if (votedComment.dir !== dir) {
    // if user_voted dir goes from -1 to 1 OR 1 to -1, final upvotes in comment should increase OR decrease by 2
    // 0 to 1 -> +1
    // 0 to -1 -> -1
    // 1 to 0 | -1 to 0 -> -1 & +1 respectively
    comment.upvotes += dir - (votedComment.dir)
    votedComment.dir = dir
  }

  await user.save()
  await comment.save()

  res.json({ upvotes: comment.upvotes })
})


module.exports = router
