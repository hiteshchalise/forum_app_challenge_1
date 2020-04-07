const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    post_title: {
        type: String,
        require: true
    },
    post_body: {
        type: String,
        require: true
    },
    posted_by: {
        type: String, 
        require: true
    },
    posted_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema);