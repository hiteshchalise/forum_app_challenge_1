const config = require('config')
const mongoose = require('mongoose')
const db = config.get('mongoURI')

module.exports = {
  mongoose,
  connect: () => {
    return mongoose.connect(db)
  },
  disconnect: (done) => {
    mongoose.disconnect(done)
  }
}