const config = require('config');
const mongoose = require('mongoose');
const db = config.get("mongoURI");

module.exports = {
    mongoose,
    connect: () => {
        mongoose.connect(
            db,
            { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

    },
    disconnect: (done) => {
        mongoose.disconnect(done);
    }
}