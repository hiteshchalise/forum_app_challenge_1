const _ = require('lodash')
const express = require('express')
const bcrypt = require('bcryptjs')
const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)
const router = express.Router()
const { User, validateUser } = require('../model/User')

// @route GET api/users
// @desc Get all users
// @access Public
router.get('/', async (req, res) => {
  const user = await User.find({})
  console.log(user)
  return res.json(user)
})

// @route POST api/users
// @desc Register new user
// @access Public
router.post('/', async (req, res) => {
  const { error } = validateUser(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).json({ error: 'Email not unique' })

  user = await User.findOne({ name: req.body.name })
  if (user) return res.status(400).json({ error: 'Username not unique' })

  user = new User(_.pick(req.body, ['name', 'email', 'password']))
  const saltRounds = 10
  user.password = await bcrypt.hash(user.password, saltRounds)

  await user.save()

  const authToken = user.generateAuthToken()

  return res.json({
    authToken,
    user: _.pick(user, ['_id', 'name', 'email'])
  })
})

// @route GET api/users/:id
// @desc GET user by user id
// @access Public
router.get('/:id', async (req, res) => {
  const user = await User.findOne({ _id: req.params.id })
  if (!user) return res.status(404).json({ 'error': 'User Not Found' })

  res.json(user)
})

module.exports = router
