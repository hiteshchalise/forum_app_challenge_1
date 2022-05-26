const _ = require('lodash')
const express = require('express')
const { User } = require('../model/User')
const Joi = require('@hapi/joi')
const bcrypt = require('bcryptjs')
const router = express.Router()

const validateAuth = (req) => {
  const schema = Joi.object({
    email: Joi.string().max(255).pattern(new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')).required().email(),
    password: Joi.string().min(6).max(1024).required()
  })

  return schema.validate(req)
}

// @route POST api/auth/
// @desc Authenticate user
// @access Public
router.post('/', async (req, res) => {
  const { email, password } = req.body
  const { error } = validateAuth(req.body)
  if (error) {
    console.log('error ', error)
    return res.status(400).json({ msg: error.details[0].message })
  }

  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ msg: 'No user by that email' })

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return res.status(400).json({ msg: 'Invalid Credential' })

  // const refreshToken = user.generateRefreshToken();
  const authToken = user.generateAuthToken()

  res.json({
    authToken,
    user: _.pick(user, ['_id', 'name', 'email', 'upvoted_posts', 'upvoted_comments'])
  })
})

module.exports = router
