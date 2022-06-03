require('express-async-errors')
const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const middleware = require('../middleware/middleware')

const app = express()

app.use(express.static(path.join(__dirname, 'build')))
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})


app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(cookieParser())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(express.urlencoded({ extended: false }))
app.use('/api/posts', require('../route/posts'))
app.use('/api/users', require('../route/users'))
app.use('/api/auth', require('../route/auth'))

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)

module.exports = app