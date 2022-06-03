const Joi = require('@hapi/joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
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
    default: 1
  }
})

postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

function validatePost(post) {
  const schema = Joi.object({
    post_title: Joi.string().required(),
    post_body: Joi.string().required()
  })
  return schema.validate(post)
}

const Post = mongoose.model('Post', postSchema)
module.exports.Post = Post
module.exports.validatePost = validatePost
