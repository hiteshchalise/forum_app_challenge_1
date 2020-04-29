const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true
    },
    register_date: {
        type: Date,
        default: Date.now
    },
    upvoted_posts: [{
        postId: String,
        upvote_dir: Number
    }]
})

module.exports = User = mongoose.model('user', UserSchema);