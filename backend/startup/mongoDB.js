const config = require('config');
const mongoose = require('mongoose');
const db = config.get("mongoURI");

module.exports = {
  mongoose,
  connect: () => {
    mongoose.connect(db)
      .then(() => {
        console.log('Successfully connected to MongoDB')
      })
      .catch((error) => {
        console.error(`Error connecting to MongoDb ${error.message}`)
      })
  },
  disconnect: (done) => {
    mongoose.disconnect(done);
  }
}