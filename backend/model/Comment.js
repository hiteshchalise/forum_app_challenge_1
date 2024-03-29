const { Schema, default: mongoose } = require('mongoose')
const Joi = require('@hapi/joi')

const commentSchema = new Schema({
  comment_body: {
    type: String,
    require: true
  },
  commented_by: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true
    },
    name: {
      type: String
    },
    email: {
      type: String
    }
  },
  commented_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  child_comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  commented_at: {
    type: Date,
    default: Date.now
  },
  upvotes: {
    type: Number,
    default: 1
  }
})

function validateComment(comment) {
  const schema = Joi.object({
    comment_body: Joi.string().required()
  })
  return schema.validate(comment)
}

const Comment = mongoose.model('Comment', commentSchema)
module.exports.Comment = Comment
module.exports.validateComment = validateComment
