const Joi = require('@hapi/joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255
  },
  email: {
    type: String,
    require: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    maxlength: 255
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
    maxlength: 1024
  },
  register_date: {
    type: Date,
    default: Date.now
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  voted_posts: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    dir: {
      type: Number,
      min: -1,
      max: 1
    }
  }],
  voted_comments: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    },
    dir: {
      type: Number,
      min: -1,
      max: 1
    }
  }]
})

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    email: Joi.string().max(255).pattern(new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')).required().email(),
    password: Joi.string().min(6).max(1024).required()
  })
  return schema.validate(user)
}


userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

userSchema.methods.generateAuthToken = function () {
  const authToken = jwt.sign(
    { id: this._id },
    config.get('ACCESS_TOKEN_SECRET'),
    { expiresIn: 3600 })
  return authToken
}

const User = mongoose.model('User', userSchema)
module.exports.User = User
module.exports.validateUser = validateUser
