const Joi = require('@hapi/joi');
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

function validatePost(post) {
    const schema = Joi.object({
        post_title: Joi.string().required(),
        post_body: Joi.string().required()
    });
    return schema.validate(post);
}

function validateComment(comment) {
    const schema = Joi.object({
        comment_body: Joi.string().required()
    });
    return schema.validate(comment);
}

const Post = mongoose.model('post', PostSchema);
module.exports.Post = Post;
module.exports.validatePost = validatePost;
module.exports.validateComment = validateComment;
