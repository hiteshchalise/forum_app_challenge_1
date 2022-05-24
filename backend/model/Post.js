const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  post_title: {
    type: String,
    require: true
  },
  post_body: {
    type: String,
    require: true
  },
  posted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  posted_at: {
    type: Date,
    default: Date.now
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  upvotes: {
    type: Number,
    default: 0
  }
});

function validatePost(post) {
  const schema = Joi.object({
    post_title: Joi.string().required(),
    post_body: Joi.string().required()
  });
  return schema.validate(post);
}

function validateComment(comment) {
  const schema = Joi.object({
    comment_body: Joi.string().required()
  });
  return schema.validate(comment);
}

const Post = mongoose.model('Post', postSchema);
module.exports.Post = Post;
module.exports.validatePost = validatePost;
module.exports.validateComment = validateComment;
