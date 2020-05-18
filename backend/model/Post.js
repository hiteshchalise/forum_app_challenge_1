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
    },
    comments: [{
        comment_body: {
            type: String,
            require: true
        },
        commented_by: {
            type: String,
            require: true
        },
        commented_at: {
            type: Date,
            default: Date.now
        },
        upvotes: {
            type: Number,
            default: 1
        }
    }],
    upvotes: {
        type: Number,
        default: 1
    }
});

module.exports = Post = mongoose.model('post', PostSchema);