const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 255
    },
    email: {
        type: String,
        require: true,
        unique: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        maxlength: 255
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
        maxlength: 1024
    },
    register_date: {
        type: Date,
        default: Date.now
    },
    upvoted_posts: [{
        postId: String,
        upvote_dir: Number
    }],
    upvoted_comments: [{
        postId: String,
        comments: [{
            commentId: String,
            upvote_dir: Number
        }]
    }]
});

function validateUser(user) {
    const schema = {
        name: Joi.string().max(255).required(),
        email: Joi.string().max(255).pattern(new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')).required().email(),
        password: Joi.string().min(6).max(1024).required()
    };
    return Joi.validate(user, schema);
}

UserSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign(
        { id: this._id },
        config.get("REFRESH_TOKEN")
    );
    return refreshToken;
}

UserSchema.methods.generateAuthToken = function () {
    const authToken = jwt.sign(
        { id: this._id },
        config.get("ACCESS_TOKEN_SECRET"),
        { expiresIn: 3600 });
    return authToken;
}

//TODO: name of model from user to User maybe?
const User = mongoose.model('user', UserSchema);
module.exports.User = User;
module.exports.validate = validateUser;