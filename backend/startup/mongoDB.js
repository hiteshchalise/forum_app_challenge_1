const config = require('config')
const mongoose = require('mongoose')
const db = config.get('mongoURI')

module.exports = {
  mongoose,
  connect: () => {
    mongoose.connect(db)
  },
  disconnect: () => {
    mongoose.connection.close()
  }
}