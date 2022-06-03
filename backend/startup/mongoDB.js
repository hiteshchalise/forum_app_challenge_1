const mongoose = require('mongoose')
const db = process.env.mongoURI

module.exports = {
  mongoose,
  connect: () => {
    return mongoose.connect(db)
  },
  disconnect: (done) => {
    mongoose.disconnect(done)
  }
}